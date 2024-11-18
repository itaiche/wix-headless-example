import { createServer } from 'http';
import { readFileSync } from 'fs';
import { spawn } from 'node:child_process';

const PORT = 3000;

const server = createServer((req, res) => {
    try {
        const fileName = req.url.split('?')[0].split('/').pop();
        const result = loadFile(fileName);
        if(result !== null){
            const { type, resultFile } = result;
            const headers = {
                'content-length': resultFile.length,
                'cache-control': 'no-cache'
            };
            if(type === 'js'){
                headers['content-type'] = 'text/javascript; charset=utf-8';
            } 
            if(type == 'html') {
                headers['content-type'] = 'text/html; charset=utf-8';
            } 
            if(type === 'css') {
                headers['content-type'] = 'text/css; charset=utf-8';
            } 
            res.writeHead(200, headers);
            res.end(resultFile);
        } else {
            res.writeHead(404);
            res.end(`File not found ${fileName}`);
        }
    } catch(e) {
        console.error(`File request exploded`);
        console.error(e);
        res.writeHead(500);
        res.end(`Error by request ${req.url}`);
    } 
});

const serverURL = `http://localhost:${PORT}`;
server.listen(PORT);
spawn('open', [`${serverURL}/index.html`]);
console.log(`Server now running on ${serverURL}`);

const JS_FILE_PATH =  './src/js/';
const CSS_FILE_PATH =  './src/css/';
const HTML_FILE_PATH =  './src/';

function loadFile(fileName){
    const suffix = fileName.split('.').pop();

    let resultFile;
    let type;

    if(suffix === 'js') {
       const filePath = `${JS_FILE_PATH}${fileName}`;
       resultFile = readFileSync(filePath, { encoding:'utf-8' });
       type = 'js';
    } 
    if(suffix === 'html') {
       const filePath = `${HTML_FILE_PATH}${fileName}`;
       resultFile = readFileSync(filePath, { encoding:'utf-8' });
       type = 'html';
    }
    if(suffix === 'css') {
        const filePath = `${CSS_FILE_PATH}${fileName}`;
        resultFile = readFileSync(filePath, { encoding:'utf-8' });
        type = 'css';
    } 

    if(resultFile) {
        return { 
            type,
            resultFile
        };
    } else {
        return null;
    }
}
