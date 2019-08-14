function tabLogic() {
    let tabs = document.getElementsByName('tab');
    let content = document.getElementsByClassName('js-content');
    console.log(content)

    for (let i = 0, length = tabs.length; i < length; i++)
    {
        if (tabs[i].checked)
        {
            let checkedTab = tabs[i];

            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
}

tabLogic();
