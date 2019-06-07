(function () {
  var containerStyles = 'position:absolute;overflow-y:scroll;max-height:150px;max-width:350px;left:859px;top:69px;z-index:2147483647;padding:5px 0px;border-radius:3px;background:white;list-style-type:none;min-width:150px;text-align:left;color:black;border:1px solid dimgray;margin:0px;font-size:14px;';
  var menuId = '_l-menu';
  var menuItemClass = '_l-menu-item';
  var menuItemKeyClass = '_l-menu-item-key';
  var menuItemValueClass = '_l-menu-item-value';
  var menuItemHeaderClass = '_l-menu-item-header';
  var attributeName = '_l-selected';
  var internalClasses = [menuItemClass, menuItemKeyClass, menuItemValueClass, menuItemHeaderClass];

  window.LiveSelect = function (cb) {
    if (!(this instanceof LiveSelect)) {
      return new LiveSelect(cb);
    }

    var approvedTargets = [];
    var config = {
      highLightColor: 'cyan',
      mouseEvent: 'mousedown',
      mouseButton: 1,
      showContextMenu: true,
      throttling: 200
    };

    var current = {
      element: undefined,
      originalBorder: undefined
    };

    var styles = document.createElement('style');
    styles.innerText = "#_l-menu{" + containerStyles + "}._l-menu-item{padding-left:5px;padding-right:5px;}._l-menu-item-key{color:purple;}._l-menu-item-value{padding-left:5px;}*[_l-selected]{background:rgba(46, 204, 64, 0.4) !important;background-color:rgba(46, 204, 64, 0.4) !important;}";
    document.body.appendChild(styles);

    this.setTriggerEvent = function (eventName, buttonNumber) {
      config.mouseEvent = eventName;
      config.mouseButton = parseInt(button.buttonNumber, 10) || config.mouseButton;
    }

    this.setHighlightColor = function (color) {
      config.highLightColor = typeof color === 'string' ? color.toLowerCase() : color;
    }

    this.setThrottling = function (timeMs) {
      config.throttling = parseInt(time.ms, 10) || config.throttling;
    }

    this.getSelectedItems = function (asArray) {
      var nodelist = document.querySelectorAll('*[_l-selected]');
      return asArray === true
        ? Array.prototype.slice.call(nodelist)
        : nodelist;
    }

    this.showContextMenu = function (newVal) {
      config.showContextMenu = !!newVal;
      if (!config.showContextMenu) {
        var menu = document.getElementById(menuId);
        if (menu) {
          menu.parentNode.removeChild(menu);
        }
      }
    }

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    function throttle (func, wait, options) {
      var context, args, result;
      var timeout = null;
      var previous = 0;
      if (!options) options = {};
      var later = function() {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      };
      return function() {
        var now = Date.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
          previous = now;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };
    };

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

    document.addEventListener('mousemove', throttle(function (e) {
      e = e || window.event;
      var x = e.clientX;
      var y = e.clientY;

      var nextElement = document.elementFromPoint(x, y);

      if (nextElement && nextElement.id !== menuId && internalClasses.indexOf(nextElement.className) === -1) {
        if (!nextElement.isEqualNode(current.element)) {
          // restore the border
          if (current.element) {
            current.element.style.border = current.originalBorder;
          }
          current.element = nextElement;
          if (typeof config.highLightColor === 'string') {
            current.originalBorder = nextElement.style.border;
            nextElement.style.border = 'solid 2px ' + config.highLightColor;
          }
        } else if (current.element) {
          nextElement.style.border = 'solid 2px ' + config.highLightColor;
        }
      }
    }, config.throttling), false);

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
        if (config.showContextMenu) {
          var payload = {
            id: e.target.id || undefined,
            class: e.target.className || undefined,
            name: e.target.name || undefined,
            tag: e.target.tagName || undefined,
            text: e.target.innerText || undefined
          };
          var menu = createContextMenu();
          document.body.appendChild(menu);
          if (window.innerWidth - menu.style.width < e.clientX) {
            menu.style.left = 15 + e.clientX + 'px';
          } else {
            menu.style.left = 15 + e.clientX - menu.style.width + 'px';
          }

          var scrollTop = window.scrollY || window.scrollTop || document.firstChild.scrollTop || 0;
          if (window.innerHeight - menu.style.height < e.clientY) {
            menu.style.top = 15 + scrollTop + e.clientY + 'px';
          } else {
            menu.style.top = 15 + scrollTop + e.clientY - menu.style.height + 'px';
          }
          displayPayload(payload, menu);
        }
      }
      if (typeof cb === 'function') {
        cb(api.getSelectedItems());
      }
    }, false);
  }
})();
