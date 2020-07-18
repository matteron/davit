import * as http from 'http';
import * as fs from 'fs';
import { contentTypeMapper, ContentTypes } from './types/content-types';
import { FileType } from './types/file-types';

const test = 'test';

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

const dir: string[] = readDir(test);

export const requestListener: http.RequestListener = function(req, res) {
	const url = req.url ?? '';

	let contentType: ContentTypes;
	let path: fs.PathLike;

	if (url === '/') {
		contentType = 'text/html';
		path = 'test/index.html'
	} else {
		const noSlash = url.substr(1);
		const file = noSlash.split('.').length > 1
			? dir.find(f => f === noSlash)
			: dir.find(f => f.split('.')[0] === noSlash);

		if (file) {
			const ext = file.split('.')[1] as FileType;
				
			if (ext) {
				contentType = contentTypeMapper[ext];
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
		res.end(data);
	});
}
