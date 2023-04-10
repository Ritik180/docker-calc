const http = require('http');
const fs = require('fs');
const url = require('url');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'password',
  database: 'myapp'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
    return;
  }
  console.log('Connected to database.');
});

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  if (reqUrl.pathname === '/') {
    fs.readFile('/index.html', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (reqUrl.pathname === '/square') {
    const number = parseInt(reqUrl.query.number, 10);
    const result = number * number;
    connection.query('INSERT INTO square (number, result) VALUES (?, ?)', [number, result], (error, results, fields) => {
      if (error) throw error;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ result }));
    });
  } else if (reqUrl.pathname === '/fibonacci') {
    const number = parseInt(reqUrl.query.number, 10);
    const result = fib(number);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ result }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(8080, () => {
  console.log('Server running on port 8080');
});

function fib(n) {
  if (n < 2) {
    return n;
  }
  return fib(n - 1) + fib(n - 2);
}
