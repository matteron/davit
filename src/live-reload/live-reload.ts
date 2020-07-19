import * as http from 'http';
import * as WebSocket from 'ws';
import { address } from '../utils/address';
import { Protocols } from '../types/protocol.enum';
import { AddressInfo } from 'net';
import { PathLike } from 'fs';
import { WSEvents } from '../types/ws-events.enum';

export class LiveReload {

	address: string;
	wss: WebSocket.Server;

	get ws(): WebSocket {
		return this.wss?.clients?.values()?.next()?.value
			?? new WebSocket(this.address);
	}

	constructor(
		private server: http.Server,
		private host: PathLike,
		private port: number
	) {
		this.wss = new WebSocket.Server({ server: this.server });
		this.address = address(Protocols.ws, this.host, this.port);
	}

	send(event: WSEvents): void {
		this.ws.send(event);
	}

	reload(): void {
		this.send(WSEvents.reload);
	}
}