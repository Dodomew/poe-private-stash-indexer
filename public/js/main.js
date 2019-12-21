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

function initSortLogic() {
    //get array of all categories for sorting
    let allCategories = document.getElementsByClassName('js-content');
    let categoriesSortedByNameArray = [];
    let categoriesSortedByValueArray = [];

    // for each category we keep a bool for sorting
    for (let i = 0; i < allCategories.length; i++) {
        categoriesSortedByNameArray.push(null);
        categoriesSortedByValueArray.push(null);
    }

    document.addEventListener('click', function (event) {
        if (event.target.matches('#js-sort-by-name-btn')) {
            sortList(categoriesSortedByNameArray, 'name');
        }

        if (event.target.matches('#js-sort-by-value-btn')) {
            sortList(categoriesSortedByValueArray, 'value');
        }
    }, false);
}

function sortList(categoriesArray, typeToSort) {
    let lists = document.getElementsByClassName('js-list');
    let currentList;
    let categoryIndex;
    let button;

    if(typeToSort === 'name') {
        button = document.getElementById('js-sort-by-name-btn');
    }
    else {
        button = document.getElementById('js-sort-by-value-btn');
    }

    //find the active list
    for (let i = 0; i < lists.length; i++) {
        let parent = lists[i].parentNode;
        if (parent.className.indexOf('is-active') >= 0) {
            currentList = lists[i];
            categoryIndex = i;
            break;
        }
    }

    //clone of the DOM list without children
    let clonedList = currentList.cloneNode(false);

    let listChildren = currentList.childNodes;
    let listArray = [];

    for (let i = 0; i < listChildren.length; i++) {
        if(listChildren[i].tagName === 'LI') {
            listArray.push(listChildren[i]);
        }
    }

    //if categoriesSortedByNameArray/valueArray is null, that means we have not sorted the array yet
    //otherwise we will reverse the array
    if(categoriesArray[categoryIndex] !== null) {
        listArray.reverse();
    }
    else {
        sortByType(listArray, typeToSort);
        categoriesArray[categoryIndex] = true;
    }

    if(typeToSort === 'name') {
        button.innerText = reverseString(button.innerText);
    }
    else {
        button.classList.toggle('is-active');
    }

    //fill the cloned list node
    for (let i = 0; i < listArray.length; i++) {
        clonedList.appendChild(listArray[i]);
    }

    //replace old list node with cloned list node
    currentList.parentNode.replaceChild(clonedList, currentList);
}

function sortByType(array, type) {
    array.sort(function(a, b) {
        let firstElem;
        let secondElem;

        if(type === 'name') {
            firstElem = a.dataset.name;
            secondElem = b.dataset.name;
        }
        else {
            firstElem = parseFloat(a.dataset.value);
            secondElem = parseFloat(b.dataset.value);
        }

        if(firstElem < secondElem) {
            return -1;
        }

        if(firstElem > secondElem) {
            return 1;
        }

        return 0;
    });
}

function reverseString(str) {
    return str.split("").reverse().join("");
}

function initSwitchCategoryLogic() {
    let content = document.getElementsByClassName('js-content');
    let selectCategory = document.getElementById('js-select-category');
    let currentCategory = selectCategory[selectCategory.selectedIndex].value;

    toggleContent(currentCategory, content);

    selectCategory.addEventListener('change', (e) => {
        let selectedCategory = selectCategory[selectCategory.selectedIndex].value;
        toggleContent(selectedCategory, content);
    });
}

function toggleContent(selectedCategory, content) {
    for (let j = 0; j < content.length; j++) {
        if(content[j].dataset.category === selectedCategory) {
            content[j].classList.add('is-active');

            if(!content[j].classList.contains('accordion-is-init')) {
                initAccordion(content[j]);
                content[j].classList.add('accordion-is-init');
            }
        }
        else {
            content[j].classList.remove('is-active');
        }
    }
}

document.addEventListener("DOMContentLoaded",function(){
    initSwitchCategoryLogic();
    initButtonLogic();
    initSortLogic();
});
