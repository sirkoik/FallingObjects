import {load as threeLoad} from './threeHandler.js';
import {addObjects, addLights} from './FallingThings.js';
import {setupScene} from './SceneSetup.js';
import {addHelpers} from './Helpers.js';

window.onload = () => {
    threeLoad({
        helpers: addHelpers,
        enableHelpers: true,
        debug: true,
        enableAnimation: true
    });
    
    setupScene();
    
    addObjects({
        objCount: 200
    });
    
    addLights();
}

