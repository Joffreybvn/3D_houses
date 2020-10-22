
import * as share from './share.module.js';
import * as renderer from './renderer.module.js';
import * as form from './form.module.js';

let init = () => {

    share.onPageLoad((error, houseId) => {

        // If this page is not opened with a sharing link, execute the page normally.
        if (error) {

            form.init((houseId) => {
                displayHouse(houseId, () => {
                    form.unlockForm()
                })
            })
        }

        // If the page is opened with a sharing link, display the house.
        else {
            form.lockForm()

            displayHouse(houseId, () => {
                form.unlockForm()
            })
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
                        zip.file("offsets.json").async("text").then((offsets) => {

                            // Init the scene rendering
                            renderer.init(land, vegetation, house, JSON.parse(offsets))

                            // Return a callback when the init is complete
                            onRenderingComplete(true)

                            // Keep the scene up to date
                            renderer.animate()
                        })
                    })
                })
            })
        })
}

export {init};