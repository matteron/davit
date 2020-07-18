import * as http from 'http';
import * as fs from 'fs';
import { requestListener } from './request-listener';

const port = 3000;
const host = 'localhost';

const server = http.createServer(requestListener);
server.listen(port, host, () => {
	console.log(`Server is running on http://${host}:${port}`);
})