import * as http from 'http';
import { requestListener } from './request-listener';

interface LivelyOptions {
	port: number;
	host: string;
}

export class Lively {
	
	options: LivelyOptions = {
		port: 3000,
		host: 'localhost'
	}
	server = http.createServer(requestListener);
	
	constructor(options?: Partial<LivelyOptions>) {
		if (options) {
			Object.assign(this.options, options);
		}
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