import {load as threeLoad} from './threeHandler.js';
import {loadObjects, addLights} from './FallingThings.js';
import {setupScene, } from './SceneSetup.js';
import {addHelpers} from './Helpers.js';

window.onload = () => {
    threeLoad({
        helpers: addHelpers,
        enableHelpers: false,
        debug: false,
        enableAnimation: true,
        
        autoRotate: true,
        autoRotateSpeed: 0.2,
        
        baseScale: 0.15,
        
        debugArgs: {
            basicMaterial: false
        }
    });
    
    setupScene(() => {
        loadObjects();
    });
    
    
    
    addLights();
}