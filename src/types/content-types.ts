import { FileType } from "./file-types";

export type ContentTypes = 'text/html' | 'text/css' | 'text/javascript';

type ContentTypesMap = {
	[key in FileType]: ContentTypes;
};

export const contentTypeMap: ContentTypesMap = {
	'html': 'text/html',
	'css': 'text/css',
	'js': 'text/javascript'
}