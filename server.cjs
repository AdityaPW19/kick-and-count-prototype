const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const downloadAssets = require('./download-assets.cjs');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg', '.svg': 'image/svg+xml', '.css': 'text/css' };

async function start() {
    await downloadAssets();
    const server = http.createServer((request, response) => {
        let pathname;
        try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
        catch { response.writeHead(400).end('Bad request'); return; }
        const file = path.resolve(__dirname, `.${pathname}${pathname.endsWith('/') ? 'index.html' : ''}`);
        if (!file.startsWith(__dirname + path.sep)) { response.writeHead(403).end('Forbidden'); return; }
        fs.readFile(file, (error, data) => {
            if (error) { response.writeHead(404).end('Not found'); return; }
            response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
            response.end(data);
        });
    });
    server.on('error', error => { console.error(`Server failed: ${error.message}`); process.exitCode = 1; });
    server.listen(Number(process.env.PORT || 4174), '127.0.0.1', () => {
        console.log(`Count & Kick: http://127.0.0.1:${server.address().port}/`);
        console.log('Press Ctrl+C to stop. Add #edit to the URL for local game settings.');
    });
}
start().catch(error => { console.error(error.message); process.exitCode = 1; });