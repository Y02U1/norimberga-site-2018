window.addEventListener("load", function () {
    var modal = document.getElementById('galleryModal'); // Prendi il modale
    var modalImg = document.getElementById("modal-img"); // Prendi l'immagine
    var captionText = document.getElementById("caption"); // Prendi la didascalia
    imgs = document.getElementsByClassName("hover-shadow"); // Prendi le immagini della galleria

    // Per ogni immagine...
    for (var i = 0; i < imgs.length; i++) {
        // ...Crea la funzione...
        imgs[i].onclick = function(){
            // ...Che apre il modale con i parametri dell'immagine
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
        }
    }

    // Prendi lo <span> (chiusura)
    var span = document.getElementsByClassName("close")[0];

    // Quando si clicca sullo <span> chiudi il modale
    span.onclick = function() {
        modal.style.display = "none";
    }
})
