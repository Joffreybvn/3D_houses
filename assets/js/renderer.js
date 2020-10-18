
import * as THREE from './three.r119.module.js';
import * as LOADERS from './loaders.js';
import { TrackballControls } from './three/TrackballControls.module.js';

let canvas, renderer, scene, camera, controls;

let init = (land, vegetation, house, offsets) => {
    console.log(offsets.land.x)

    // Canvas definition
    canvas = document.getElementById('render');

    // Renderer definition
    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Scene definition
    scene = new THREE.Scene();

    // Camera's constants
    const fov = 70;
    const aspect = window.innerWidth / window.innerHeight;  // 2 the canvas default
    const near = 0.1;
    const far = 1000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);

    // Camera controls
    controls = new TrackballControls(camera, renderer.domElement);

    // Load land PLY
    LOADERS.ply(land, (geometry) => {
        geometry.translate(offsets.land.x, offsets.land.y, offsets.land.z)

        // Set mesh color and set double side (avoid see through)
        const material = new THREE.MeshBasicMaterial({color: 0x567d46, side: THREE.DoubleSide});
        const mesh = new THREE.Mesh(geometry, material);

        // Allow shadow
        mesh.receiveShadow = true;

        // Display edge lines
        const edges = new THREE.EdgesGeometry(geometry);
        const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x000000}));

        scene.add(lines);
        scene.add(mesh);
    })

    // Load house PLY
    LOADERS.ply(house, (geometry) => {

        // Set mesh color and set double side (avoid see through)
        const material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
        const mesh = new THREE.Mesh(geometry, material);

        // Allow shadow and translate to (0, 0, 0)
        mesh.receiveShadow = true;
        mesh.geometry.translate(offsets.land.x + offsets.house.x, offsets.land.y + offsets.house.y, offsets.land.z)

        scene.add(mesh);
    })

    // Load vegetation PCD
    LOADERS.pcd(vegetation, (points) => {

        // Set points size and color
        points.material.size = 0.5
        points.material.color.setHex(0x3A5F0B)

        // Translate to (0, 0, 0)
        //points.geometry.translate(tran_x, tran_y, tran_z)
        points.geometry.translate(offsets.land.x, offsets.land.y, offsets.land.z)
        scene.add(points);
    })

    //console.log(scene)
}

let animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    render()
}

let render = () => {
    renderer.render(scene, camera);
}

export {init, animate};