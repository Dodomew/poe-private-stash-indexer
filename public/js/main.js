// function initAccordion() {
//     if(!$('.js-accordion-item').length || !$('.js-accordion').length) {
//         return;
//     }
//
//     // Accordion expand / close toggle
//     $('.js-accordion-item').each(function () {
//         var $this = $(this),
//             $panel = $this.find('.js-accordion-panel'),
//             $height = $panel.height() + 1000;
//
//         $panel.css('max-height', $height);
//
//         if ($panel.hasClass('is-hidden')) {
//             $panel.removeClass('is-hidden').addClass('is-closed');
//         }
//
//         $this.find('a').attr("tabindex", "-1");
//     });
//
//     $('.js-accordion').on('click', '.js-accordion-toggle', function (e) {
//         e.preventDefault();
//         var $parent = $(this).closest('.js-accordion-item'),
//             $panel = $parent.find('.js-accordion-panel'),
//             $state = $parent.find('.js-accordion-state');
//         $panel.toggleClass('is-closed is-expanded');
//         $parent.toggleClass('is-active');
//
//         // Set current state label
//         var stateLabel = $parent.hasClass('is-active') ? 'open' : 'closed';
//
//         // Toggle Aria attributes
//         $panel.attr('aria-hidden', (stateLabel === 'closed' ? 'true' : 'false'));
//         $state.attr('aria-expanded', (stateLabel === 'closed' ? 'false' : 'true'));
//
//         $state.find('.js-accordion-toggle-screenreader').text($state.data('state-' + stateLabel));
//         $('.js-accordion-screenreader').text($('.js-accordion-screenreader').data('accordion-item-' + stateLabel));
//
//         // make links inside accordion only tab-able when accordion item is active
//         $parent.find('a').attr("tabindex", $parent.hasClass('is-active') - 1);
//
//         trackEvent('Component: Accordion', stateLabel === 'open' ? 'Open' : 'Close', $parent.attr('data-track-label'));
//     });
// }

function initAccordion(htmlWrapper) {
    let allAccordions = htmlWrapper.getElementsByClassName('js-accordion');

    for (let i = 0; i < allAccordions.length; i++) {
        let heightOfElement = allAccordions[i].offsetHeight;
        allAccordions[i].style.height = heightOfElement + "px";
        allAccordions[i].style.maxHeight = heightOfElement + "px";
        allAccordions[i].classList.add('is-closed');
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

function initTabLogic() {
    let tabs = document.getElementsByClassName('js-tab-input');
    let content = document.getElementsByClassName('js-content');

    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('change', () => {
            toggleContent(tabs, content);
        }, false);
    }
}

function toggleContent(tabs, content) {
    for (let i = 0, length = tabs.length; i < length; i++)
    {
        if (tabs[i].checked)
        {
            let contentToSetActive = content[i];

            for (let j = 0; j < content.length; j++) {
                if(content[j] === contentToSetActive) {
                    contentToSetActive.classList.add('is-active');
                    initAccordion(contentToSetActive);
                }
                else {
                    content[j].classList.remove('is-active');
                }
            }

            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
}

console.log('load in main');

document.addEventListener("DOMContentLoaded",function(){
    console.log('dom loaded')
    document.body.style.opacity = 1;

    initTabLogic();
    initButtonLogic();
    initSortLogic();
});
