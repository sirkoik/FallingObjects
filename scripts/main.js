import {load as threeLoad} from './threeHandler.js';
import {loadObjects, addLights} from './FallingThings.js';
import {setupScene} from './SceneSetup.js';
import {addHelpers} from './Helpers.js';

window.onload = () => {
    threeLoad({
        helpers: addHelpers,
        enableHelpers: false,
        debug: true,
        enableAnimation: true,
        debugArgs: {
            basicMaterial: true
        }
    });
    
    setupScene();
    
    loadObjects();
    
    addLights();
}