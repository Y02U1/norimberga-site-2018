// Quando si carica la pagina, calcola la timeline
window.addEventListener("load",function () {
    tls = document.getElementsByClassName('timeline-container');
    for (tl of tls) {
        tl.getElementsByClassName('icon-leftarrow')[0].addEventListener("click", changeDay);
        tl.getElementsByClassName('icon-rightarrow')[0].addEventListener("click", changeDay);
    }
    calcTimeline();
    checkArrows();
    // ---------------------------- AGGIUNTA INFO SULLA DURATA
    for (item of document.getElementsByClassName('event-bubble')) {
        if (!(item.classList.contains('start') || item.classList.contains('end'))) {
            // Se NON è un evento di inizio o fine...
            duration = Number(item.getAttribute('data-event-end'))-Number(item.getAttribute('data-event-begin'));
            calcDuration(item, duration);
        } else {
            calcBeginEndDay(item);
        }
    }
})

// Sul ridimensionamento della finestra, ricalcola la timeline
window.onresize = function() {
    calcTimeline();
};

function calcTimeline() {
    /*
        Prendi:
            - eventTags: lista di eventi temporali
            - hourBegin: ora d'inizio della giornata
            - hourEnd: ora di fine della giornata
            - posBegin: posizione in pixel di partenza
            - posEnd: posizione in pixel di arrivo
    */
    actTl = document.getElementById('timeline-active');
    eventTags = actTl.getElementsByClassName('event-bubble');
    hourBegin = Number(eventTags[0].getAttribute('data-begin'));
    hourEnd = Number(eventTags[eventTags.length-1].getAttribute('data-end'));
    posBegin = Math.floor(getCoords(eventTags[0]).left);
    posEnd = Math.floor(getCoords(eventTags[eventTags.length-1]).left);
    /*
        Calcola:
            - tlTotalWidth = larghezza TOTALE della timeline
            - tlEffWidth = larghezza EFFETTIVA (solo ciò che si vede della
                linea) della timeline
            - refWidth = larghezza dell'evento d'inizio e fine (di riferimento)
    */
    tlTotalWidth = posEnd - posBegin;
    refWidth = eventTags[0].offsetWidth;
    tlEffWidth = tlTotalWidth - refWidth;
    /*
        Opera su tutti gli elementi (eventi) della timeline
    */
    for (item of eventTags) {
        // Se l'evento ha: inizio && fine dell'evento
        if (item.getAttribute('data-event-end') != null && item.getAttribute('data-event-begin') != null) {
            // ----------------------------- CALCOLO DIMENSIONE BOLLA
            // Calcola la durata dell'evento (inizio - fine)
            duration = Number(item.getAttribute('data-event-end'))-Number(item.getAttribute('data-event-begin'));
            // Calcola (proporzione) la dimensione della bolla
            //      altezza/lunghezza della sfera : lunghezza della linea = durata dell'evento : durata del giorno
            apprSize = tlEffWidth*duration/(hourEnd - hourBegin);
            // Approssima il tutto a 2 decimali (per alleviare il lavoro del PC)
            apprSize = Number(apprSize.toFixed(2));
            // Siccome c'è un bordo bisogna tenerne conto
            item.style.width = ((apprSize - 8)+"px");
            item.style.height = ((apprSize - 8)+"px");
            item.style.borderWidth = "4px";
            // ---------------------------- CALCOLO DISTANZA
            // ore dall'inizio giorno : ore totali = distanza in px sulla linea : lunghezza della linea
            distPx = (item.getAttribute('data-event-begin') - hourBegin) * tlEffWidth / (hourEnd - hourBegin);
            // distanza in % sulla lunghezza totale della linea : lunghezza totale %
            //                                      =
            // distanza in px sulla linea + metà evento iniziale + metà lunghezza della bolla : lunghezza totale px
            distPerc = (refWidth/2+distPx+parseInt(item.style.width,10)/2) * 90 / tlTotalWidth;
            // Aggiungi 10 (lo spazio dalla SX della timeline) e '%'
            item.style.left = (distPerc+5)+"%";
        }
    }
}

function checkArrows() {
    allTl = document.getElementsByClassName('timeline-container');
    activeTl = document.getElementById('timeline-active');
    leftArrow = activeTl.getElementsByClassName('icon-leftarrow')[0];
    rightArrow = activeTl.getElementsByClassName('icon-rightarrow')[0];
    // Nascondi la freccia di SX
    if (activeTl == allTl[0]) {
        leftArrow.style.display = "none";
    } else {
        leftArrow.style.display = "inline";
    }
    // Nascondi la freccia di DX
    if (activeTl == allTl[allTl.length-1]) {
        rightArrow.style.display = "none";
    } else {
        rightArrow.style.display = "inline";
    }
}

