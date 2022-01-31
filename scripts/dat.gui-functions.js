import { bloomParams } from "./threeHandler";
// TODO this won't work; add dat.gui once its security vulnerability is fixed
import { GUI } from '../resources/three.js-r112/examples/jsm/libs/dat.gui.module.js';

// DAT.gui for bloomParams
// courtesy https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html
export const loadDAT = () => {
    let gui = new GUI();

    gui.add(bloomParams, 'exposure', 0.1, 2).onChange(function (value) {
        console.log(Math.pow(value, 4.0));
        renderer.toneMappingExposure = Math.pow(value, 4.0);
    });

    gui.add(bloomParams, 'bloomThreshold', 0.0, 1.0).onChange(function (value) {
        bloomPass.threshold = Number(value);
    });

    gui.add(bloomParams, 'bloomStrength', 0.0, 3.0).onChange(function (value) {
        bloomPass.strength = Number(value);
    });

    gui.add(bloomParams, 'bloomRadius', 0.0, 1.0).step(0.01).onChange(function (value) {
        bloomPass.radius = Number(value);
    });
}