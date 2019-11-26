function initSwitchCategoryLogic() {
    console.log('tablogic');

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
            initAccordion(content[j]);
        }
        else {
            content[j].classList.remove('is-active');
        }
    }
}
