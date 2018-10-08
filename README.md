## Live Dom Select

This small library provides the ability to select the items live on page.

Tested in modern browsers as well as IE 9.

You can check a very simple demo [here](https://spring3.github.io/live-dom-select/)

### How to use it

1) Include the script from the `dist` folder to your website / app
2) Initialize it as
```js
var onSelectionChange (selectedHTMLElementsArray) {
  // logic
}
var liveSelect = LiveSelect(onSelectionChange);
```

### Configuration
Below is the default configuration
```js
var config = {
  highLightColor: 'cyan',
  mouseEvent: 'mousedown',
  mouseButton: 1,
  menuOffsetX: 15,
  menuOffsetY: 15,
  showContextMenu: true
};
```

you can overwrite it by using one of the available functions:
```js
var liveSelect = LiveSelect(cb);

// set the event, which will trigger the selection. Should be one of the MouseEvents
// the 2nd argument is the number of a mouse button that must trigger the event
liveSelect.setTriggerEvent('mousedown', 1);

// set the border color of the hovered object
liveSelect.setHighlightColor('magenta');

// set the context menu position offset from pointer location on X axis
liveSelect.setMenuOffsetX(20);

// set the context menu position offset from pointer location on Y axis
liveSelect.setMenuOffsetY(20);

// enables or disables context menu with some information about the hovered object
liveSelect.showContextMenu(false);
```

If you don't pass the callback in the constructor, you can still get the selected items with the help of the following function:
```js
var liveSelect = LiveSelect();

// as a nodelist
var nodeList = liveSelect.getSelectedItems();

// or as an array
var array = liveSelect.getSelectedItems(true);
```
