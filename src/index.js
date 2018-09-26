window.LiveSelect = function (config, target) {
  var hoverTarget;
  var selectedTarget;
  var approvedTargets = [];

  document.addEventListener('mousemove', function (e) {
    e = e || window.event;
    var x = e.clientX;
    var y = e.clientY;
    if (hoverTarget) {
      hoverTarget.style.border = null;
    }
    var nextElement = document.elementFromPoint(x, y);
    if (nextElement) {
      nextElement.style.border = 'solid 2px black';
      hoverTarget = nextElement;
    }
  });

  window.clickHandler = function (name) {
    console.log(name);
    target[name]();
  }

  var getContextMenu = function () {
    var parentElement = document.createElement('ul');
    parentElement.id = 'live-menu';
    for (var key in config) {
      if ({}.hasOwnProperty.call(config, key)) {
        var li = document.createElement('li');
        li.innerText = key;
        li.setAttribute('onclick', 'clickHandler("' + key + '")');
        parentElement.appendChild(li);
      }
    }
    return parentElement;
  }

  window.oncontextmenu = function (e) {
    e = e || window.event;
    e.preventDefault();
    e.target.style.border = 'solid 2px red';
    nextPossibleTarget = e.target;
    var existingMenu = document.getElementById('live-menu');
    if (existingMenu !== null) {
      existingMenu.parentNode.removeChild(existingMenu);
      // also release click handlers
    }
    var menu = getContextMenu();
    menu.style.position = 'absolute';
    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';
    menu.style.zIndex = 9999999999;
    document.body.appendChild(menu);
  };
}
