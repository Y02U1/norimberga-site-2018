var imgs = document.getElementsByClassName('img'); // Array delle immagini
var imgcurrent = 0; // Indice dell'immagine corrente
var previous = window.scrollY; // Precedente scroll position

window.addEventListener("load", function () {
    window.addEventListener("scroll", debouncedSlide); /* Sullo scroll attiva il codice */
})

var debouncedSlide = debounce(function() {
    var scrlTime = 500;
    if (window.scrollY > previous) {
        /*
            DOWN
                De-opacizza
                Rimuovi scrolling e Scrolla
                (Altro)
                Opacizza
                Ammetti scrolling
        */
        var pos = determineScrollPos(false); // Determina pos
        if (pos) {
            // De-opacizza
            setOpacity(0);
            // Rimuovi il listener
            window.removeEventListener("scroll", debouncedSlide); // Remove listener
            // Scrolla
            scrollIt(pos, scrlTime);
            // (altro) & opacizza
            if (imgcurrent == imgs.length-1) {
                setTimeout(function() {
                    imgs[imgs.length-1].children[0].style.transitionDuration = "2s";
                    imgs[imgs.length-1].children[0].style.width = "90%";
                    setTimeout(function () { setOpacity(1); }, 2000);
                }, scrlTime+100);
                // opacizza SOLO
            } else {
                // Opacizza
                setTimeout(function () { setOpacity(1); }, scrlTime+400);
            }
            // Ammetti scrolling
            setTimeout(function() {
                window.addEventListener("scroll", debouncedSlide); // Add listener
            }, scrlTime+600); // Dopo lo scroll, aggiungi il listener (ammettilo)

            previous = getCoords(imgs[imgcurrent]).top;
        }
    } else {
        /*
            UP
                De-opacizza
                (Altro)
                Rimuovi scrolling e Scrolla
                Opacizza
                Ammetti scrolling
        */
        var pos = determineScrollPos(true); // Determina pos
        if (pos || pos == 0) {
            // De-opacizza
            setOpacity(0);
            // Rimuovi il listener
            window.removeEventListener("scroll", debouncedSlide); // Remove listener
            // (altro) & rimuovi scrolling & scrolla
            if (imgcurrent == imgs.length-2) {
                imgs[imgs.length-1].children[0].style.transitionDuration = "0.2s";
                imgs[imgs.length-1].children[0].style.width = "40%";
                setTimeout(function() { scrollIt(pos, scrlTime); }, 200); // Scrolla
                // rimuovi scrolling e scrolla SOLO
            } else {
                scrollIt(pos, scrlTime); // Scrolla
            }
            // Opacizza
            setTimeout(function () { setOpacity(1); }, scrlTime+100);
            // Ammetti scrolling
            setTimeout(function() {
                window.addEventListener("scroll", debouncedSlide); // Add listener
            }, scrlTime+400); // Dopo l'opacizzazione, aggiungi il listener

            previous = getCoords(imgs[imgcurrent]).top;
        }
    }
}, 200, true);

/*
    Imposta l'opacità del contenuto delle immagini
        opacityValue = valore dell'opacità (0-1)
*/
function setOpacity(opacityValue) {
    // Itera tra le immagini...
    for (var i = 0; i < imgs.length; i++) {
        // ...Itera tra i figli (*) del figlio (<div>) dell'immagine...
        for (child of imgs[i].children[0].children) {
            // ...A seconda dell'opacità attiva/disattiva la transizione
            if (opacityValue) {
                child.style.transitionDuration = "1s";
            } else {
                child.style.transitionDuration = "0s";
            }
            // ...E imposta l'opacità sulla base dell'argomento
            child.style.opacity = opacityValue;
        }
    }
}

/*
    Determina dove effettuare lo scrolling, aggiornando l'imgcurrent
        isUpward:
            true = direzione UP
            false = direzione DOWN
*/
function determineScrollPos(isUpward) {
    if (isUpward) {
        // Direzione UP
        if (imgcurrent == 0) {
            return false;
        } else {
            // Sposta in alto E aggiorna 'imgcurrent'
            return getCoords(imgs[--imgcurrent]).top;
        }
    } else {
        // Direzione DOWN
        if (imgcurrent == imgs.length-1) {
            return false;
        } else {
            // Sposta in basso E aggiorna 'imgcurrent'
            return getCoords(imgs[++imgcurrent]).top;
        }
    }
}

/*
    Ottieni le coordinate di un oggetto passato come parametro

    Ritorna:
        le coordinate top e left dell'oggetto
*/
function getCoords(elem) {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}

/*
    Ritorna una funzione, che, fintanto che continua ad essere invocata, non sarà
    attivata. La funzione sarà richiamata una seconda volta solo dopo N millisecondi.
    Se `immediate` viene passato, verrà attivata la funzione all'inizio della scarica
    di eventi, invece che alla fine (comportamento di default).
*/
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

/* Funzione per uno scrolling programmatico con transizione */
function scrollIt(destination, duration = 200, easing = 'linear', callback) {
    // Costanti matematiche
    const easings = {
        linear(t) {
          return t;
        }
    };
    const start = window.pageYOffset; // Inizio dello scrolling
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime(); // Orario di inizio dello scrolling
    // Altezza del documento (pagina web completa), ottenuta rispetto a vari controlli per trovare la maggiore
    const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    // Altezza della finestra
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    // Sulla base della destinazione, calcolare l'offset
    const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
    // Sulla base dell'offset di destinazione, calcolare approssimatamente l'offset vero e proprio
    const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

    if ('requestAnimationFrame' in window === false) {
        window.scrollTo(0, destinationOffsetToScroll);
        if (callback) {
            callback();
        }
        return;
    }

    // Funzione con possibilità di attivare una funzione in callback
    function scroll() {
        // Ora
        const now = 'now' in window.performance ? performance.now() : new Date().getTime();
        const time = Math.min(1, ((now - startTime) / duration));
        const timeFunction = easings[easing](time);
        // Scrolling vero e proprio
        window.scrollTo(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

        if (window.pageYOffset === destinationOffsetToScroll) {
            if (callback) {
                callback();
            }
            return;
        }

        requestAnimationFrame(scroll);
    }

    scroll(); // Richiama la funzione, che poi richiamerà se stessa, fino a scrollare del tutto
}
