window.addEventListener("load", function () {
    document.getElementById('collapse-menu').addEventListener("click", collapseMenu);
    document.getElementById('right-circle').children[0].addEventListener("click", openMenu);
})

function collapseMenu() {
    document.getElementById('side-menu').style.width = "0%";
    document.getElementById('fullpage').style.transform = "translateX(0%)";
    document.getElementById('side-menu').style.overflow = "hidden";
    document.getElementById('circle').style.left = "-50px";
    var links = document.getElementsByClassName('sublink');
    if (links[0].style.left == "10px") {
        // Sposta i link a SX
        for (var i = 0; i < links.length; i++) {
            links[i].style.position = "absolute";
            links[i].style.left = "-10%";
        }
    }
}

function openMenu() {
    document.getElementById('side-menu').style.width = "12%";
    document.getElementById('circle').style.left = "-100px";
    document.getElementById('fullpage').style.transform = "translateX(12%)";
    var lis = document.getElementById('sub-menulist').children;
    if (lis[0].style.height != "0px") {
        var links = document.getElementsByClassName('sublink');
        // Rimetti i link a posto
        for (var i = 0; i < links.length; i++) {
            links[i].style.position = "absolute";
            links[i].style.left = "10px";
        }
    }
    setTimeout(function(){document.getElementById('side-menu').style.overflow = "visible";}, 500);
}
