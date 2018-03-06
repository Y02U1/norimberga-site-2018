var lastScrollPosition = 0;
var imgs = document.getElementsByClassName('img'); // Array
var imgcurrent = 0;
var counter = 0;
var previous = window.scrollY;

// TODO scrolling OutOfBorder down
var debouncedSlide = debounce(function() {
    // console.log("Scrollato a: "+window.scrollY);
    // console.log("Precedentemente: "+previous);
    if (window.scrollY > previous) {
        // console.log('down');
        var pos = determineScrollPos(false);
        window.removeEventListener("scroll", debouncedSlide);
        scrollIt(pos);
        setTimeout(function() {
            window.addEventListener("scroll", debouncedSlide);
        }, 300);
        if (imgcurrent == imgs.length-1) {
            setTimeout(function() {
                imgs[imgs.length-1].children[0].style.width = "90%";
            }, 300);
        }
        previous = getCoords(imgs[imgcurrent]).top;
    } else {
        // console.log('up');
        var pos = determineScrollPos(true);
        window.removeEventListener("scroll", debouncedSlide);
        scrollIt(pos);
        setTimeout(function() {
            window.addEventListener("scroll", debouncedSlide);
        }, 300);
        imgs[imgs.length-1].children[0].style.width = "40%"; // FIXME ottimizza
        previous = getCoords(imgs[imgcurrent]).top;
    }
    // console.log("\"Previous\" ora è a: "+previous);
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
/*
var sl = debounce(function() {
    if (counter == 0) {
        console.log(counter);
        var newScrollPosition = window.scrollY;

        if (newScrollPosition < lastScrollPosition){
            console.log("Up");
            var pos = determineScrollPos(true);
            if (pos) {
                scrl = setTimeout(function () {
                    window.removeEventListener("scroll", slide);
                    scrollIt(pos);
                    clearTimeout(scrl);
                    setTimeout(function () {
                        counter = 0;
                        window.addEventListener("scroll", slide);
                    }, 1000);
                }, 1000);
            }
        }else{
            console.log("Down");
            var pos = determineScrollPos(false);
            console.log(pos);
            if (pos) {
                scrl = setTimeout(function () {
                    window.removeEventListener("scroll", slide);
                    scrollIt(pos);
                    clearTimeout(scrl);
                    console.log("DONEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
                    setTimeout(function () {
                        counter = 0;
                        window.addEventListener("scroll", slide);
                    }, 1000);
                }, 1000);
            }
        }
        lastScrollPosition = newScrollPosition;
        counter++;
    }
}, 3000);
*/
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

/*
// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};
*/

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
            links[i].style.left = "-100%";
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
/*
function checkEmail(emailField) {
    posAt = emailField.value.indexOf("@");
    posDot = emailField.value.lastIndexOf(".");
    if (emailField.value == "") {
        document.getElementById('mail-info').style.height = "0px";
    } else {
        document.getElementById('mail-info').style.height = "60px";
        // IF esiste la @
        if(posAt != -1) {
            document.getElementById('no@').style.display = 'none';
            // Controlla +2 @
            if (posAt != emailField.value.lastIndexOf("@")) {
                document.getElementById('more@').style.display = "list-item";
                document.getElementById('before@').style.display = "none";
                document.getElementById('between@.').style.display = "none";
            } else {
                document.getElementById('more@').style.display = "none";
                if(posAt < 1) {
                    document.getElementById('before@').style.display = "list-item";
                } else {
                    document.getElementById('before@').style.display = "none";
                }
                if (posDot != -1) {
                    if (posDot-posAt < 2) {
                        document.getElementById('between@.').style.display = "list-item";
                    } else {
                        document.getElementById('between@.').style.display = "none";
                    }
                }
            }
        // ELSE informa mancanza @
        } else {
            document.getElementById('no@').style.display = "list-item";
            document.getElementById('before@').style.display = "none";
            document.getElementById('between@.').style.display = "none";
            document.getElementById('more@').style.display = "none";
        }
        // IF NOT .
        if (posDot == -1) {
            document.getElementById('no.').style.display = "list-item";
            document.getElementById('after.').style.display = "none";
            document.getElementById('between@.').style.display = "none";
        // ELSE esegui i controlli
        } else {
            document.getElementById('no.').style.display = "none";
            if (emailField.value.length-1==posDot) {
                document.getElementById('after.').style.display = "list-item";
            } else {
                document.getElementById('after.').style.display = "none";
            }
        }
        if (document.getElementById('no@').style.display == 'none' &&
            document.getElementById('before@').style.display == 'none' &&
            document.getElementById('between@.').style.display == 'none' &&
            document.getElementById('more@').style.display == 'none' &&
            document.getElementById('no.').style.display == 'none' &&
            document.getElementById('after.').style.display == 'none') {
            document.getElementById('validated').style.display = 'list-item';
            document.getElementById('mail-info').style.backgroundColor = 'rgb(10, 191, 82)';
        } else {
            document.getElementById('validated').style.display = 'none';
            document.getElementById('mail-info').style.backgroundColor = 'rgb(230, 78, 78)';
        }
    }
}
*/

// window.onload = function() {
//     // document.getElementById('main-page').style.height = window.innerHeight+"px";
//     var links = document.getElementsByClassName('sublink');
//     var lis = document.getElementById('sub-menulist').children;
//     // Espandi i <li>
//     for(var i=0; i<lis.length; i++) {
//         lis[i].style.height = "40px";
//     }
//     // Rimetti i link a posto
//     for (var i = 0; i < links.length; i++) {
//         links[i].style.position = "absolute";
//         links[i].style.left = "10px";
//     }
// }

//
// window.onresize = function() {
//     document.getElementById('main-page').style.height = window.innerHeight+"px";
// }
