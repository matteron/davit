#!/usr/bin/env node

import { DavitOptions, Defaults } from "./types/davit-options";
import { Davit } from ".";

interface CliDictionary {
	[key: string]: keyof DavitOptions;
}

const [, , ...args] = process.argv;

const options: DavitOptions = Defaults;

function changeOption<K extends keyof DavitOptions, V extends DavitOptions[K]>(
	argIndex: number,
	key: K
): boolean {
	const value = args[++argIndex] as V;
	switch (typeof options[key]) {
		case 'string': 
			options[key] = value;
			return true;
		case 'number':
			options[key] = +value as V;
			return true;
		case 'boolean':
			options[key] = true as V;
			return false;
	}
}

const argDictionary: CliDictionary = Object.keys(options).reduce(
	(acc, cur) => {
		acc['--' + cur] = acc['-' + cur[0]] = cur as keyof DavitOptions;
		return acc;
	},
	{} as CliDictionary
);

let skipNext = false;
args.forEach((n, i) => {
	if (skipNext) {
		skipNext = false;
		return;
	}
	if (argDictionary[n] === undefined) {
		if (i === 0) {
			options.root = n;
		} else {
			console.error(`Invalid argument: ${n}.`);
			return;
		}
	}
	skipNext = changeOption(i, argDictionary[n]);
});

const davit = new Davit(options);
davit.start();