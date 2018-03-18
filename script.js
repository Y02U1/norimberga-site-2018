var lastScrollPosition = 0;
var imgs = document.getElementsByClassName('img'); // Array
var imgcurrent = 0;
var counter = 0;
var previous = window.scrollY;
var sublinks = document.getElementsByClassName('sublink');

for (var i = 0; i < sublinks.length; i++) {
    sublinks[i].addEventListener("click", function (event) {
        event.stopImmediatePropagation();
    })
}

function setOpacity(opacityValue) {
    for (var i = 0; i < imgs.length; i++) {
        for (child of imgs[i].children[0].children) {
            if (opacityValue) {
                child.style.transitionDuration = "1s";
            } else {
                child.style.transitionDuration = "0s";
            }
            child.style.opacity = opacityValue;
        }
    }
}

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

window.addEventListener("scroll", debouncedSlide);

function logScrollDirection() {
    if (window.scrollY > previous) {
        // console.log('down');
        var pos = determineScrollPos(false);
        scrollIt(pos);
    } else {
        // console.log('up');
        var pos = determineScrollPos(true);
        scrollIt(pos);
    }
    previous = window.scrollY;
}

function determineScrollPos(isUpward) {
    if (isUpward) {
        // Direzione ^
        if (imgcurrent == 0) {
            return false;
        } else {
            // Sposta in alto E aggiorna 'imgcurrent'
            return getCoords(imgs[--imgcurrent]).top;
        }
    } else {
        // Direzione ,
        if (imgcurrent == imgs.length-1) {
            return false;
        } else {
            // Sposta in basso E aggiorna 'imgcurrent'
            return getCoords(imgs[++imgcurrent]).top;
        }
    }
}

function getCoords(elem) {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// TODO documentazione
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

function scrollIt(destination, duration = 200, easing = 'linear', callback) {

  const easings = {
    linear(t) {
      return t;
    },
    easeInQuad(t) {
      return t * t;
    },
    easeOutQuad(t) {
      return t * (2 - t);
    },
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic(t) {
      return (--t) * t * t + 1;
    },
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart(t) {
      return t * t * t * t;
    },
    easeOutQuart(t) {
      return 1 - (--t) * t * t * t;
    },
    easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    },
    easeInQuint(t) {
      return t * t * t * t * t;
    },
    easeOutQuint(t) {
      return 1 + (--t) * t * t * t * t;
    },
    easeInOutQuint(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
  };

  const start = window.pageYOffset;
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

  const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
  const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

  if ('requestAnimationFrame' in window === false) {
    window.scrollTo(0, destinationOffsetToScroll);
    if (callback) {
      callback();
    }
    return;
  }

  function scroll() {
    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, ((now - startTime) / duration));
    const timeFunction = easings[easing](time);
    window.scrollTo(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

    if (window.pageYOffset === destinationOffsetToScroll) {
      if (callback) {
        callback();
      }
      return;
    }

    requestAnimationFrame(scroll);
  }

  scroll();
}

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

function collapseSubmenu() {
    var links = document.getElementsByClassName('sublink');
    var lis = document.getElementById('sub-menulist').children;
    if (lis[0].style.height != "0px") {
        // Sposta i link a SX
        for (var i = 0; i < links.length; i++) {
            links[i].style.position = "absolute";
            links[i].style.left = "-300px";
        }
        // Chiudi i <li>
        for(var i=0; i<lis.length; i++) {
            lis[i].style.height = "0px";
        }
    } else {
        // Espandi i <li>
        for(var i=0; i<lis.length; i++) {
            lis[i].style.height = "40px";
        }
        // Rimetti i link a posto
        for (var i = 0; i < links.length; i++) {
            links[i].style.position = "absolute";
            links[i].style.left = "10px";
        }
    }
}

function checkEmail(emailField) {
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
        }
    }
}
