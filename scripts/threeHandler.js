let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
let controls = new THREE.OrbitControls(camera, renderer.domElement);

let animFunctions = [];

function load() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //camera.position.z = 5;
    camera.position.z = 5;

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    let axesHelper = new THREE.AxesHelper( 50 );
    scene.add( axesHelper );

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // run each custom animation function.
    for (var x = 0; x < animFunctions.length; x++) {
        animFunctions[x]();
    }

    renderer.render(scene, camera);
}

window.onresize = () => {
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export {load, scene, animFunctions};