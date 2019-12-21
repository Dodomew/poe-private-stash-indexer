function getParent(element, selector) {
    // Get the next parent element
    let parent = element.parentElement;

    // If the sibling matches our selector, use it
    // If not, jump to the next sibling and continue the loop
    while (parent) {
        if (parent.matches(selector)) {
            return parent;
        }
        parent = parent.parentElement
    }
}

function initAccordion(htmlWrapper) {
    let allAccordions = htmlWrapper.getElementsByClassName('js-accordion');
    let allAccordionToggles = htmlWrapper.getElementsByClassName('js-accordion-toggle');

    for (let i = 0; i < allAccordions.length; i++) {
        let heightOfElement = allAccordions[i].offsetHeight;
        allAccordions[i].style.height = heightOfElement + "px";
        allAccordions[i].style.maxHeight = heightOfElement + "px";
        allAccordions[i].classList.add('is-closed');
        let parent = getParent(allAccordions[i], '.js-list-item');
        parent.classList.add('is-closed');

        allAccordionToggles[i].removeEventListener('click', toggleAccordion, false);
        allAccordionToggles[i].addEventListener('click', toggleAccordion, false);
    }
}

function toggleAccordion(e) {
    let parentOfClickedButton = getParent(e.target, '.js-list-item');

    if(parentOfClickedButton.classList.contains('is-closed')) {
        parentOfClickedButton.classList.remove('is-closed');
        parentOfClickedButton.classList.add('is-expanded');
    }
    else {
        parentOfClickedButton.classList.remove('is-expanded');
        parentOfClickedButton.classList.add('is-closed');
    }
}
