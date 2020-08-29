import * as http from 'http';
import * as fs from 'fs';
import { injection } from './live-reload/injection';
import { address } from './utils/address';
import { Protocols } from './types/protocol.enum';
import { getType } from 'mime';

const readDir = (path: fs.PathLike): string[] => {
	return fs.readdirSync(path).reduce((acc, cur) => {
		const isDir = fs.statSync(`${path}/${cur}`).isDirectory();
		if (isDir) {
			const sub = readDir(`${path}/${cur}`).map(f => `${cur}/${f}`);
			acc.push(...sub);
		} else {
			acc.push(cur);
		}
		return acc;
	}, [] as string[]);
}

export const listenerFactory = (dir: fs.PathLike, host: string, port: number): http.RequestListener => {

	const dirs: string[] = readDir(dir);
	const payload = injection(address(Protocols.ws, host, port));

	function injectPayload(data: string): string {
		const selector = '<head>';
		const html = data.split(selector);
		return html[0]
			+ selector
			+ '\n<script>\n'
			+ payload
			+ '</script>\n'
			+ html[1];
	}

	return function(req, res) {
		const url = req.url ?? '';
	
		let contentType: string | null;
		let path: fs.PathLike;
	
		if (url === '/') {
			path = `${dir}/index.html`;
			contentType = getType(path) ?? '';
		} else {
			const noSlash = url.substr(1);
			const file = noSlash.split('.').length > 1
				? dirs.find(f => f === noSlash)
				: dirs.find(f => f.split('.')[0] === noSlash);
	
			if (file) {
				path = `${dir}/${file}`;
				contentType = getType(path);
					
				if (!contentType) {
					const message = `File Type Incompatible`
					console.error(message);
					res.writeHead(500);
					res.end(message);
					return;
				}
			} else {
				const message = `File not found: ${noSlash}`;
				console.error(message);
				res.writeHead(404);
				res.end(message);
				return;
			}
		}

		const data = fs.readFileSync(path, 'utf-8');
		res.setHeader('Content-Type', contentType);
		res.writeHead(200);
		res.end(contentType === 'text/html' ? injectPayload(data) : data);
	}
}