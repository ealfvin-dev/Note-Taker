var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();
var PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

notes = [];

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    fs.readFile("./db/db.json", function(err, data) {
        if(err) throw err;

        return data;
    });
});

app.post("/api/notes", function(req, res) {
    console.log("In the server");
    const newNote = req.body;

    notes.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(notes), function(err) {
        if(err) throw err;
    });

    res.json(newNote);
});

app.delete("/api/notes/:id", function(req, res) {
    const id = req.params.id;
    
    //Delete note
})

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});