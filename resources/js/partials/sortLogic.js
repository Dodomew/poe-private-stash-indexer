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
    let isOrderedLowToHigh;

    if(typeToSort === 'name') {
        button = document.getElementById('js-sort-by-name-btn');
    }
    else {
        button = document.getElementById('js-sort-by-value-btn');
    }

    //if is-active, then array is sorted from low to high
    isOrderedLowToHigh = !button.classList.contains('is-active');

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
    // if(categoriesArray[categoryIndex] !== null) {
    //     listArray.reverse();
    // }
    // else {
    //     sortByType(listArray, typeToSort, isOrderedLowToHigh);
    //     categoriesArray[categoryIndex] = true;
    // }

    sortByType(listArray, typeToSort, isOrderedLowToHigh);

    if(typeToSort === 'name') {
        button.innerText = reverseString(button.innerText);
    }

    button.classList.toggle('is-active');

    //fill the cloned list node
    for (let i = 0; i < listArray.length; i++) {
        clonedList.appendChild(listArray[i]);
    }

    //replace old list node with cloned list node
    currentList.parentNode.replaceChild(clonedList, currentList);
}

function sortByType(array, type, order) {
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

        if(order) {
            if(firstElem < secondElem) {
                return -1;
            }

            if(firstElem > secondElem) {
                return 1;
            }
        }
        else {
            if(firstElem < secondElem) {
                return 1;
            }

            if(firstElem > secondElem) {
                return -1;
            }
        }

        return 0;
    });
}

function reverseString(str) {
    return str.split("").reverse().join("");
}
