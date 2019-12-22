function initGetJewels() {
    let xmlhttp = new XMLHttpRequest();
    let string;

    xmlhttp.open("GET","http://localhost:3001/get-jewel", true);
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200){
            string = xmlhttp.responseText;
        }
    };
    xmlhttp.send();
}
