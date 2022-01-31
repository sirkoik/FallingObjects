import { camera, composer, renderer } from "./threeHandler";

let prog = 0;
const totalProg = 200;

// setProgress: set the progress in the progress bar to an adjusted amount based on totalProg
export const setProgress = (amount) => {
    prog += amount;
    
    const total = Math.round(100 * prog / totalProg);
    document.querySelector('.load-progress').style.width = `${total}%`;
    
    if (total >= 100) {
        document.querySelector('.loading-overlay-container').style.display = 'none';
    }
}

// update renderer size and camera projection matrix when the window is resized to keep everything proportionate
// courtesy https://stackoverflow.com/a/20434960/5511776
const onWindowResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
    composer.setSize(w, h);
}

// attachDomFunctions: attach all the necessary DOM functions
export const attachDomFunctions = () => {
    const menu = document.querySelector('.menu-items');
    
    document.querySelector('.burger').addEventListener('click', () => {    
        menu.style.display = menu.style.display == 'block'? 'none' : 'block';
    });
    
    document.querySelector('.menu-items-about').addEventListener('click', (event) => {
        event.preventDefault();

        document.querySelector('.overlay-container').style.display = 'flex';
        menu.style.display = 'none';
    });
    
    document.querySelector('.overlay-container').addEventListener('click', function() {
        this.style.display = 'none';
    });
    
    document.querySelector('a').addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // append the renderer to the DOM
    document.body.appendChild(renderer.domElement);

    // adjust the renderer size and aspect ratio when the window is resized
    window.addEventListener('resize', onWindowResize, false);
}

export const hideOverlay = () => {
    document.querySelector('.loading-overlay-container').style.display = 'none';
}