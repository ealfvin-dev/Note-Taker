var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();
var PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    fs.readFile("./db/db.json", function(err, data) {
        if(err) throw err;

        return res.json(JSON.parse(data));
    });
});

app.post("/api/notes", function(req, res) {
    const newNote = req.body;

    fs.readFile("./db/db.json", function(err, data) {
        if(err) throw err;

        const storedNotes = JSON.parse(data);

        if(storedNotes.length > 0) {
            newNote.id = storedNotes[storedNotes.length - 1].id + 1;
        }
        else {
            newNote.id = 1;
        }
        storedNotes.push(newNote);

        fs.writeFile("./db/db.json", JSON.stringify(storedNotes), function(err) {
            if(err) throw err;
        });
    
        return res.json(newNote);
    });
});

app.delete("/api/notes/:id", function(req, res) {
    const deleteID = req.params.id;
    
    fs.readFile("./db/db.json", function(err, data) {
        if(err) throw err;

        let notes = JSON.parse(data);
        let finalNotes = [];

        for(note of notes) {
            if(note.id != deleteID) {
                finalNotes.push(note);
                console.log(note);
            }
        }

        fs.writeFile("./db/db.json", JSON.stringify(finalNotes), function(err) {
            if(err) throw err;
        });
        
        return res.json(finalNotes);
    });
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});