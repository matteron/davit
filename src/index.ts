import * as http from 'http';
import { listenerFactory } from './request-listener';
import * as fs from 'fs';
import { FileEvent } from './types/file-event-type';

interface LivelyOptions {
	port: number;
	host: string;
	root: string;
	source: string;
}

export class Lively {
	
	options: LivelyOptions = {
		port: 3000,
		host: 'localhost',
		root: '',
		source: ''
	}
	server: http.Server;
	
	constructor(options?: Partial<LivelyOptions>) {

		if (options) {
			Object.assign(this.options, options);
			if (options.source === undefined) {
				this.options.source = this.options.root;
			}
		}
		
		const requestListener = listenerFactory(this.options.root);
		this.server = http.createServer(requestListener);
	}

	private printAddress(): string {
		return `http://${this.options.host}:${this.options.port}`
	}

	start(): void {
		this.server.listen(this.options.port, this.options.host, () => {
			console.log(`Server is running on ${this.printAddress()}`);
		});
	}

	watch(location: fs.PathLike, callback: (event: FileEvent, filename: string, path: fs.PathLike) => void): void {
		fs.watch(`${this.options.source}/${location}`, (event, filename) => {
			callback(event as FileEvent, filename, `${this.options.source}/${filename}`);
		});
	}
}