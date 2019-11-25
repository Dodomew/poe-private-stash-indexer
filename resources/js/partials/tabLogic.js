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
