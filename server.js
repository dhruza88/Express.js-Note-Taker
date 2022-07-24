const express = require("express");
const path = require('path');
const api = require('./routes/index.js');

const PORT = process.env.PORT || 3002;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static('public'));

app.get("/", (req,res) => {
    try {
        req.sendFile(path.join(__dirname, '/public/index.html'));
    } catch (err) {
        console.log('error sending (index) file');
        console.log(err);
    }
});

app.get("/api/notes", (req,res) => {
    try {
        console.log(' GETTING NOTES TO LOAD ');
        res.sendFile(path.join(__dirname, '/public/notes.html'))
        console.log(' AFTER NOTES RES SEND');
    } catch (err) {
        console.log('error sending (notes) file');
        console.log(err);
    }
});

app.listen(PORT, () => {
    console.log(__dirname);
    console.log(`App listening at http://localhost:${PORT}`)
})