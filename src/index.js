var containerStyles = 'position:absolute;left:859px;top:69px;z-index:2147483647;padding:5px 0px;border-radius:3px;background:white;list-style-type:none;min-width:150px;text-align:left;color:black;border:1px solid dimgray;margin:0px;font-size:14px;';
var menuId = '_l-menu';
var menuItemClass = '_l-menu-item';
var menuItemKeyClass = '_l-menu-item-key';
var menuItemValueClass = '_l-menu-item-value';
var menuItemHeaderClass = '_l-menu-item-header';
var internalClasses = [menuItemClass, menuItemKeyClass, menuItemValueClass, menuItemHeaderClass];

window.LiveSelect = function (cb) {
  var hoverTarget;
  var selectedTarget;
  var approvedTargets = [];
  var config = {
    highLightColor: 'cyan',
    mouseEvent: 'mousedown'
  };

  var styles = document.createElement('style');
  styles.innerText = "#_l-menu{" + containerStyles + "}._l-menu-item{padding-left:5px;padding-right:5px;}._l-menu-item-key{color:purple;}._l-menu-item-value{padding-left:5px;}";
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
    if (nextElement && nextElement.id !== menuId && internalClasses.indexOf(nextElement.className) === -1) {
      if (hoverTarget) {
        hoverTarget.style.border = null;
      }
      nextElement.style.border = 'solid 2px ' + config.highLightColor;
      hoverTarget = nextElement;
    }
  }, false);

  var createContextMenu = function () {
    var container = document.createElement('ul');
    container.id = menuId;
    return container;
  }

  var displayPayload = function (payload, container) {
    var pureContainer = container;
    if (container.children.length > 0) {
      pureContainer = container.cloneNode(false);
      container.parentNode.replaceChild(pureContainer, container);
    }
    
    function fillContainer(obj) {
      for (var prop in obj) {
        if ({}.hasOwnProperty.call(obj, prop)) {
          if (typeof obj[prop] === 'object') {
            const section = document.createElement('strong');
            section.className = menuItemHeaderClass;
            section.innerText = prop + ':';
            pureContainer.appendChild(section);
            fillContainer(obj[prop]);
          } else {
            var item = document.createElement('li');
            item.className = menuItemClass;
            var key = document.createElement('span');
            key.className = menuItemKeyClass;
            key.innerText = prop + ':';
            var value = document.createElement('span');
            value.className = menuItemValueClass;
            value.innerText = ("\"" + obj[prop]).trim() + "\"";
            item.appendChild(key);
            item.appendChild(value);
            pureContainer.appendChild(item);
          }
        }
      }
    }
    fillContainer(payload);
  }

  var stopPageLoad = function () {
    window.stop();
    // IE
    document.execCommand('Stop');
  }

  window.clickHandler = function (name) {
    target[name]();
  }

  window.addEventListener(config.mouseEvent, function (e) {
    e = e || window.event;
    if (e.target && (e.target.id === menuId || internalClasses.indexOf(e.target.className) !== -1)) {
      return;
    }
    e.preventDefault();
    stopPageLoad();
    nextPossibleTarget = e.target;
    nextPossibleTarget.style.border = 'solid 2px red';
    var payload = {
      id: nextPossibleTarget.id || undefined,
      class: nextPossibleTarget.className || undefined,
      name: nextPossibleTarget.name || undefined,
      tag: nextPossibleTarget.tagName || undefined,
      text: nextPossibleTarget.innerText || undefined,
      parent: {
        id: nextPossibleTarget.parentNode.id || undefined,
        class: nextPossibleTarget.parentNode.className || undefined,
        name: nextPossibleTarget.parentNode.name || undefined,
        tag: nextPossibleTarget.parentNode.tagName || undefined,
        text: nextPossibleTarget.parentNode.innerText || undefined
      }
    };
    var menu = document.getElementById(menuId)
    if (menu === null) {
      menu = createContextMenu();
      document.body.appendChild(menu);
    }
    menu.style.left = e.clientX + 'px';
    var scrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    menu.style.top = scrollTop + e.clientY + 'px';
    displayPayload(payload, menu);
  }, false);

  return api;
}
