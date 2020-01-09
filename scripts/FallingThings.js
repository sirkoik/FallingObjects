import {scene, animFunctions, THREE, loadObjs2, sceneArgs, debugArgs} from './threeHandler.js';
import {hdrCubeRenderTarget} from './SceneSetup.js';

export {loadObjects, addLights};

let objPrototypes = [];
let boxSize = 20;
let objCount = 500;
let maxOpacity = 0.8;

function loadObjects(args) {
    if (args && args.boxSize) boxSize = args.boxSize;
    if (args && args.objCount) objCount = args.objCount;
    if (args && args.maxOpacity) objCount = args.maxOpacity;
    
    addObjects();
}

// randSign: return a random numerical sign.
function randSign() {
    return Math.random() >= 0.5? 1: -1;
}

function addObject(name, mesh) {
//    let geometry = new THREE.BoxGeometry(1, 1, 1);
//    let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
//    let fallingObj = new THREE.Mesh(geometry, material);
    
    let fallingObj = mesh.clone();
    fallingObj.material = new THREE.MeshStandardMaterial().copy(fallingObj.material);
    
    let baseScale = sceneArgs.baseScale? sceneArgs.baseScale : 0.12;
    let randScale = (baseScale / 4) * Math.random();
    fallingObj.scale.set(baseScale - randScale, baseScale - randScale, baseScale - randScale);
    
    fallingObj.name = name;
    scene.add(fallingObj);

    // random x position constrained within window.
    let sign  = randSign();
    let sign2 = randSign();
    let sign3 = randSign();
    
    // start at a random x, y, z position within the box.
    fallingObj.position.x = sign * Math.random() * boxSize; //window.innerWidth / 2;
    fallingObj.position.z = sign2 * Math.random() * boxSize; //window.innerWidth / 2;
    //fallingObj.position.y = 10 + 10 * Math.random();
    fallingObj.position.y = sign3 * boxSize * Math.random();

    fallingObj.userData.startY = fallingObj.position.y;
    fallingObj.userData.startX = fallingObj.position.x;
    fallingObj.userData.startZ = fallingObj.position.z;

    // hard to say if randomizing the sign of each rotational velocity element looks better or not.
    fallingObj.userData.rotation = [Math.random() * 0.01, Math.random() * 0.01, Math.random() * 0.01];

    fallingObj.userData.fadingIn = true;
    fallingObj.userData.fadingOut = false;
        
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
        // also, fade out at the bottom, and fade in at the top.
        //if (obj.position.y < -window.innerHeight / 2) obj.position.y = - window.innerHeight / 2;
        //if (obj.position.y < -10) obj.position.y = obj.userData.startY;
        if (obj.position.y < -boxSize) {
            //obj.position.y = boxSize;
            //obj.material.opacity = 0;
            //obj.userData.fadingIn = true;
            obj.material.opacity -= 0.01;
            
            if (obj.material.opacity <= 0) {
                obj.material.opacity = 0;
                obj.position.y = boxSize;
                obj.userData.fadingIn = true;
            }
        }
        
        if (obj.userData.fadingIn == true) {
            obj.material.opacity += 0.01;
            if (obj.material.opacity >= maxOpacity) {
                obj.material.opacity = maxOpacity;
                obj.userData.fadingIn = false;
            }
        }
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
        },
        {
            name: 'Snowflake3',
            mesh: '../resources/models/snowflake3.obj',
            map: '../resources/images/snowflake4.jpg',
            normalMap: '../resources/images/snowflake4-normal.jpg'
        },
        {
            name: 'Snowflake4',
            mesh: '../resources/models/snowflake4.obj',
            map: '../resources/images/snowflake3.jpg',
            normalMap: '../resources/images/snowflake3-normal.jpg'
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
                    normalMap: obj.normalMap,
                    envMap: hdrCubeRenderTarget.texture,
                    metalness: 0.5,
                    roughness: 0.5,
                    transparent: true, // important for fading in / out
                    opacity: 0 //0.9 // start out invisible, then fade in.
                });       
// This doesn't work for some reason.                
//                material = new THREE.MeshPhongMaterial({
//                    color: 0xffffff,
//                    envMap: hdrCubeRenderTarget.texture,
//                    refractionRatio: 0.98,
//                    reflectivity: 0.8
//                });
            }
            objMesh.material = material;
            objMesh.material.needsUpdate = true;
            
            objPrototypes.push(objMesh);
        });
        
        for (let x = 0; x < objCount; x++) {
            let objSample = objPrototypes[Math.floor(Math.random() * objPrototypes.length)]
            //console.log(Math.round(Math.random() * objPrototypes.length));
            addObject('obj'+x, objSample);
        }
        
        console.log('scene', scene)
    });
}