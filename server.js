const express = require("express");
const path = require('path');
const api = require('./routes/index.js');


const fs = require('fs');
const util = require('util');

const PORT = process.env.PORT || 3002;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static('public'));

app.get("/", (req, res) => {
    try {
        req.sendFile(path.join(__dirname, '/public/index.html'));
    } catch (err) {
        console.log('error sending (index) file');
        console.log(err);
    }
});

app.get("/api/notes", (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '/public/notes.html'));
    } catch (err) {
        console.log('error sending (notes) file');
        console.log(err);
    }
});
app.get("/api/notes/db", (req, res) => {
    try {
        const dirName = `${__dirname}/db/db.json`
        fs.readFile(dirName, 'utf8',
            (err, data) => {
                if (err) {
                    console.error(err);
                } else {
                    res.json(data);
                }
            });
    } catch (err) {
        console.log('error getting and sending db file');
        console.log(err);
    }
});

app.listen(PORT, () => {
    console.log(__dirname);
    console.log(`App listening at http://localhost:${PORT}`)
})