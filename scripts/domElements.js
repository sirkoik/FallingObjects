export {setProgress, attachDomFunctions};

let prog = 0;
let totalProg = 200;

// setProgress: set the progress in the progress bar to an adjusted amount based on totalProg
function setProgress(amount) {
    prog += amount;
    
    let total = Math.round(100 * prog / totalProg);
    document.querySelector('.load-progress').style.width = total + '%';
    
    if (total >= 100) document.querySelector('.loading-overlay-container').style.display = 'none';
}

// attachDomFunctions: attach all the necessary DOM functions
function attachDomFunctions() {
    // HTML elements
    let menu = document.querySelector('.menu-items');
    
    document.querySelector('.burger').addEventListener('click', () => {    
        menu.style.display = menu.style.display == 'block'? 'none' : 'block';
    });
    
    document.querySelector('.menu-items-about').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.overlay-container').style.display = 'flex';
        menu.style.display = 'none';
    });
    
    document.querySelector('.overlay-container').addEventListener('click', function() {
        this.style.display = 'none';
    });
    
    document.querySelector('a').addEventListener('click', function(e) {
        e.stopPropagation();
    });    
}