function initButtonLogic() {
    let scrollButton = document.getElementsByClassName('js-btn-scrolltop');
    scrollButton[0].addEventListener('click', scrollToTop, false);
}

function scrollToTop(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
