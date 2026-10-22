const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Настройка Mustache
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Body-parser для форм
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Чтение JSON
const db = require('./db');
const jsonData = db.getAll();

// Маршруты
app.get('/', (req, res) => {
    res.render('home', { username: 'Иван', siteName: jsonData.siteName, message: req.query.message || null });
});

app.get('/about', (req, res) => {
    res.render('about', { year: jsonData.year, siteName: jsonData.siteName });
});

app.get('/services', (req, res) => {
    res.render('services', { siteName: jsonData.siteName, serviceList: jsonData.services });
});

app.get('/contact', (req, res) => {
    res.render('contact', { siteName: jsonData.siteName });
});

app.get('/form', (req, res) => {
    res.render('form', { siteName: jsonData.siteName });
});

app.post('/submit', (req, res) => {
    
    const formData = { ...req.body };
    if (!formData.subscribe) {
        formData.subscribe = 'no';
    }
    console.log(formData)
     db.addSubmission(formData);
    res.redirect('/?message=' + encodeURIComponent('Данные успешно отправлены!'));
});
app.get('/submissions', (req, res) => {
    res.render('submissions', {
        items: db.getSubmissions()
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});