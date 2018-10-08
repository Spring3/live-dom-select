var containerStyles = 'position:absolute;left:859px;top:69px;z-index:2147483647;padding:5px 0px;border-radius:3px;background:white;list-style-type:none;min-width:150px;text-align:left;color:black;border:1px solid dimgray;margin:0px;font-size:14px;';
var menuId = '_l-menu';
var menuItemClass = '_l-menu-item';
var menuItemKeyClass = '_l-menu-item-key';
var menuItemValueClass = '_l-menu-item-value';
var menuItemHeaderClass = '_l-menu-item-header';
var attributeName = '_l-selected';
var internalClasses = [menuItemClass, menuItemKeyClass, menuItemValueClass, menuItemHeaderClass];

window.LiveSelect = function (cb) {
  var hoverTarget;
  var approvedTargets = [];
  var config = {
    highLightColor: 'cyan',
    mouseEvent: 'mousedown',
    mouseButton: 1,
    menuOffsetX: 15,
    menuOffsetY: 15,
    showContextMenu: true
  };

  var styles = document.createElement('style');
  styles.innerText = "#_l-menu{" + containerStyles + "}._l-menu-item{padding-left:5px;padding-right:5px;}._l-menu-item-key{color:purple;}._l-menu-item-value{padding-left:5px;}*[_l-selected]{background:rgba(46, 204, 64, 0.4) !important;background-color:rgba(46, 204, 64, 0.4) !important;}";
  document.body.appendChild(styles);

  var api = {};

  api.setTriggerEvent = function (eventName, buttonNumber) {
    config.mouseEvent = eventName;
    config.mouseButton = parseInt(button.buttonNumber, 10);
  }

  api.setHighlightColor = function (color) {
    config.highLightColor = (color || '').toLowerCase() || 'cyan';
  }

  api.setMenuOffsetX = function (px) {
    config.menuOffsetX = parseInt(px, 10) || 15;
  }

  api.setMenuOffsetY = function (px) {
    config.menuOffsetY = parseInt(px, 10) || 15;
  }

  api.getSelectedItems = function () {
    return document.querySelectorAll('*[_l-selected]');
  }

  api.showContextMenu = function (newVal) {
    config.showContextMenu = !!newVal;
  }

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
            var section = document.createElement('strong');
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

  document.addEventListener('mousemove', function (e) {
    e = e || window.event;
    var x = e.clientX;
    var y = e.clientY;

    var nextElement = document.elementFromPoint(x, y);
    if (nextElement && nextElement.id !== menuId && internalClasses.indexOf(nextElement.className) === -1) {
      if (hoverTarget) {
        hoverTarget.style.border = '';
      }
      nextElement.style.border = 'solid 2px ' + config.highLightColor;
      hoverTarget = nextElement;
      if (config.showContextMenu) {
        var payload = {
          id: hoverTarget.id || undefined,
          class: hoverTarget.className || undefined,
          name: hoverTarget.name || undefined,
          tag: hoverTarget.tagName || undefined,
          text: hoverTarget.innerText || undefined,
          parent: {
            id: hoverTarget.parentNode.id || undefined,
            class: hoverTarget.parentNode.className || undefined,
            name: hoverTarget.parentNode.name || undefined,
            tag: hoverTarget.parentNode.tagName || undefined,
            text: hoverTarget.parentNode.innerText || undefined
          }
        };
        var menu = document.getElementById(menuId)
        if (menu === null) {
          menu = createContextMenu();
          document.body.appendChild(menu);
        }
        menu.style.left = config.menuOffsetX + e.clientX + 'px';
        var scrollTop = window.scrollY || window.scrollTop || document.firstChild.scrollTop;
        menu.style.top = config.menuOffsetY + scrollTop + e.clientY + 'px';
        displayPayload(payload, menu);
      }
    }
  }, false);

  window.addEventListener(config.mouseEvent, function (e) {
    e = e || window.event;
    if (e.which !== config.mouseButton
      || (e.target && (e.target.id === menuId || internalClasses.indexOf(e.target.className) !== -1))) {
      return;
    }

    var clickHandlerStub = function (e) {
      e.preventDefault();
      e.stopPropagation();
      setTimeout(function () { e.target.removeEventListener('click', clickHandlerStub); }, 200);
    };
    // prevent page redirect on click
    e.target.addEventListener('click', clickHandlerStub, false);
    e.preventDefault();
    if (e.target.hasAttribute(attributeName)) {
      e.target.removeAttribute(attributeName);
    } else {
      e.target.setAttribute(attributeName, true);
    }
    if (typeof cb === 'function') {
      cb(api.getSelectedItems());
    }
  }, false);

  return api;
}
