
import * as THREE from './libs/three.r119.module.js';
import * as LOADERS from './loaders.module.js';
import { TrackballControls } from './libs/three/TrackballControls.module.js';

let canvas, renderer, scene, camera, controls,
    mesh_land, lines_land, mesh_house, points_vegetation;

let init = (land, vegetation, houses, land_offsets, house_offsets) => {

    // Canvas definition
    canvas = document.getElementById('render');

    // Renderer definition
    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Scene definition
    scene = new THREE.Scene();
    scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
    scene.fog = new THREE.Fog( scene.background, 1, 5000 );

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

    // Source: https://github.com/mrdoob/three.js/blob/dev/examples/webgl_lights_hemisphere.html
    // Lights
    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 50, 0 );
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( - 1, 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );
    scene.add( dirLight );

    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    const d = 50;

    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = - 0.0001;

    // Ground
    const groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
    const groundMat = new THREE.MeshLambertMaterial( {color: 0xffffff} );
    groundMat.color.setHSL( 0.095, 1, 0.75 );

    const ground = new THREE.Mesh( groundGeo, groundMat );
    ground.position.y = - 33;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add( ground );

    // Sky dome
    const vertexShader = document.getElementById( 'vertexShader' ).textContent;
    const fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
    const uniforms = {
        "topColor": { value: new THREE.Color( 0x0077ff ) },
        "bottomColor": { value: new THREE.Color( 0xffffff ) },
        "offset": { value: 33 },
        "exponent": { value: 0.6 }
    };
    uniforms[ "topColor" ].value.copy( hemiLight.color );

    scene.fog.color.copy( uniforms[ "bottomColor" ].value );

    const skyGeo = new THREE.SphereBufferGeometry( 4000, 32, 15 );
    const skyMat = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide
    } );

    const sky = new THREE.Mesh( skyGeo, skyMat );
    scene.add(sky);

    // Object rotation
    const x_rotation = - Math.PI / 2;

    // Load land PLY
    LOADERS.ply(land, (geometry) => {

        // Translate to (0, 0, 0)
        geometry.translate( - land_offsets.x, - land_offsets.y, - land_offsets.z)

        // Set mesh color and set double side (avoid see through)
        const material = new THREE.MeshLambertMaterial( { color: 0x567D46, side: THREE.DoubleSide} )
        mesh_land = new THREE.Mesh(geometry, material);

        // Rotate land
        mesh_land.rotation.x = x_rotation

        // Display edge lines
        const edges = new THREE.EdgesGeometry(geometry);
        lines_land = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x3e5d32}));
        lines_land.rotation.x = x_rotation

        scene.add(lines_land);
        scene.add(mesh_land);
    })

    // Load house PLY
    for (let house of houses) {

        const i = house.value[0]
        const buffer = house.value[1]

        LOADERS.ply(buffer, (geometry) => {

            // Set mesh color and set double side (avoid see through)
            const material = new THREE.MeshPhongMaterial({color: 0x7c818b, specular: 0x7d4031, shininess: 10, flatShading: true, side: THREE.DoubleSide})
            mesh_house = new THREE.Mesh(geometry, material);

            // Allow shadow and translate to (0, 0, 0)
            mesh_house.receiveShadow = true;
            mesh_house.geometry.translate(house_offsets[i].x, house_offsets[i].y, - house_offsets[i].z)
            mesh_house.rotation.x = x_rotation

            scene.add(mesh_house);
        })
    }

    // Load vegetation PCD
    LOADERS.pcd(vegetation, (points) => {
        points_vegetation = points

        // Set points size and color
        points_vegetation.material.size = 0.5
        points_vegetation.material.color.setHex(0x3A5F0B)

        // Translate to (0, 0, 0)
        points_vegetation.geometry.translate( - land_offsets.x,  - land_offsets.y, - land_offsets.z)
        points_vegetation.rotation.x = x_rotation

        scene.add(points_vegetation);
    })
}

let animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    render()
}

let render = () => {
    renderer.render(scene, camera);
}

// Display functions

let displayHouse = (state) => {
    mesh_house.visible = state
}

let displayLand = (state) => {
    mesh_land.visible = state
}

let displayLandLines = (state) => {
    lines_land.visible = state
}

let displayVegetation = (state) => {
    points_vegetation.visible = state
}

export {init, animate, displayHouse, displayLand, displayLandLines, displayVegetation};