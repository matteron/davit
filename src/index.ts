import * as http from 'http';
import { listenerFactory } from './request-listener';
import * as fs from 'fs';
import * as path from 'path';
import { LiveReload } from './live-reload/live-reload';
import { Protocols } from './types/protocol.enum';
import { address } from './utils/address';
import { open } from './utils/open';

interface DavitOptions {
	port: number;
	host: string;
	root: string;
	source: string;
	symbol: string;
	verbose: boolean;
	buffer: number;
}

type WatchCallback = (filename: string, path: fs.PathLike) => void;
interface BufferEntry {
	callback?: WatchCallback;
	filename: string;
}

export class Davit {
	
	options: DavitOptions = {
		port: 3000,
		host: 'localhost',
		root: '',
		source: '',
		symbol: '♨',
		verbose: false,
		buffer: 200
	}
	address: string;
	server: http.Server;
	liveReload: LiveReload;
	callBuffer: { [key: string]: BufferEntry } = {};
	tid: NodeJS.Timeout = setTimeout(() => {}, 0);
	
	constructor(options?: Partial<DavitOptions>) {

		if (options) {
			Object.assign(this.options, options);
			if (options.source === undefined) {
				this.options.source = this.options.root;
			}
		}
		
		const requestListener = listenerFactory(this.options.root, this.options.host, this.options.port);
		this.server = http.createServer(requestListener);
		this.liveReload = new LiveReload(this.server, this.options.host, this.options.port);
		this.address = address(Protocols.http, this.options.host, this.options.port);
	}

	start(): void {
		this.server.listen(this.options.port, this.options.host, () => {
			console.log(`${this.options.symbol} ${this.address}`);
			open(this.address);
		});
	}

	buffer(filename: string, path: fs.PathLike, callback?: WatchCallback): void {
		this.callBuffer[path.toString()] = {
			callback,
			filename
		};
		clearTimeout(this.tid);
		this.tid = setTimeout(() => {
			const keys = Object.keys(this.callBuffer);
			keys.forEach(key => {
				const entry = this.callBuffer[key];
				if (entry.callback) {
					entry.callback(entry.filename, key);
				}
			});
			this.callBuffer = {};
			if (this.options.verbose) {
				const bufferCount = keys.length > 1
					? ` (${keys.length} Events)` : '';
				console.log(`Reloading...${bufferCount}`);
			}
			this.liveReload.reload();
		}, this.options.buffer);
	}

	watch(location: fs.PathLike, callback?: WatchCallback): void {
		
		const createWatch = (loc: string): void => {
			fs.watch(`${this.options.source}/${loc}`, (_, filename) => {
				const fullPath = path.join(this.options.source, loc)
				if (this.options.verbose) {
					console.log(`☼ ${fullPath}`);
				}
				this.buffer(filename, fullPath, callback);
			});
		}
		
		const wildcards = location.toString().split('*');
		if (wildcards.length > 1) {
			fs.readdirSync(`${this.options.source}/${wildcards[0]}`)
				.filter(fn => fn.endsWith(wildcards[1]))
				.forEach(f => createWatch(`${wildcards[0]}${f}`));
		} else {
			createWatch(location.toString());
		}
	}
}