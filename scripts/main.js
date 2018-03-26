/*
    Gestione del sidemenu
*/

window.addEventListener("load", function () {
    /* Aggiungi gli eventi agli elementi-pulsanti */
    document.getElementById('collapse-menu').addEventListener("click", collapseMenu);
    document.getElementById('right-circle').children[0].addEventListener("click", openMenu);
})

/* Chiudi il sidemenu */
function collapseMenu() {
    document.getElementById('side-menu').style.width = "0%"; // Nascondi il sidemenu
    document.getElementById('circle').style.left = "-50px"; // Mostra il cerchio
    document.getElementById('fullpage').style.transform = "translateX(0%)"; // Sposta la pagina a SX
}

/* Apri il sidemenu */
function openMenu() {
    document.getElementById('side-menu').style.width = "12%"; // Mostra il sidemenu
    document.getElementById('circle').style.left = "-100px"; // Nascondi il cerchio
    document.getElementById('fullpage').style.transform = "translateX(12%)"; // Sposta la pagina a DX
}
