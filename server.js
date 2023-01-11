const http = require('http'); //import http from 'http' (ES6)
const path = require('path');
const fs = require('fs');
// const express = require('express');
// const app = express();

const server = http.createServer();

server.on('request', (req, res) => {
 
    if(req.url === '/'){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html')
        res.write('<html>')
        res.write('<head><title>My Home Page</title></head>')
        res.write('<body><h1>Hello Node!<br> <a href="http://localhost:8000/write-message">Write MSG</a><br><a href="http://localhost:8000/read-message">Read MSG</a></body>')
        res.write('</html>')
        res.end(); 
    }

 
    if(req.url === '/write-message' && req.method === 'GET'){
        res.write(`
            <html>
                <head>
                    <title>Send a message</title>
                </head>
                <body>
                    <form action="/write-message" method="POST">
                        <input type="text" name="message" placeholder="Enter your message">
                        <button type="submit">Submit</button>
                    </form>
                </body>
            </html>
        `)
    }


    if(req.url === '/write-message' && req.method === 'POST'){
        // console.log(req.body);

        const body = [];

        req.on('data', (chunk) => {
            // console.log(chunk);
            body.push(chunk);
        })

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            // console.log(parsedBody);

            const message = parsedBody.split('=')[1];

            fs.writeFile('message.html',
            `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>MSG</title>
            </head>
            <body>
                <h1>${message}</h1>
                <br>
                <a href="http://localhost:8000">Home</a>            
            </body>
            </html>`
        , (err) => {
                if(err) throw err;
                res.statusCode = 302;
                res.setHeader('Location', '/');
               return res.end();
            })

            
        })
    }

    if(req.url === '/read-message'){
        fs.readFile("message.html", function (error, pgResp) {
            if (error) {
                res.writeHead(404);
                res.write('Contents you are looking are Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(pgResp);
            }
             
            res.end();

        })
    };
});

server.on('listening', () => {
    console.log('Listening on port 8000');
})

server.listen(8000);