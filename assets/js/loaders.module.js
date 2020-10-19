
import { PLYLoader } from './libs/three/PLYLoader.module.js';
import { PCDLoader } from './libs/three/PCDLoader.module.js';

const ply_loader = new PLYLoader();
const pcd_loader = new PCDLoader();

let ply = (buffer, callback) => {

    // Load the PLY file from the buffer
    const geometry = ply_loader.parse(buffer)

    // Build the geometry surface
    geometry.computeVertexNormals(false);

    callback(geometry)
}

let pcd = (buffer, callback) => {

    // Load the PCD file from the buffer
    const points = pcd_loader.parse(buffer, '')

    callback(points)
}

export {ply, pcd};