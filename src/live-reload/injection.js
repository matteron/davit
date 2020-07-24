const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const { WSEvents } = require('../types/ws-events.enum');


// A Parameterized Quine for fun.
exports.injection = (address) => {

	const injectionSelector = 'INJECTION';
	const selectors = {
		'address': address,
		'connection': address,
		// Command Mapper
		'reload': WSEvents.reload
	}

	function insert(selector, source, content) {
		const split = source.split('{{' + selector + '}}');
		return split[0] + content + split[1];
	};

	let raw = fs.readFileSync(path.resolve(__dirname, './injection.js'), 'utf-8');
	Object.keys(selectors).forEach(key => {
		raw = insert(key, raw, selectors[key]);
	});
	return raw.split(`// ${injectionSelector}`)[1];

	function payload() {
		// INJECTION
		const ws = new WebSocket('{{address}}');
		const reload = () => location.reload();
		const commandMap = {
			'{{reload}}': reload
		}
		ws.onopen = function() {
			console.log('✦ {{connection}}');
		}
		ws.onmessage = function(msg) {
			commandMap[msg.data]();
		}
		// INJECTION
	}
}
