'use strict';

function onClickSave() {

    var request = new XMLHttpRequest();
    let path = window.location.pathname.split('/')[1];
    request.open("POST", window.location.origin + '/' + path + '/vacationrequest');
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({
        user: document.getElementById('name-input').value,
        from: stringToDate(document.getElementById('from-input').value),
        to: stringToDate(document.getElementById('to-input').value),
        type: getSelectedType(),
        state: 'PENDING',
        comment: document.getElementById('comment-input').value
    }));
    

    request.onload = (e) => {
        if(request.status === 201) {
            window.location.href = 'vacationrequest';
        } else {
            document.getElementById('error').innerText = JSON.parse(request.responseText).error;
        }
    }
}

function getSelectedType() {
    for (const radioBtn of document.querySelectorAll('.mdc-radio__native-control')) {
        if (radioBtn.checked) {
            return radioBtn.value;
        }
    }
}

function stringToDate(s) {
    const [day, month, year] = s.split('.');
    return new Date(year, month - 1, day);
}