window.addEventListener("load", function () {
    document.getElementById('btn-sendmail').addEventListener("click", validateForm);
    document.getElementById('mittente').addEventListener("keyup", checkEmail);
    document.getElementById('mittente').addEventListener("change", checkEmail);
})

/* Valida la form, parametro l'evento */
function validateForm(e) {
    e.preventDefault(); // Impedisci la normale azione
    // Controlla i campi vuoti e l'email
    if (checkEmail(document.getElementById('mittente')) &&
        document.getElementById('nome').value != '' &&
        document.getElementById('oggetto').value != '' &&
        document.getElementById('corpo').value != '') {
        // Se va tutto bene
        window.location.href = buildMailTo(); // Crea l'URL e vai
        document.getElementsByTagName('form')[0].submit(); // E "submitta" la form
    } else if (document.getElementById('nome').value != '' &&
                document.getElementById('oggetto').value != '' &&
                document.getElementById('corpo').value != '') {
        alert("Controlla il campo della mail"); // Dì cosa controllare
        document.getElementById('mittente').focus(); // Fai focus sul mittente
        return false; // E ritorna falso
    } else {
        alert("Riempi tutti i campi"); // Dì di riempire tutto
    }
}

/*
    Controlla il campo dell'email:
        aggiornando una <span> per informare l'utente, con qualche piccola decorazione stilistica
        ritornando un valore, true/false a seconda dell'esito

    Evito commenti al codice estremamente didascalico: se non si riescono a capire
    le condizioni osservare il testo messo sulla <span>
*/
function checkEmail() {
    emailField = document.getElementById('mittente');
    isGood = true;
    posAt = emailField.value.indexOf("@");
    posDot = emailField.value.lastIndexOf(".");
    if (emailField.value == "") {
        document.getElementById('mail-popup').innerHTML = "<i class='icon-cross-slim'></i> Il campo non può essere vuoto";
        isGood = false;
    } else {
        // IF NOT .
        if (posDot == -1) {
            document.getElementById('mail-popup').innerHTML = "<i class='icon-cross-slim'></i> Ci dev'essere almeno un .";
            isGood = false;
            // ELSE esegui i controlli
        } else {
            if (emailField.value.length-1==posDot) {
                document.getElementById('mail-popup').innerHTML = "<i class='icon-cross-slim'></i> Non ci sono caratteri dopo il .";
                isGood = false;
            }
        }
        // IF esiste la @
        if(posAt != -1) {
            // Controlla +2 @
            if (posAt != emailField.value.lastIndexOf("@")) {
                document.getElementById('mail-popup').innerHTML = "<i class='icon-cross-slim'></i> C'è più di 1 @";
                isGood = false;
            } else {
                if(posAt < 1) {
                    document.getElementById('mail-popup').innerHTML = "<i class='icon-cross-slim'></i> Non ci sono caratteri prima di @";
                    isGood = false;
                }
                if (posDot != -1) {
                    if (posDot-posAt < 2) {
                        document.getElementById('mail-popup').innerHTML = "<i class='icon-cross-slim'></i> Non ci sono caratteri tra @ e .";
                        isGood = false;
                    }
                }
            }
        // ELSE informa mancanza @
        } else {
            document.getElementById('mail-popup').innerHTML = "<i class='icon-cross-slim'></i> Non c'è una @";
            isGood = false;
        }
        if (isGood) {
            document.getElementById('mail-popup').innerHTML = "<i class='icon-tick'></i> Indirizzo e-mail verificato";
            emailField.style.backgroundColor = "rgb(111, 255, 98)";
        } else {
            emailField.style.backgroundColor = "rgb(255, 96, 96)";
        }
    }
    return isGood;
}

/* Crea il link mailto */
function buildMailTo() {
    address = "mailto:ivan4.ravasi@gmail.com";
    subject = "?subject="+document.getElementById('oggetto').value;
    body = "&body="+document.getElementById('corpo').value+"%0A"+document.getElementById('nome').value;
    return address+subject+body;
}
