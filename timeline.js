// Quando si carica la pagina, calcola la timeline
window.onload = function() {
    calcTimeline();
};

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
    eventTags = document.getElementsByClassName('event');
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
    refWidth = eventTags[0].offsetWidth
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
            distPerc = (refWidth/2+distPx+parseInt(item.style.width,10)/2) * 80 / tlTotalWidth;
            // Aggiungi 10 (lo spazio dalla SX della timeline) e '%'
            item.style.left = (distPerc+10)+"%";
        }
    }
}
