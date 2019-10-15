import {scene, animFunctions} from './threeHandler.js';
export {addObjects, addLights};

function addObject(name) {
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    let cube = new THREE.Mesh(geometry, material);
    cube.name = name;
    scene.add(cube);

    // random x position constrained within window.
    let sign = Math.random() >= 0.5? 1: -1;
    cube.position.x = sign * Math.random() * 10; //window.innerWidth / 2;
    cube.position.y = 10 + 10 * Math.random();

    cube.userData.startY = cube.position.y;

    cube.userData.rotation = [Math.random() * 0.01, Math.random() * 0.01, Math.random() * 0.01];

    // animation function for this object.
    let func1 = () => {
        let obj = scene.getObjectByName(name);
        obj.rotation.x += obj.userData.rotation[0];
        obj.rotation.y += obj.userData.rotation[1];
        obj.rotation.z += obj.userData.rotation[2];

        obj.position.y -= 0.01;

        // reset position when it goes offscreen at the bottom.
        //if (obj.position.y < -window.innerHeight / 2) obj.position.y = - window.innerHeight / 2;
        if (obj.position.y < -10) obj.position.y = obj.userData.startY;
    }
    // maybe just attach the anim function to the object's userData.
    animFunctions.push(func1);

    console.log(cube);
    console.log(scene);
}

function addLights() {
    var light = new THREE.PointLight( 0xff0000, 1, 100 );
    light.position.set( 50, 50, 50 );
    scene.add( light );    
}

function addObjects() {
    for (let x = 0; x < 10; x++) {
        addObject('obj'+x);
    }
}