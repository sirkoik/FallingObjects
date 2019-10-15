import {load as threeLoad} from './threeHandler.js';
import {addObjects, addLights} from './FallingThings.js';

window.onload = () => {
    threeLoad();
    //addObject('cube1');
    addObjects();
    addLights();
}

