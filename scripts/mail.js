window.addEventListener("load", function () {
    document.getElementById('btn-sendmail').addEventListener("click", validateForm);
    document.getElementById('mittente').addEventListener("keyup", checkEmail);
    document.getElementById('mittente').addEventListener("change", checkEmail);
})

function validateForm(e) {
    e.preventDefault();
    if (checkEmail(document.getElementById('mittente')) &&
        document.getElementById('nome').value != '' &&
        document.getElementById('oggetto').value != '' &&
        document.getElementById('corpo').value != '') {
        window.location.href = buildMailTo();
        document.getElementsByTagName('form')[0].submit();
    } else if (document.getElementById('nome').value != '' &&
                document.getElementById('oggetto').value != '' &&
                document.getElementById('corpo').value != '') {
        alert("Controlla il campo della mail");
        return false;
    } else {
        alert("Riempi tutti i campi");
    }
}

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

function buildMailTo() {
    address = "mailto:ivan4.ravasi@gmail.com";
    subject = "?subject="+document.getElementById('oggetto').value;
    body = "&body="+document.getElementById('corpo').value+"%0A"+document.getElementById('nome').value;
    return address+subject+body;
}
