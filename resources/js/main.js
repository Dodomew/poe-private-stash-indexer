console.log('load in main');

document.addEventListener("DOMContentLoaded",function(){
    console.log('dom loaded')
    document.body.style.opacity = 1;

    initTabLogic();
    initButtonLogic();
    initSortLogic();
});