function changeDay() {
    activeTl = document.getElementById('timeline-active');
    if (this.classList.contains('icon-leftarrow')) {
        // SINISTRA SX
        allTl = document.getElementsByClassName('timeline-container');
        var i;
        for (i = 0; i < allTl.length; i++) {
            if (allTl[i] == activeTl) {
                break;
            }
        }
        nearTl = allTl[i-1];
        activeTl.style.left = "200%";
        activeTl.style.position = "absolute";
        activeTl.removeAttribute("id");
        for (tag of document.getElementsByTagName('h1')) {
            tag.style.opacity = '0';
        }
        nearTl.style.left = "0";
        nearTl.setAttribute("id","timeline-active");
        setTimeout(() => {
            activeTl.getElementsByTagName('h1')[0].style.opacity = '1';
        }, 1000);
    } else if (this.classList.contains('icon-rightarrow')) {
        // DESTRA DX
        allTl = document.getElementsByClassName('timeline-container');
        var i;
        for (i = 0; i < allTl.length; i++) {
            if (allTl[i] == activeTl) {
                break;
            }
        }
        nearTl = allTl[i+1];
        activeTl.style.left = "-200%";
        activeTl.removeAttribute("id");
        for (tag of document.getElementsByTagName('h1')) {
            tag.style.opacity = '0';
        }
        nearTl.style.left = "0";
        nearTl.setAttribute("id","timeline-active");
        setTimeout(() => {
            activeTl.getElementsByTagName('h1')[0].style.opacity = '1';
        }, 1000);
    }
    calcTimeline();
    checkArrows();
}

function calcDuration(elem, duration) {
    h3s = elem.getElementsByTagName('h3');
    // Crea il <br>
    var br = document.createElement("br");
    // Crea il nodo da aggiungere
    var span = document.createElement("span");
    var icon = document.createElement("i");
    icon.setAttribute('class','icon-clock');
    span.appendChild(icon);
    var text = document.createTextNode(" "+duration+"h");
    span.appendChild(text);
    if (h3s.length > 1) {
        box = elem.children[0];
        if (item.classList.contains('up')) {
            var br2 = document.createElement("br");
            box.insertBefore(br, h3s[0]);
            box.insertBefore(br2, br);
            box.insertBefore(span, br2);
        } else if (item.classList.contains('down')) {
            // Aggiungi in fondo al box
            box.appendChild(br);
            box.appendChild(span);
        }
    } else if (h3s.length == 1) {
        /* Aggiungi dopo l'<h3> */
        // Ottieni il genitore a cui aggiungere il <span>
        box = elem.children[0];
        reference = box.children[1];
        // Aggiungi <br>
        box.insertBefore(br, reference)
        // Aggiungi <span>
        box.insertBefore(span, br);
    }
}

function getCoords(elem) {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}

function calcBeginEndDay(elem) {
    // Crea il <br>
    var br = document.createElement("br");
    // Crea il nodo da aggiungere
    var span = document.createElement("span");
    var icon = document.createElement("i");
    var text;
    // SELEZIONE: se è un evento di inizio o fine...
    if (elem.classList.contains('start') && elem.hasAttribute('data-begin')) {
        // Se INIZIO
        icon.setAttribute('class','icon-alarm-clock');
        span.appendChild(icon);
        text = document.createTextNode(" "+hourToPM(elem.getAttribute('data-begin')));
        span.appendChild(text);
    } else if (elem.classList.contains('end') && elem.hasAttribute('data-end')) {
        // Se FINE
        icon.setAttribute('class','icon-bed');
        span.appendChild(icon);
        text = document.createTextNode(" "+hourToPM(elem.getAttribute('data-end')));
        span.appendChild(text);
    }
    /* Aggiungi dopo l'<h3> */
    // Ottieni il genitore a cui aggiungere il <span>
    box = elem.children[0];
    reference = box.children[1];
    // Aggiungi <br>
    box.insertBefore(br, reference)
    // Aggiungi <span>
    box.insertBefore(span, br);
}

/* Converti l'ora "time" (6 / 6,5) in 06:00 / 06:30 */
function hourToPM(time) {
    var hourString = "";
    var timeNum = Number(time);
    if (timeNum % 1 == 0) {
        // Non ha decimali
        if (time.length == 2) {
            hourString+=time+":"+"00";
        } else if (time.length == 1) {
            hourString+="0"+time+":"+"00";
        }
    } else {
        // Ha decimali
        var hour = (timeNum-0.5).toString();
        if (hour.length == 2) {
            hourString+=hour+":"+"30";
        } else if (hour.length == 1) {
            hourString+="0"+hour+":"+"30";
        }
    }
    return hourString;
}
