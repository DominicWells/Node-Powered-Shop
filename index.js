const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const catData = JSON.parse(json);

const server = http.createServer((req, res) => {
    
    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;
    
    // CATS OVERVIEW
    if (pathName === '/cats' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html'});
        
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;
            
            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
            
                const cardsOutput = catData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput); 
                
                res.end(overviewOutput);
            });
        });
        
        
    }
    
    // CAT DETAIL
    else if (pathName === '/cat' && id < catData.length) {
        res.writeHead(200, { 'Content-type': 'text/html'});
        
        fs.readFile(`${__dirname}/templates/cat-template.html`, 'utf-8', (err, data) => {
            const cat = catData[id];
            const output = replaceTemplate(data, cat);
            res.end(output);
        });
    }
    
    // IMAGES
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg'});
            res.end(data);
        });
    }
    
    // URL NOT FOUND
    else {
        res.writeHead(404, { 'Content-type': 'text/html'});
        res.end('URL was not found on the server!');
    }
    
});

server.listen(1337, '127.0.0.1', () => {
    console.log('Listening on 1337...');
});

function replaceTemplate(originalHtml, cat) {
    let output = originalHtml.replace(/{%CATNAME%}/g, cat.catName);
    output = output.replace(/{%IMAGE%}/g, cat.image);
    output = output.replace(/{%PRICE%}/g, cat.price);
    output = output.replace(/{%WEIGHT%}/g, cat.weight);
    output = output.replace(/{%CUTEFACTOR%}/g, cat.cuteFactor);
    output = output.replace(/{%LENGTH%}/g, cat.headAndBodyLength);
    output = output.replace(/{%DESCRIPTION%}/g, cat.description);
    output = output.replace(/{%ID%}/g, cat.id);
    return output;
}