const http = require('http');
const url = require('url');
const Router = require('routes');
const router = new Router();
const view = require('swig');

//menambahkan router baru
router.addRoute('/', (req, res) => {
    let homepage = view.compileFile('./templates/index.html')();
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(homepage);
    console.log("access: homepage");
});
router.addRoute('/about', (req, res) => {
    let about = view.compileFile('./templates/about.html')();
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(about);
    console.log("access: about page");
});
router.addRoute('/contact', (req, res) => {
    let contact = view.compileFile('./templates/contact.html')();
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(contact);
    console.log("access: contact page");
});

const server = http.createServer((req, res) => {
    let path = url.parse(req.url).pathname;
    let match = router.match(path);
    if (match) {
        match.fn(req, res, match);
    } else {
        res.statusCode = 404;
        let unknownPage = view.compileFile('./templates/404.html')();
        res.writeHead(200, { "Content-type": "text/html" });
        res.end(unknownPage);
        console.log('this page is not exist');
    }
});
server.listen(5000);
console.log('server running');