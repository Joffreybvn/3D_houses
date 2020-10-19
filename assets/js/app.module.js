
import * as renderer from './renderer.module.js';
import * as form from './form.module.js';

let init = () => {
    manageForm()
    displayHouse()
}

let manageForm = () => {
    form.init()
}


let displayHouse = () => {

    new JSZip.external.Promise((resolve, reject) => {

        // Load the zip as binary file
        JSZipUtils.getBinaryContent('./assets/3d/data.zip', (err, data) => {
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
            zip.file("data/land.ply").async('arraybuffer').then((land) => {

                // Load vegetation.pcd
                zip.file("data/vegetation.pcd").async('arraybuffer').then((vegetation) => {

                    // Load house.ply
                    zip.file("data/house.ply").async('arraybuffer').then((house) => {

                        // Load offsets.json
                        zip.file("data/offsets.json").async("text").then((offsets) => {

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