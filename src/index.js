const express = require('express');
const exphbs = require('express-handlebars');
const url = require('url');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs=require('fs');
const uuidv4 = require('uuid/v4');
const session= require('express-session');
const moment =require('moment-timezone');
const mysql = require('mysql');

const db = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'proj54'
});
db.connect();

//const bodyParserUrlencoded = bodyParser.urlencoded({extended: false});

const app = express();
app.use(express.static('public'));




// 查看 HTTP HEADER 的 Content-Type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// 查看 HTTP HEADER 的 Content-Type: application/json
app.use(bodyParser.json());

var whitelist = ['http://localhost:8080', 'http://192.168.27.27:8080',undefined] //設定白名單給8080 
var corsOptions = {
    credentials: true, // session 的預設值
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};

// app.use(cors());

app.use(cors(corsOptions));


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

const params1 = require(__dirname + '/params-test/params');
params1(app);

// app.get('/my-params1/:action/:id', (req, res)=>{    
//     res.json(req.params);
// });
// app.get('/my-params2/:action?/:id?', (req, res)=>{    
//     res.json(req.params);

// });
     
// app.get('/my-params3/*/*?', (req, res)=>{
//     res.json(req.params);
// });

const mr = require(__dirname + '/mobile_router');  //localhost:3000/09xx-xxx-xxx
app.use(mr);


const mr3 = require(__dirname + '/mobile_router3'); //一樣但用法不同 localhost:3000/mobile/09xx-xxx-xxx
app.use('/mobile', mr3);
    
// app.get(/^\/09\d{2}\-?\d{3}\-?\d{3}/, (req, res)=>{    
//     let str = req.url.slice(1);    
//     str = str.split('-').join('');    
//     res.send('手機: ' + str);}
// );


const admin3 = require(__dirname + '/admin3');
app.use('/admin3', admin3);

app.use(session({    
    saveUninitialized: false, 
    // 新 session 未變更內容是否儲存    
    resave: false, 
    // 沒變更內容是否強制回存    
    secret: 'pass',    
    cookie: {        
        maxAge: 50000, 
        // 1分鐘，單位毫秒 進入網頁後幾秒登出    
}})
);

app.get('/try-session', (req, res)=>{    
    req.session.views = req.session.views || 0; 
    // 預設為 0    
    req.session.views++;
        
    res.json({
        views: req.session.views
    })
    res.contentType('text/plain');    
    res.write('拜訪次數:' + req.session.views + "\n");    
    res.end(JSON.stringify(req.session));
});


app.post('/try-session', (req, res)=>{
    req.session.views = req.session.views || 0;
    req.session.views ++;

    res.json({
        views: req.session.views,
        body: req.body
    })
});

app.get('/try-moment', (req, res)=>{
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const exp = req.session.cookie.expires;
    const mo1 = moment(exp);
    const mo2 = moment();

    let out = '';

    res.contentType('text/plain');

    out += mo1.format(fm) + "\n";
    out += mo2.format(fm) + "\n";
    out += mo1.tz('Europe/London').format(fm) + "\n";
    out += mo2.tz('Europe/London').format(fm) + "\n";
   res.send(out);
 });

 app.get('/try-db', (req, res)=>{
    let sql = "SELECT * FROM `sales`";
    db.query(sql, (error, results, fields)=>{
        //console.log(results);

        for(let s in results){
            results[s].birthday2 = moment(results[s].birthday).format('YYYY-MM-DD');
        }
        res.render('try-db', {
            sales: results
        });
    });
});

app.use((req, res)=>{
    res.type('text/html');
    res.status(404);
    res.send('找不到頁面');
});


app.listen(3000, ()=>{
    console.log('server running');
});







