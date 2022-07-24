const router = require('express').Router();
const fs = require('fs');
// const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const path = require('path');
const uuid = require('../helpers/uuid');



// GET route for projects
// router.get('/api/notes', (req, res) => {
//     console.log(' GET NOTES RUNNING');
//     console.log('');
//     res.sendFile(path.join(__dirname, '../public', 'notes.html'))
// })


// POST route for new projects

router.post('/api/notes', (req, res) => {
    console.log(' POST NOTES RUNNING');
    const { title, text } = req.body;
    console.log(bodyData);
    const newNote = {
        noteId: uuid(),
        title,
        text
    }
    console.log(newNote);
})


module.exports = router;