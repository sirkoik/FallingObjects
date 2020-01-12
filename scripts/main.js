import {load as threeLoad} from './threeHandler.js';
import {loadObjects, addLights} from './FallingThings.js';
import {setupScene} from './SceneSetup.js';
import {addHelpers, addDebugSphere} from './Helpers.js';

window.onload = () => {
    threeLoad({
        camera: {
            x: 1, y: 0, z: 1
        },
        
        helpers: addHelpers,
        enableHelpers: false,
        debug: false,
        enableAnimation: true,
        
        autoRotate: true,
        autoRotateSpeed: 0.2,
        
        baseScale: 0.15,
        
        objsReceiveShadow: true,
        
        debugArgs: {
            basicMaterial: false,
            enableDAT: false,
            debugSphere: true
        }
    });
    
    setupScene(() => {
        loadObjects({
            objCount: 500
        });
    });
    
    
    
    addLights();
    
    //addDebugSphere();
};