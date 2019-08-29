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
    let categoryArray = [];

    // for each category we keep a bool for sorting
    for (let i = 0; i < allCategories.length; i++) {
        categoryArray.push(null);
    }

    document.addEventListener('click', function (event) {
        if (event.target.matches('#js-sort-by-name-btn')) {
            sortByName(categoryArray);
        }

        if (event.target.matches('#js-sort-by-value-btn')) {
            sortByValue();
        }
    }, false);
}

function sortByName(categoryArray) {
    let lists = document.getElementsByClassName('js-list');
    let currentList;
    let categoryIndex;

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

    //if categoryArray is null, that means we have not sorted the array yet
    //otherwise we will reverse the array
    if(categoryArray[categoryIndex] !== null) {
        listArray.reverse();
    }
    else {
        listArray.sort(function(a, b) {
            let firstElemName = a.dataset.name;
            let secondElemName = b.dataset.name;

            if(firstElemName < secondElemName) {
                return -1;
            }

            if(firstElemName > secondElemName) {
                return 1;
            }

            return 0;
        });
        categoryArray[categoryIndex] = true;
    }

    //fill the cloned list node
    for (let i = 0; i < listArray.length; i++) {
        clonedList.appendChild(listArray[i]);
    }

    //replace old list node with cloned list node
    currentList.parentNode.replaceChild(clonedList, currentList);
}

function sortByValue() {
    console.log('bur');
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

(function () {
    initTabLogic();
    initButtonLogic();
    initSortLogic();
}());
