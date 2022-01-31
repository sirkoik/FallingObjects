import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TextureLoader } from 'three';
import { setProgress } from './domElements.js';

/* promise obj/map loaders */

// loadObj2: Load an object with OBJLoader2.
const loadObj2 = (path) => {
  return new Promise(resolve => {
      const objLoader = new OBJLoader();
      objLoader.load(path, (root) => {
          // TODO do something with the object.
          resolve(root);
      });
  });
}

// loadMap2: Load a texture map.
const loadMap2 = (path) => {
  return new Promise(resolve => {
      new TextureLoader().load(path, resolve);
  });
}

// loadObjs2: Load objects asynchronously with promises, and then 
// resolve when all promises have fulfilled.
export const loadObjs2 = (objInfo, progAmount) => {
  return new Promise((resolve, reject) => {
      const promisesSuper = [];
      const promisesFlat = [];
      const objects = [];

      // iterate over objInfo
      objInfo.map((currentValue, index, arr) => {
          const mapPromise = loadMap2(currentValue.map).then(map => {
              objInfo[index].map = map;
              setProgress(progAmount);
          });
          const normalMapPromise = loadMap2(currentValue.normalMap).then(normalMap => {
              objInfo[index].normalMap = normalMap;
              setProgress(progAmount);
          });
          const meshPromise = loadObj2(currentValue.mesh).then(mesh => {
              objInfo[index].mesh = mesh;
              setProgress(progAmount);
          });

          // push all promises for this object into a sub-array of the promisesSuper array.
          promisesSuper.push([currentValue.name, meshPromise, mapPromise, normalMapPromise]);
          promisesFlat.push(currentValue.name, meshPromise, mapPromise, normalMapPromise);
      });

      // this promise resolves each time an object is loaded.
      promisesSuper.map((currentValue, index, arr) => {
          Promise.all(currentValue).then(output => {
              // TODO add object.

              // resolve(output);
          });
      });

      // this promise resolves when all objects are loaded.
      Promise.all(promisesFlat)
          .then(output => {
              // TODO continue script when object has loaded.
              resolve(promisesFlat);
          })
          .catch(error => {
              alert('Error');
          });
  });
}