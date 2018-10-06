var containerStyles = 'position:absolute;left:859px;top:69px;z-index:2147483647;padding:5px 0px;border-radius:3px;background:white;list-style-type:none;min-width:150px;text-align:left;color:black;border:1px solid dimgray;margin:0px;font-size:14px;';
var menuId = '_l-menu';
var menuOptionClass = '_l-menu-o';

window.LiveSelect = function () {
  var hoverTarget;
  var selectedTarget;
  var approvedTargets = [];
  var config = {
    highLightColor: 'cyan',
    contextMenuOptions: ['Toggle', 'Inspect Element']
  };

  var styles = document.createElement('style');
  styles.innerText = "#_l-menu{" + containerStyles + "}._l-menu-o{padding-left:5px;}._l-menu-o:hover{cursor:pointer;background:lightgray;}";
  document.body.appendChild(styles);

  var api = {};

  api.setContextMenuOptions = function (mOptions) {
    config.contextMenuOptions = mOptions;
  }

  api.getSelectedItems = function () {
    return approvedTargets;
  }

  api.setHighlightColor = function (color) {
    config.highLightColor = (color || '').toLowerCase() || 'cyan';
  }

  document.addEventListener('mousemove', function (e) {
    e = e || window.event;
    var x = e.clientX;
    var y = e.clientY;

    var nextElement = document.elementFromPoint(x, y);
    if (nextElement && nextElement.id !== menuId && nextElement.className !== menuOptionClass) {
      if (hoverTarget) {
        hoverTarget.style.border = null;
      }
      nextElement.style.border = 'solid 2px ' + config.highLightColor;
      hoverTarget = nextElement;
    }
  });

  window.clickHandler = function (name) {
    console.log(name);
    target[name]();
  }

  var getContextMenu = function () {
    var container = document.createElement('ul');
    container.id = '_l-menu';
    config.contextMenuOptions.forEach(function (option) {
      var li = document.createElement('li');
      li.innerText = option;
      li.className = menuOptionClass;
      container.appendChild(li);
    });
    return container;
  }

  window.oncontextmenu = function (e) {
    e = e || window.event;
    e.preventDefault();
    e.target.style.border = 'solid 2px red';
    nextPossibleTarget = e.target;
    var existingMenu = document.getElementById(menuId);
    if (existingMenu !== null) {
      existingMenu.parentNode.removeChild(existingMenu);
      // also release click handlers
    }
    var menu = getContextMenu();
    menu.style.position = 'absolute';
    menu.style.left = e.clientX + 'px';
    var scrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    menu.style.top = scrollTop + e.clientY + 'px';
    menu.style.zIndex = 9999999999;
    document.body.appendChild(menu);
  };

  return api;
}
