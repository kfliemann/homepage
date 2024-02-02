/**
 * this defines, which portfolio page will be displayed
 * body can have n elements, because body has more content than head / footer
 * footer is the n+1th element
 * 1 = head | n >= 2 = body | n+1 = footer 
 */
var pageState = 1;

/**
 * @param {*} event 
 * check if user tried scrolling page with scroll wheel
 */
function checkScroll(event) {
    let delta;
    if (event.wheelDelta) {
        delta = event.wheelDelta;
    } else {
        delta = -1 * event.deltaY;
    }

    if (delta < 0) {
        switchPageState(0);
    } else if (delta > 0) {
        switchPageState(1);
    }

}

/**
 * @param {*} direction 
 * 0 = down | 1 = up
 * creating new child divs inside of slideContainer div will result in new pagestates
 * else if statement in each case is causing infinite scrolling in each direction
 */
function switchPageState(direction) {
    slideContainer = document.getElementById("slideContainer");
    pageElements = slideContainer.children;

    switch (direction) {
        case 0:
            if (pageState < pageElements.length) {
                amount = pageState * -100;
                slideContainer.style.top = amount + "vh";
                pageElements[pageState].style.position = "relative"
                pageState++;
            } else if (pageState == pageElements.length) {
                pageState = 1;
                slideContainer.style.top = "0vh";
                pageElements[pageState - 1].style.position = "relative"
            }
            break;
        case 1:
            if (pageState > 1) {
                pageState--;
                amount = (pageState - 1) * -100;
                slideContainer.style.top = amount + "vh";
            } else if (pageState == 1) {
                pageState = pageElements.length;
                for (let i = 0; i < pageState; i++) {
                    pageElements[i].style.position = "relative";
                }
                amount = (pageState - 1) * -100;
                slideContainer.style.top = amount + "vh";
            }
            break;
        default:
            console.log("easteregg");
            break;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    slideContainer = document.getElementById("slideContainer");
    slideContainer.style.height = (slideContainer.children.length * 100) + "vh";
});



//TODO mobile view page scrolling - maybe bad idea to implement. 
var touchStartY;

function handleTouchStart(event) {
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    var touchEndY = event.touches[0].clientY;
    var deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaY) > 10) {
        console.log("moved");
    }

    touchStartY = touchEndY;
}

