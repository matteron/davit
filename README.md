# Davit

"A small crane on board a ship, especially one of a pair for suspending or lowering a lifeboat."

**This project is extremely work in progress.**

Davit is a live-reload, development server made because the tool I used previously, Browser-Sync, doesn't seem to be maintained much and also does a lot more than I need.  I also wasn't able to find anything else that also supported cleanly running some code before reloading the page.

Davit aims to as lightweight as possible.  There's only two dependencies, [ws](https://www.npmjs.com/package/ws), which might be replaced with my own code as it's also doing way more than I need it for, and [mime](https://www.npmjs.com/package/mime), just used as a prepackaged way to determine mime-types.

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

## CLI Usage

To run Davit on the command line, simply run `davit` followed by the directory you wish to serve up.  You can optionally specify options from the list below.

## Options

`port`: number - Port to bind server.  Defaults to 3000.

`host`: string - The hostname to bind the server.  Default to localhost.

`root`: string - Path to serve files from.

`source`: string - Let's you watch files from a different folder.

`glyph`: string - Prints next to the server address on startup :)  Defaults to ♨.

`verbose`: boolean - Prints out every time a watch event fires.  Defaults to false.

> To specify these options in the CLI, simply either type `--option` where option is the name of the option or `-o` where o is the first letter of the option, followed by the value you'd like to pass.  Boolean values don't take parameters, instead are flipped upon call.

## Running Code before Reload
If you'd like to perform some actions before the watch service reloads the site, you can do so like this.

```JavaScript
dv.watch('media/*.css', (fileName, fullPath) => {
	codeHere();
});
```

## Disclaimer
In order to make live reloading work, davit inserts a script into the head tag of every html file it serves.  The script will open up a web socket and connect back to davit so the browser can receive commands for the live reload.  The full source code of this script can be found in [`src/live-reload/injection.js`](https://github.com/matteron/davit/blob/master/src/live-reload/injection.js).  Specifically in the function called `payload`.