const { ipcRenderer } = require('electron');
window.$ = window.jQuery = require('jquery'), require('jquery-ui-dist/jquery-ui'); // eslint-disable-line

/* Widget stuff */

const updateWidgets = () => {
  // get elements
  const nodes = [...document.getElementById('BGwrapper').childNodes];
  let noteWidgets = nodes.filter(c => c.className !== undefined && c.className.includes('noteWidget'));
  let browserWidgets = nodes.filter(c => c.className !== undefined && c.className.includes('browserWidget'));

  // map left and top data
  noteWidgets = noteWidgets.map(n => (
    {
      left: parseInt(n.style.left.split('px')[0]),
      top: parseInt(n.style.top.split('px')[0]),
      height: n.clientHeight,
      width: n.clientWidth,
      src: '../images/noteIcon.png'
    }
  ));

  browserWidgets = browserWidgets.map(b => (
    {
      left: parseInt(b.style.left.split('px')[0]),
      top: parseInt(b.style.top.split('px')[0]),
      height: b.clientHeight,
      width: b.clientWidth,
      src: '../images/browserIcon.png'
    }
  ));

  // get preview dimensions
  const preview = {
    width: document.getElementById('BGpreview').width,
    height: document.getElementById('BGpreview').height
  };

  // add right click event listeners
  document.querySelectorAll('.noteWidget, .browserWidget').forEach(w => {
    w.addEventListener('contextmenu', () => {
      try {
        w.parentNode.removeChild(w);
      } catch (err) {};
      updateWidgets();
    });
  });

  // update opacity
  const opacity = document.getElementById('opacityPercent').value;
  $('.noteWidget').css({ opacity: opacity / 100 });
  $('.browserWidget').css({ opacity: opacity / 100 });
  $('.noteIcon').css({ opacity: 1.0 });
  $('.browserIcon').css({ opacity: 1.0 });

  // send data
  ipcRenderer.send('updateWidgets', [noteWidgets, browserWidgets, preview]);
};

$(document).ready(() => { // eslint-disable-line
  $('.noteIcon').draggable({ helper: 'clone', revert: 'invalid', appendTo: 'body' }); // eslint-disable-line
  $('.browserIcon').draggable({ helper: 'clone', revert: 'invalid', appendTo: 'body' }); // eslint-disable-line

  $('#BGwrapper').droppable({ // eslint-disable-line
    tolerance: 'fit',
    accept: '.noteIcon, .browserIcon',
    drop: (event, ui) => {
      let elt = $(ui.helper).clone();
      elt.children('.ui-resizable-handle').remove();
      $('#BGwrapper').append(elt.removeClass('noteIcon').removeClass('browserIcon').draggable({ containment: '#BGwrapper', stop: updateWidgets }).resizable({ containment: 'parent', resize: updateWidgets })); // eslint-disable-line
      updateWidgets();
    }
  });
});

ipcRenderer.on('makeWidgetsDraggable', () => {
  $('.noteWidget').draggable({ containment: '#BGpreview', stop: updateWidgets }).resizable({ containment: 'parent', resize: updateWidgets }); // eslint-disable-line
  $('.browserWidget').draggable({ containment: '#BGpreview', stop: updateWidgets }).resizable({ containment: 'parent', resize: updateWidgets }); // eslint-disable-line
});

ipcRenderer.on('addWidgetRightClick', () => {
  document.querySelectorAll('.noteWidget, .browserWidget').forEach(w => {
    w.addEventListener('contextmenu', () => {
      try {
        w.parentNode.removeChild(w);
      } catch (err) {};
      updateWidgets();
    });
  });
});

ipcRenderer.on('setOpacity', (event, opacity) => {
  $('.noteWidget').css({ opacity: opacity });
  $('.browserWidget').css({ opacity: opacity });
  $('.noteIcon').css({ opacity: 1.0 });
  $('.browserIcon').css({ opacity: 1.0 });
});

ipcRenderer.on('setOpacitySlider', (event, opacity) => {
  document.getElementById('opacityPercent').value = opacity * 100;
});

/* Preset stuff */

document.getElementById('opacityPercent').addEventListener('input', () => {
  const opacity = document.getElementById('opacityPercent').value;
  $('.noteWidget').css({ opacity: opacity / 100 });
  $('.browserWidget').css({ opacity: opacity / 100 });
  $('.noteIcon').css({ opacity: 1.0 });
  $('.browserIcon').css({ opacity: 1.0 });
  ipcRenderer.send('updateOpacity', opacity);
});

document.getElementById('savePreset').addEventListener('click', () => {
  ipcRenderer.send('savePreset');
});

document.getElementById('duplicatePreset').addEventListener('click', () => {
  ipcRenderer.send('duplicatePreset');
});

document.getElementById('deletePreset').addEventListener('click', () => {
  ipcRenderer.send('deletePreset');
});

document.getElementById('createPreset').addEventListener('click', () => {
  ipcRenderer.send('createPreset');
});

document.getElementById('resetPreset').addEventListener('click', () => {
  ipcRenderer.send('reload');
});

/* preset renaming */

// Get the modal
const modal = document.getElementById('myModal');

// When the user clicks on the button, open the modal
document.getElementById('renamePreset').addEventListener('click', () => {
  modal.style.display = 'block';
});

// When the user clicks on <span> (x), close the modal
document.getElementsByClassName('close')[0].addEventListener('click', () => {
  modal.style.display = 'none';
});

// When the user clicks on Cancel, close the modal
document.getElementById('cancelBtn').addEventListener('click', () => {
  modal.style.display = 'none';
});


// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

document.getElementById('saveBtn').addEventListener('click', () => {
  const newName = document.getElementById('newPresetName').value;
  ipcRenderer.send('renamePreset', newName);
});

/* backgrounds */

const backgrounds = ['csgo', 'r6siege', 'lol', 'fortnite', 'apex', 'hearthstone', 'overwatch', 'dota2'];

backgrounds.forEach(id => {
  document.getElementById(id).addEventListener('click', () => {
    ipcRenderer.send('selectBackground', id);
  });
});

/* background loading */

document.getElementById('BGpreview').addEventListener('load', (event) => {
  const targetElement = event.target || event.srcElement;
  ipcRenderer.send('loadWidgets', { width: targetElement.width, height: targetElement.height });
});

/* open overlay */

document.getElementById('openOverlay').addEventListener('click', () => {
  console.log("bunny");
  ipcRenderer.send('openOverlay');
});

/* functions */

ipcRenderer.on('initialize', () => {
  ipcRenderer.send('initialize');
});

ipcRenderer.on('render', (event, args) => {
  const id = args[0];
  const prop = args[1];
  const value = args[2];
  const concat = args[3] ? args[3] : false;

  if (concat) {
    document.getElementById(id)[prop] = document.getElementById(id)[prop] + value;
  } else {
    document.getElementById(id)[prop] = value;
  }
});

ipcRenderer.on('presetSelector', (event, args) => {
  args.forEach(a => {
    document.getElementById(a).addEventListener('click', () => {
      ipcRenderer.send('selectThisPreset', a);
    });
  });
});
