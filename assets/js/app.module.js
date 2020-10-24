
import * as share from './share.module.js';
import * as renderer from './renderer.module.js';
import * as form from './form.module.js';
import * as map from './map.module.js';

let init = () => {

    share.onPageLoad((error, houseId) => {

        // Init the map
        map.init()

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

    new JSZip.external.Promise((resolve, reject) => {

        // Load the zip as binary file
        JSZipUtils.getBinaryContent('https://api.wallonia.ml/v1/model/' + houseId + '/', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
        // Open the zip
        .then((data) => {
            return JSZip.loadAsync(data);
        })

        // Load the files
        .then((zip) => {

            // Load land.ply
            zip.file("land.ply").async('arraybuffer').then((land) => {

                // Load vegetation.pcd
                zip.file("vegetation.pcd").async('arraybuffer').then((vegetation) => {

                    // Load house.ply
                    zip.file("house.ply").async('arraybuffer').then((house) => {

                        // Load offsets.json
                        zip.file("metadata.json").async("text").then((result) => {

                            const json = JSON.parse(result)

                            // Init the scene rendering
                            renderer.init(land, vegetation, house, json.offsets)

                            // Display the canvas
                            form.unlockForm()

                            // Render the scene
                            renderer.animate()

                            // Display the share and map tab
                            share.displayShareData(houseId)
                            map.unlockMap(json.meta)
                        })
                    })
                })
            })
        })
}

export {init};