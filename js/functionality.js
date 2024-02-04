/**
 * this defines, which portfolio page will be displayed
 * body can have n elements, because body has more content than head / footer
 * footer is the n+1th element
 * 0 = prepend footer | 1 = head | n >= 2 = body | n+1 = footer |n+2 = append head
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
 * eventListener is used for an instant transition from top/bottom bottom/top for smoother scrolling
 */
function switchPageState(direction) {
    let slideContainer = document.getElementById("slideContainer");
    let pageElements = slideContainer.childElementCount;

    if (!slideContainer.classList.contains("slideContainer")) {
        slideContainer.classList.add('slideContainer');
    }

    switch (direction) {
        case 0:
            if (pageState < pageElements - 1) {
                pageState++;
                slideContainer.style.top = pageState * -100 + "vh";

                //remove transition effect, move window to initial pagestate
                slideContainer.addEventListener('transitionend', function () {
                    if (pageState == (pageElements - 1)) {
                        slideContainer.classList.remove('slideContainer');
                        pageState = 1;
                        slideContainer.style.top = pageState * -100 + "vh";
                    }
                    removeBlinking();
                });
            }
            break;
        case 1:
            if (pageState >= 1) {

                pageState--;
                slideContainer.style.top = pageState * -100 + "vh";

                //remove transition effect, move window to initial pagestate
                slideContainer.addEventListener('transitionend', function () {
                    if (pageState == 0) {
                        slideContainer.classList.remove('slideContainer');
                        pageState = pageElements - 2;
                        slideContainer.style.top = pageState * -100 + "vh";
                    }
                    removeBlinking();
                });
            }
            break;
    }
}

function removeBlinking() {
    let slideContainer = document.getElementById("slideContainer");
    tempState = pageState - 1;
    if (slideContainer.querySelector('.code-7') !== null) {
        let tempElem = slideContainer.querySelector('.code-7');
        tempElem.classList.remove("code-7");
        tempElem.classList.remove("code-follow")
    }
    if (tempState == (slideContainer.childElementCount - 2)) {
        let tempElem = slideContainer.children[tempState].querySelector(".code-blinking");
        slideContainer.querySelectorAll('.code-blinking').forEach(element => {
            if (element !== tempElem) {
                element.classList.remove("code-blinking");
            }
        });
    } else if (tempState > 1 && tempState < (slideContainer.childElementCount - 2)) {
        if (slideContainer.children[tempState].querySelector('.code-blinking') !== null) {
            let tempElem = slideContainer.children[tempState].querySelector('.code-blinking');
            tempElem.classList.remove("code-blinking")
        }
    }
}

/**
 * move to head element, used in buttons
 */
function moveToHead() {
    let slideContainer = document.getElementById("slideContainer");
    pageState = 1;
    slideContainer.style.top = pageState * -100 + "vh";
}

/**
 * live character counter functionality
 */
function changeCharacterCount() {
    let maxLength = 280;
    let limit = 3;
    let textarea = document.getElementById("contact-textarea");
    let characterCount = document.getElementById("characterCount");

    characterCount.textContent = maxLength - textarea.value.length;

    var lines = textarea.value.split("\n");

    if (lines.length > limit) {
        textarea.value = lines.slice(0, limit).join("\n");
    }
}

/**
 * append first / prepend last item to list for smoother infinite scroll
 * disable arrow up / down page up / down if textarea focused
 */
document.addEventListener('DOMContentLoaded', function () {
    let slideContainer = document.getElementById("slideContainer");
    let slideElements = document.getElementById("slideContainer").children;
    let firstElement = slideElements[0].cloneNode(true);
    let lastElement = slideElements[slideElements.length - 1].cloneNode(true);
    let contactTextarea = document.getElementById("contact-textarea");

    slideContainer.insertBefore(lastElement, slideElements[0]);
    slideContainer.appendChild(firstElement);

    slideContainer.style.height = (slideContainer.childElementCount * 100) + "vh";

    document.addEventListener('keydown', function (event) {
        if ((event.key === 'ArrowUp' || event.key === 'PageUp') && event.target !== contactTextarea) {
            switchPageState(1);
        } else if ((event.key === 'ArrowDown' || event.key === 'PageDown') && event.target !== contactTextarea) {
            switchPageState(0);
        }
    });
});

/**
 * send ajax request to php script
 */
function sendAjaxRequest() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "./php/backend.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("text=" + document.getElementById("contact-textarea").value);

    document.getElementById("contact-textarea").value = "message sent!";
}






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

