var ById = function (id) {
    return document.getElementById(id);
}

var back = ById('back'),
    forward = ById('forward'),
    refresh = ById('refresh'),
    omni = ById('url'),
    view = ById('view');

    function reloadView () {
        view.reload();
    }
    
    function backView () {
        view.goBack();
    }
    
    function forwardView () {
        view.goForward();
    }
    
    function updateURL (event) {
        if (event.keyCode === 13) {
            omni.blur();
            let val = omni.value;
            let https = val.slice(0, 8).toLowerCase();
            let http = val.slice(0, 7).toLowerCase();
            if (https === 'https://') {
                view.loadURL(val);
            } else if (http === 'http://') {
                view.loadURL(val);
            } else {
            view.loadURL('http://'+ val);
            }
        }
    }
    
    function handleUrl (event) {
        if (event.target.className === 'link') {
            event.preventDefault();
            view.loadURL(event.target.href);
        } else if (event.target.className === 'favicon') {
            event.preventDefault();
            view.loadURL(event.target.parentElement.href);
        }
    }
    
    function updateNav (event) {
        omni.value = view.src;
    }
    
    refresh.addEventListener('click', reloadView);
    back.addEventListener('click', backView);
    forward.addEventListener('click', forwardView);
    omni.addEventListener('keydown', updateURL);
    view.addEventListener('did-finish-load', updateNav);