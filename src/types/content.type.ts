import { FileType } from "./file.type";

export type ContentType = 'text/html' | 'text/css' | 'text/javascript';

type ContentTypeMap = {
	[key in FileType]: ContentType;
};

export const contentTypeMap: ContentTypeMap = {
	'html': 'text/html',
	'css': 'text/css',
	'js': 'text/javascript'
}