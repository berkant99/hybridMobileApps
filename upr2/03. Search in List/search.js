function search() {
    let srchVal = document.querySelector('#searchText').value;
    let list = document.querySelectorAll('li');
    list.forEach(item => {
        let txt = item.textContent || item.innerText;
        if (txt.indexOf(srchVal) >= 0) {
            item.style.fontWeight = "bold"
        } else {
            item.style.fontWeight = "normal"
        }
    })
}