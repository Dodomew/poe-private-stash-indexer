var tabs = document.getElementsByClassName('js-tab-input');
var content = document.getElementsByClassName('js-content');

function addListenersToInput() {
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('change', toggleContent, false);
    }
}

function toggleContent() {
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

addListenersToInput();
