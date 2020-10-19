
import * as THREE from './three.r119.module.js';
import * as LOADERS from './loaders.module.js';
import { TrackballControls } from './three/TrackballControls.module.js';

let canvas, renderer, scene, camera, controls;

let init = (land, vegetation, house, offsets) => {

    // Canvas definition
    canvas = document.getElementById('render');

    // Renderer definition
    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Scene definition
    scene = new THREE.Scene();

    // Camera's constants
    const fov = 70;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 10000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 40, 30);
    camera.lookAt(0, 0, 0);

    // Camera controls
    controls = new TrackballControls(camera, renderer.domElement);

    // Lights
    const light = new THREE.DirectionalLight( 0xaabbff, 0.3 );
    light.position.x = 300;
    light.position.y = 250;
    light.position.z = - 500;
    scene.add(light);

    // Sky Dome
    const vertexShader = document.getElementById( 'vertexShader' ).textContent;
    const fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
    const uniforms = {
        topColor: { value: new THREE.Color( 0x0077ff ) },
        bottomColor: { value: new THREE.Color( 0xffffff ) },
        offset: { value: 400 },
        exponent: { value: 0.6 }
    };
    uniforms.topColor.value.copy( light.color );

    const skyGeo = new THREE.SphereBufferGeometry(4000, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide
    });

    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // Object rotation
    const x_rotation = - Math.PI / 2;

    // Load land PLY
    LOADERS.ply(land, (geometry) => {

        // Translate to (0, 0, 0)
        geometry.translate(offsets.land.x, offsets.land.y, offsets.land.z)

        // Set mesh color and set double side (avoid see through)
        const material = new THREE.MeshBasicMaterial({color: 0x567d46, side: THREE.DoubleSide});
        const mesh = new THREE.Mesh(geometry, material);

        // Allow shadow
        mesh.receiveShadow = true;
        mesh.rotation.x = x_rotation

        // Display edge lines
        const edges = new THREE.EdgesGeometry(geometry);
        const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x3e5d32}));
        lines.rotation.x = x_rotation

        scene.add(lines);
        scene.add(mesh);
    })

    // Load house PLY
    LOADERS.ply(house, (geometry) => {

        // Set mesh color and set double side (avoid see through)
        const material = new THREE.MeshPhongMaterial({color: 0xdddddd, specular: 0x009900, shininess: 30, flatShading: true, side: THREE.DoubleSide})
        const mesh = new THREE.Mesh(geometry, material);

        // Allow shadow and translate to (0, 0, 0)
        mesh.receiveShadow = true;
        mesh.geometry.translate(offsets.land.x + offsets.house.x, offsets.land.y + offsets.house.y, offsets.land.z)
        mesh.rotation.x = x_rotation

        scene.add(mesh);
    })

    // Load vegetation PCD
    LOADERS.pcd(vegetation, (points) => {

        // Set points size and color
        points.material.size = 0.5
        points.material.color.setHex(0x3A5F0B)

        // Translate to (0, 0, 0)
        points.geometry.translate(offsets.land.x, offsets.land.y, offsets.land.z)
        points.rotation.x = x_rotation

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