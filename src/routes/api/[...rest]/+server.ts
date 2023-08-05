import fs from 'node:fs/promises';
import path from 'path';

export const GET = async ({ url }) => {
	const pathname = `${url.pathname.replace('/api', '')}.json`;
	const srcPath = path.resolve(process.cwd(), `public/${pathname}`);
	return fs.readFile(srcPath, 'utf-8').then((fileContents) => new Response(fileContents));
};
