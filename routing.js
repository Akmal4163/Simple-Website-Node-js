const http = require('http');
const url = require('url');
const Router = require('routes');
const router = new Router();
const view = require('swig');
const mysql = require('mysql');
const dbconnect = mysql.createConnection({
    host: "localhost",
    port: 3306,
    database: "nodejs",
    user: "admin",
    password: "admin123"
});
//menambahkan router baru
router.addRoute('/', (req, res) => {
    let homepage = view.compileFile('./templates/index.html')({
        title: "Homepage"
    });
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(homepage);
    console.log("access: homepage");
});
router.addRoute('/about', (req, res) => {
    let about = view.compileFile('./templates/about.html')({
        title: "About Page"
    });
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(about);
    console.log("access: about page");
});
router.addRoute('/contact', (req, res) => {
    let contact = view.compileFile('./templates/contact.html')({
        title: "Contact Page"
    });
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(contact);
    console.log("access: contact page");
});

router.addRoute('/profile', (req, res) => {
    dbconnect.query('select * from profile', (err, rows, field) => {
        if (err) throw err;
        res.writeHead(200, { "Content-type": "text/plain" });
        res.end(JSON.stringify(rows));
    });
});

router.addRoute('/insert', (req, res) => {
    dbconnect.query('insert into profile set ?', {
        id: "",
        Name: 'Mahrus',
        Address: 'Lethbridge, Alberta canada',
        Telp: "+82001344567",
        Email: "mahrus@gmail.com"
    }, function(err, field) {
        if (err) throw err;
        res.writeHead(200, { "Content-type": "text/plain" });
        res.end(`Added ${field.affectedRows} Affected Rows`);
    });
});

router.addRoute('/update', (req, res) => {
    dbconnect.query('update profile set ? where ?', [
        { id: '' },
        { Name: 'Aat' },
        { Address: 'Aspen Grove, British Columbia Canada' },
        { Telp: '+63001507363' },
        {
            Email: 'Aat18agustus@gmail.com'
        }
    ], function(err, field) {
        if (err) throw err;
        res.writeHead(200, { "Content-type": "text/plain" });
        console.log(`${field.changedRows} Updated`);
        res.end(`${field.changedRows} Updated`);
    });
});

router.addRoute('/delete', (req, res) => {
    res.writeHead(200, { "Content-type": "text/plain" });
    res.end();
});

const server = http.createServer((req, res) => {
    let path = url.parse(req.url).pathname;
    let match = router.match(path);
    if (match) {
        match.fn(req, res, match);
    } else {
        res.statusCode = 404;
        let unknownPage = view.compileFile('./templates/404.html')({
            title: "Error Page"
        });
        res.writeHead(200, { "Content-type": "text/html" });
        res.end(unknownPage);
    }
});
server.listen(5000);
console.log('server running');