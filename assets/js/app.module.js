
import * as renderer from './renderer.module.js';
import * as form from './form.module.js';

let init = () => {
    form.init((houseId) => {
        displayHouse(houseId)
    })
}


let displayHouse = (houseId) => {

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

                            // Render the scene
                            renderer.init(land, vegetation, house, JSON.parse(offsets))
                            renderer.animate()
                        })
                    })
                })
            })
        })
}

export {init};