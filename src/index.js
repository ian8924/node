const express = require('express');
const exphbs = require('express-handlebars');
const url = require('url');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs=require('fs');
const uuidv4 = require('uuid/v4');

//const bodyParserUrlencoded = bodyParser.urlencoded({extended: false});

const app = express();
app.use(express.static('public'));




// 查看 HTTP HEADER 的 Content-Type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// 查看 HTTP HEADER 的 Content-Type: application/json
app.use(bodyParser.json());

app.use(cors());

const upload=multer({dest:'tmp_uploads/'});

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        list: require('./../helpers/list')
    }
}));

app.set('view engine', 'hbs');

// routes
app.get('/', (req, res)=>{
    const sales = require('./../data/sales.json');
    res.render('home', {
        // layout: false,
        name: sales[0].name,
    });
});

app.get('/sales', (req, res)=>{
    const sales = require('./../data/sales.json');
    res.render('sales', {
        sales: sales
    });
});

app.get('/sales2', (req, res)=>{
    const sales = require('./../data/sales.json');
    res.render('sales2', {
        sales: sales
    });
});

app.get('/try-qs', (req, res)=>{
    console.log(req.url);
    const urlParts = url.parse(req.url, true);
    console.log(urlParts);
    res.render('try_qs', {
        urlParts: urlParts
    })
});

app.post('/post-echo', (req, res)=>{
    //res.send( JSON.stringify(req.body));
    res.json(req.body);
});

app.post('/post-echo2', (req, res)=>{
    res.send(req.body.name);
});


app.get('/abc.html', (req, res)=>{
    res.send('ABC');
});

app.get('/try-upload', (req, res)=>{
    res.render('try-upload');
});

app.post('/try-upload', upload.single('avatar'), (req, res)=>{
    console.log(req.file);

    let ext = '';
    let fname = uuidv4();

    if(req.file && req.file.originalname){
        switch(req.file.mimetype){          //判斷是哪種類型的檔案
            case 'image/png':
                ext = '.png';
            case 'image/jpeg':
                if(!ext){
                    ext = '.jpg';
                }

                fs.createReadStream(req.file.path)
                    .pipe(fs.createWriteStream(__dirname + '/../public/img/' + fname + ext));

                res.json({
                    success: true,
                    file: '/img/' + fname + ext,
                    name: req.body.name
                });
                return;
        }
    }
    res.json({
        success: false,
        file: '',
        name: req.body.name
    });

});
app.get('/upload-form1', (req, res)=>{
    res.render('upload-form1');
});

app.post('/upload-single', upload.single('filefield'), (req, res)=>{
    let ext = '';
    let fname = uuidv4();
    const result = {
        success: false,
        info: '',
        file: ''
    };

    if(req.file && req.file.originalname){
        switch(req.file.mimetype){
            case 'image/png':
                ext = '.png';
            case 'image/jpeg':
                if(!ext){
                    ext = '.jpg';
                }

                fs.createReadStream(req.file.path)
                    .pipe(fs.createWriteStream(__dirname + '/../public/img/' + fname + ext));

                res.json({
                    success: true,
                    file: '/img/' + fname + ext,
                });
                return;
            default:
                result.info = '檔案格式不符';
        }
    } else {
        result.info = '沒有選擇檔案';
    }
    res.json(result);
});


app.use((req, res)=>{
    res.type('text/html');
    res.status(404);
    res.send('找不到頁面');
});


app.listen(3000, ()=>{
    console.log('server running');
});







