import * as http from 'http';
import { listenerFactory } from './request-listener';

interface LivelyOptions {
	port: number;
	host: string;
	root: string;
}

export class Lively {
	
	options: LivelyOptions = {
		port: 3000,
		host: 'localhost',
		root: ''
	}
	server: http.Server;
	
	constructor(options?: Partial<LivelyOptions>) {
		if (options) {
			Object.assign(this.options, options);
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

}