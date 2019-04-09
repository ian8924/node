
const express = require('express');

const app = express();

// routes
app.get('/', (req, res)=>{
    res.send('Hello Express');
});

app.get('/abc', (req, res)=>{
    res.send('ABC');
});

app.use((req, res)=>{
    res.type('text/html');
    res.status(404);
    res.send('找不到頁面');
});


app.listen(3000, ()=>{
    console.log('server running');
});







