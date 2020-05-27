'use strict';

// component instantiation
mdc.topAppBar.MDCTopAppBar.attachTo(document.querySelector(".mdc-top-app-bar"));
const menue = mdc.menu.MDCMenu.attachTo(document.querySelector(".mdc-menu"));
const snackbar = mdc.snackbar.MDCSnackbar.attachTo(document.querySelector(".mdc-snackbar"));
let selectedListItem = document.querySelector(".mdc-list-item");

const states = {
    pending: 'PENDING',
    accepted: 'ACCEPTED',
    denied: 'DENIED'
}

let vacationRequests;
let currentItem;

window.addEventListener("click", function (e) {
    e.stopPropagation();
    menue.open = false;
    currentItem = null;
});

getVacationRequests();

// event listeners
function handleMenuClick(state) {
    const r = new XMLHttpRequest();
    currentItem.state = state;
    r.addEventListener("load", function () {
        if (r.status == 200 || r.status == 204) {
            getVacationRequests();
        } else {
            snackbar.labelText = "Request failed. Server returned " + r.status;
            snackbar.open();
        }
    });
    r.addEventListener("error", function () {
        snackbar.labelText = "Request failed. Please try again in 5 seconds.";
        snackbar.open();
    });
    r.open("PATCH", `${window.location}/${currentItem.id}`);
    r.setRequestHeader('Content-Type', 'application/json');
    r.send(JSON.stringify({state: state}));

    currentItem = null;
    menue.open = false;
}

document.getElementById("menu_accept").addEventListener("click", function(){
    handleMenuClick(states.accepted);
});

document.getElementById("menu_reject").addEventListener("click", function(){
    handleMenuClick(states.denied);
});

const listItems = document.querySelectorAll(".dmc-list-item");
for (let i = 0; i < listItems.length; i++) {
    updateStateIcon(listItems[i]);
}

function getVacationRequests() {
    const Http = new XMLHttpRequest();
    Http.open("GET", window.location)
    Http.setRequestHeader('Accept', 'application/hal+json');
    Http.send();

    Http.onload = (e) => {
        document.getElementById('requests').innerHTML='';
        JSON.parse(Http.responseText).vacationRequests.forEach(r => renderRequest(r));
    }
}

function renderRequest(request) {

    let icon = document.createElement('span');
    icon.classList = "mdc-list-item__graphic  material-icons";
    if (request.state === states.accepted) {
        icon.innerText = 'check_circle'
    } else if (request.state === states.denied) {
        icon.innerText = 'cancel'
    } else {
        icon.innerText = 'help'
    }

    let primaryText = document.createElement('span');
    primaryText.classList = "mdc-list-item__primary-text";
    let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    primaryText.innerText = `${request.user}: ${new Date(request.from).toLocaleString('en-GB', options)} - ${new Date(request.to).toLocaleString('en-GB', options)}`;

    let secondaryText = document.createElement('span');
    secondaryText.classList = 'mdc-list-item__secondary-text'
    secondaryText.innerText = `[${request.type}] ${request.comment ? 'Comment: ' + request.comment : ''}`

    let text = document.createElement('span');
    text.classList = "mdc-list-item__text";
    text.appendChild(primaryText);
    text.appendChild(secondaryText);

    let requestElement = document.createElement("li");
    requestElement.classList = 'mdc-list-item';
    requestElement.role = 'menuitem';
    requestElement.appendChild(icon);
    requestElement.appendChild(text);
    requestElement.setAttribute('id', request.id);

    requestElement.addEventListener("click", function (e) {
        e.stopPropagation();
        
        if (currentItem && currentItem.id === request.id) {
            menue.open = false;
            currentItem = null;
        } else {
            menue.open = true;
            currentItem = request;
        }
        selectedListItem = e.currentTarget.parentElement;
        menue.setAbsolutePosition(e.clientX, e.clientY);
    });

    document.getElementById('requests').appendChild(requestElement);
}
