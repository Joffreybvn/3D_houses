
import * as share from './share.module.js';
import * as renderer from './renderer.module.js';
import * as form from './form.module.js';
import * as map from './map.module.js';
import * as details from './details.module.js';

let init = () => {

    share.onPageLoad((error, houseId) => {

        // Map and details tab init
        map.init()
        details.init()

        // If this page is not opened with a sharing link, execute the page normally.
        if (error) {

            form.init((houseId) => {
                displayHouse(houseId)
            })
        }

        // If the page is opened with a sharing link, display the house.
        else {
            form.lockForm()
            displayHouse(houseId)
        }
    })
}

let displayHouse = (houseId, onRenderingComplete) => {
    console.log(houseId)

    new JSZip.external.Promise((resolve, reject) => {

        // Load the zip as binary file
        JSZipUtils.getBinaryContent('https://api.wallonia.ml/v1/model/' + houseId, (err, data) => {
            resolve(data);
        });
    })
        // Open the zip
        .then((data) => {
            return JSZip.loadAsync(data);
        })

        // Load the files
        .then((zip) => {

            // Get the list of houses file names
            let houses_files = Object.keys(zip.files).filter((str) => {
                return str.includes('.ply')
            });

            // Load all houses
            Promise.allSettled(houses_files.map((house) => {
                return new Promise((resolve, reject) => {

                    // Retrieve the house index
                    let index = parseInt(house.slice(0, -4))

                    // Unzip the house
                    zip.file(house).async('arraybuffer').then((result) => {
                        resolve([index, result])
                    })
                })

            })).then((houses) => {

                // Load the land, vegetation and metadata
                Promise.allSettled([
                    zip.file("land._ply").async('arraybuffer'),
                    zip.file("vegetation.pcd").async('arraybuffer'),
                    zip.file("metadata.json").async("text")

                ]).then((meshes) => {

                    const json = JSON.parse(meshes[2].value)

                    // Init the scene rendering
                    renderer.init(meshes[0].value, meshes[1].value, houses, json.offsets)

                    // Display the canvas
                    form.unlockForm()

                    // Render the scene
                    renderer.animate()

                    // Display the share, map and details tab
                    share.displayShareData(houseId)
                    map.unlockMap(json.meta)

                    details.resetCheckBoxes()
                    details.addDetails(json.details)
                })
            })
        })
}

export {init};