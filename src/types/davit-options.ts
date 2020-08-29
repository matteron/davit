export interface DavitOptions {
	port: number;
	host: string;
	root: string;
	source: string;
	glyph: string;
	verbose: boolean;
	buffer: number;
}

export const Defaults: DavitOptions = {
	port: 3000,
	host: 'localhost',
	root: '',
	source: '',
	glyph: '♨',
	verbose: false,
	buffer: 200
}