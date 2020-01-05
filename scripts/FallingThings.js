import {scene, animFunctions, THREE, loadObjs2, debugArgs} from './threeHandler.js';
export {loadObjects, addLights};

let objPrototypes = [];
let boxSize = 20;
let objCount = 500;

function loadObjects(args) {
    if (args && args.boxSize) boxSize = args.boxSize;
    if (args && args.objCount) objCount = args.objCount;
    
    addObjects();
}

function addObject(name, mesh) {
//    let geometry = new THREE.BoxGeometry(1, 1, 1);
//    let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
//    let fallingObj = new THREE.Mesh(geometry, material);
    
    let fallingObj = mesh.clone();
    fallingObj.scale.set(0.1, 0.1, 0.1);
    
    fallingObj.name = name;
    scene.add(fallingObj);

    // random x position constrained within window.
    let sign  = Math.random() >= 0.5? 1: -1;
    let sign2 = Math.random() >= 0.5? 1: -1;
    let sign3 = Math.random() >= 0.5? 1: -1;
    
    // start at a random x, y, z position within the box.
    fallingObj.position.x = sign * Math.random() * boxSize; //window.innerWidth / 2;
    fallingObj.position.z = sign2 * Math.random() * boxSize; //window.innerWidth / 2;
    //fallingObj.position.y = 10 + 10 * Math.random();
    fallingObj.position.y = sign3 * boxSize * Math.random();

    fallingObj.userData.startY = fallingObj.position.y;
    fallingObj.userData.startX = fallingObj.position.x;
    fallingObj.userData.startZ = fallingObj.position.z;

    fallingObj.userData.rotation = [Math.random() * 0.01, Math.random() * 0.01, Math.random() * 0.01];

    // animation function for this object.
    let func1 = () => {
        let obj = scene.getObjectByName(name);
        obj.rotation.x += obj.userData.rotation[0];
        obj.rotation.y += obj.userData.rotation[1];
        obj.rotation.z += obj.userData.rotation[2];

        obj.position.y -= 0.01;
        obj.position.x = fallingObj.userData.startX + Math.sin(obj.position.y);
        obj.position.z = fallingObj.userData.startZ + Math.sin(obj.position.z);

        // reset position when it goes offscreen at the bottom.
        //if (obj.position.y < -window.innerHeight / 2) obj.position.y = - window.innerHeight / 2;
        //if (obj.position.y < -10) obj.position.y = obj.userData.startY;
        if (obj.position.y < -boxSize) obj.position.y = boxSize;
    }
    // maybe just attach the anim function to the object's userData.
    animFunctions.push(func1);

    //console.log(cube);
    //console.log(scene);
}

function addLights() {
    var light = new THREE.PointLight( 0xff0000, 1, 100 );
    light.position.set( 50, 50, 50 );
    scene.add( light );    
}

// add objects: import the object geometry / texture and then add x number of objects.
function addObjects() {
    const objInfo = [
        {
            name: 'Snowflake1',
            mesh: '../resources/models/snowflake.obj',
            map: '../resources/images/snowflake1.png',
            normalMap: '../resources/images/snowflake1-normal.png'
        },
        {
            name: 'Snowflake2',
            mesh: '../resources/models/snowflake2.obj',
            map: '../resources/images/libbrecht.snowflake2.jpg',
            normalMap: '../resources/images/libbrecht.snowflake2-normal.jpg'
        }
    ];
    
    const objData = [];
    objInfo.forEach(() => {objData.push({});});  
    
    loadObjs2(objInfo).then(output => {
        objInfo.map((obj, index, arr) => {
            let objMesh = obj.mesh.children[0];
            let material = {};
            if (debugArgs.basicMaterial) {
                material = new THREE.MeshBasicMaterial({map: obj.map});
            } else {
                material = new THREE.MeshStandardMaterial({
                    map: obj.map,
                    normalMap: obj.normalMap
                });               
            }
            objMesh.material = material;
            
            objPrototypes.push(objMesh);
        });
        
        for (let x = 0; x < objCount; x++) {
            let objSample = objPrototypes[Math.round(Math.random() * (objPrototypes.length - 1))]
            console.log(Math.round(Math.random() * objPrototypes.length));
            addObject('obj'+x, objSample);
        }
    });
    // chain some promises? here.
    
//    loadObj('../resources/models/snowflake.obj', {obj: true}, (root) => {
//        //scene.add(root);
//        objMesh = root.children[0];
//        let texture = new THREE.TextureLoader().load('../resources/images/snowflake1.png');
//        let normalTexture = new THREE.TextureLoader().load('../resources/images/snowflake1-normal.png');
//        let material = new THREE.MeshStandardMaterial({map : texture, normalMap: normalTexture});
//        objMesh.material = material;
//        
//        objPrototypes.push(objMesh);
//        
//        for (let x = 0; x < objCount; x++) {
//            addObject('obj'+x);
//        }
//    });
    
    //loadObjPromise(paths);
    
}