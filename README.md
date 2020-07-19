# Davit

"A small crane on board a ship, especially one of a pair for suspending or lowering a lifeboat."

**This project is extremely work in progress.**

Davit is a live-reload, development server made because the tool I used previously, Browser-Sync, doesn't seem to be maintained much and also does a lot more than I need.  I wasn't able to find anything else that also supported cleanly running some code before reloading the page.

Browser-sync also has a very long install time with a ton of dependencies.

Davit aims to as lightweight as possible.  There's only one dependency, [ws](https://www.npmjs.com/package/ws), which might be replaced with my own code as it's also doing way more than I need it for.

## Basic Usage

The following code will start a davit server that watches for changes to the style sheet.

```JavaScript
const { Davit } = require('davit');

const dv = new Davit({
	root: 'src'
});

dv.watch('media/style.css');

dv.start();
```

## Options

`port`: number - Port to bind server.  Defaults to 3000.

`host`: string - The hostname to bind the server.  Default to localhost.

`root`: string - Path to serve files from.

`source`: string - Let's you watch files from a different folder.

`symbol`: string - Prints next to the server address on startup :)  Defaults to ♨.

`verbose`: boolean - Prints out every time a watch event fires.  Defaults to false.

## Disclaimer
In order to make this work, davit will insert a script into the head tag of every html file it serves.  The script will open up a web socket and connect back to davit so the browser can receive commands for the live reload.