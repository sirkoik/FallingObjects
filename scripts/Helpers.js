import {
    AxesHelper,
    LineSegments,
    BoxGeometry,
    WireframeGeometry,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh
} from 'three';
import { scene } from './threeHandler.js';

const addAxisHelper = () => {
    const axesHelper = new AxesHelper(50);
    scene.add(axesHelper);
    
    const axesHelper2 = new AxesHelper(10);
    axesHelper2.position.set(10, 5, 10);
    scene.add(axesHelper2);    
}

const addBoxHelper = () => {
    const size = 20;
    const geometry = new BoxGeometry(size, size, size);
    const wireframe = new WireframeGeometry(geometry);
    
    const line = new LineSegments(wireframe);
    line.material.depthTest = false;
    line.material.opacity = 0.25;
    line.material.transparent = true;
    
    scene.add(line);
}

export const addHelpers = () => {
    addAxisHelper();
    addBoxHelper();
}

export const addDebugSphere = () => {
    const size = 20;
    const geometry = new SphereGeometry(size, size, size);
    const material = new MeshBasicMaterial({color: 0xffffff});
    
//    let material = new THREE.MeshStandardMaterial({
//        envMap: hdrCubeRenderTarget.texture,
//        metalness: 0.5,
//        roughness: 0.5,
//        transparent: true, // important for fading in / out
//        opacity: 1 // start out invisible, then fade in.
//    });
    
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);
}