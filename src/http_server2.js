

const http = require('http');
const fs = require('fs');





const server = http.createServer((request, response)=>{
    if(request.url !== '/'){
        response.end('');
        return;
    }

    fs.writeFile(__dirname+'/header01.json', JSON.stringify(request.headers), error=>{
        if(error){
            return console.log(error);
        } else {
            console.log('write ok');
        }

    });

    fs.readFile(__dirname+'/data01.html', (error, data)=>{
        if(!error){
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.end(data);
        }
    });

});


server.listen(3000);