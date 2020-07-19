import * as http from 'http';
import * as fs from 'fs';
import { contentTypeMap, ContentType } from './types/content.type';
import { FileType } from './types/file.type';
import { injection } from './live-reload/injection';
import { address } from './utils/address';
import { Protocols } from './types/protocol.enum';

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

	function injectPayload(data: Buffer): string {
		const selector = '<head>';
		const html = data.toString('utf-8').split(selector);
		return html[0]
			+ selector
			+ '<script>\n'
			+ payload
			+ '</script>\n'
			+ html[1];
	}

	return function(req, res) {
		const url = req.url ?? '';
	
		let contentType: ContentType;
		let path: fs.PathLike;
	
		if (url === '/') {
			contentType = 'text/html';
			path = 'test/index.html'
		} else {
			const noSlash = url.substr(1);
			
			const file = noSlash.split('.').length > 1
				? dirs.find(f => f === noSlash)
				: dirs.find(f => f.split('.')[0] === noSlash);
	
			if (file) {
				const ext = file.split('.')[1] as FileType;
					
				if (ext) {
					contentType = contentTypeMap[ext];
					path = 'test/' + file;
				} else {
					console.error(`File Type Incompatible`);
					return;
				}
			} else {
				console.error(`File not found: ${noSlash}`);
				return;
			}
		}
	
		fs.readFile(path, {}, (err, data) => {
			res.setHeader('Content-Type', contentType);
			res.writeHead(200);
			if (contentType === 'text/html') {
				res.end(injectPayload(data));
			} else {
				res.end(data);
			}
		});
	}
}