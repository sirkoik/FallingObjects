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
}