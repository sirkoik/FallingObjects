import * as THREE from '../resources/three.js-r112/build/three.module.js';
import {OrbitControls} from '../resources/three.js-r112/examples/jsm/controls/OrbitControls.js';
import {OBJLoader2} from '../resources/three.js-r112/examples/jsm/loaders/OBJLoader2.js';

export {THREE};
export {load, scene, animFunctions};
export {loadObjs2};

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
let controls = new OrbitControls(camera, renderer.domElement);

let animFunctions = [];

let debug = false;
let enableAnimation = true;

function load(args) {
    if (args && args.enableAnimation !== undefined) enableAnimation = args.enableAnimation;
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //camera.position.z = 5;
    camera.position.x = 10;
    camera.position.y = 7;
    camera.position.z = 10;

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    if (args.helpers && args.enableHelpers) args.helpers();
    if (args.debug) debug = args.debug;

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // run each custom animation function.
    if (enableAnimation) {for (var x = 0; x < animFunctions.length; x++) {
        animFunctions[x]();
    }}

    renderer.render(scene, camera);
}

// update renderer size and camera projection matrix when the window is resized to keep everything proportionate
window.onresize = () => {
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// load an object using three.js OBJLoader2
/*function loadObj(path, args, callback) {    
    const objLoader = new OBJLoader2();
    objLoader.load(path, (root) => {
        if (args && args.obj) {
            callback(root);
        } else {
            scene.add(root);
        }
        
        if (debug) console.log(root);
        if (debug) console.log(scene);
    });
}*/

/*
function loadTexture(path) {
    return new Promise(resolve => {new THREE.TextureLoader().load(path, resolve);});
}

function loadObjPromise(paths) {
    //const promises = [];
    
    const promises = paths.map(key => {
        return loadTexture(key.obj).then(texture => {
            alert('texture loaded');
            //alert(texture);
            // needs some kind of action here. It's not executing.
        }).catch(fail => {
            alert('Something went wrong');
        });
    });
    
    setTimeout(() => console.log(paths), 5000);
    
//    for (let x = 0; x < paths.length; x++) {
//        let thisPromise = () => {
//            return loadObj(paths[x].obj, {obj: true}, resolve).then((root) => {
//                alert(root);
//            });
//        }
//        
//        promises.push(thisPromise);
//    }
        
    return Promise.all(promises).then(result => {
        alert('all loaded');
    });
}*/


/* promise obj/map loaders */

function loadObj2(path) {
    return new Promise(resolve => {
        const objLoader = new OBJLoader2();
        objLoader.load(path, (root) => {
            // TODO do something with the object.

            if (debug) console.log(root);
            if (debug) console.log(scene);
            
            if (debug) alert(path + ' loaded.');
            resolve(root);
        });
    });
//	return new Promise(resolve => {
//		setTimeout(() => {
//			console.log(path + ' loaded.');
//			resolve();	
//		}, Math.random() * 2000);
//	});
}

function loadMap2(path) {
    return new Promise(resolve => {
        new THREE.TextureLoader().load(path, resolve);
    });
//	return new Promise(resolve => {
//		console.log(path + ' loaded.');
//		resolve();
//	});
}

// loadObjs2: Load objects asynchronously with promises, and then 
// resolve when all promises have fulfilled.
function loadObjs2(objInfo) {
	return new Promise((resolve, reject) => {
		let promisesSuper = [];
        let objects = [];
		
		// iterate over objInfo
		objInfo.map((currentValue, index, arr) => {
			let mapPromise = loadMap2(currentValue.map);
			let normalMapPromise = loadMap2(currentValue.normalMap);
			let meshPromise = loadObj2(currentValue.mesh);
			
            // push all promises for this object into a sub-array of the promisesSuper array.
			promisesSuper.push([currentValue.name, meshPromise, mapPromise, normalMapPromise]);
		});
        
        // this promise resolves each time an object is loaded.
        promisesSuper.map((currentValue, index, arr) => {
            Promise.all(currentValue).then(output => {
                // TODO add object.
                //alert('Object fully loaded.');
                //console.log(output);
                
                //resolve(output);
            });
        });
        
		// this promise resolves when all objects are loaded.
		Promise.all(promisesSuper)
		.then(output => {
            // TODO continue script when object has loaded.
			//alert('all promises in promise array resolved.');
			resolve(promisesSuper);
		})
		.catch(error => {
			alert('Error');
		});
	});
}