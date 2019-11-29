const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')

const app = express()
const port = (process.env.PORT || 3000)
var API_PATH = "/api/v1";

var contacts = [ 

    {"name" : "peter", "phone": 12345, "_id": 1 }, 

    {"name" : "john", "phone": 6789, "_id": 2 } 

];
app.use(cors());
// Permet de transformer le contenu du body en Json
app.use(bodyParser.json());

//Chargement du fichier de donnée
var Datastore = require('nedb'),
db = new Datastore({ filename: './contacts.json', autoload: true });

//Initialisation de la BD avec les données initiales en cas de base vide
//Chargement des données dans la varible contacts en cas de base non vide
db.find({}, function (err, docs) {
    if (!docs.length) {
        db.insert(contacts)
    }
});

app.get(API_PATH + "/contacts", (req, res) => {
    console.log(Date() + " GET /contacts")
    db.find({}, function (err, docs) {
        res.send(docs)
    });
})

app.put(API_PATH + "/contacts/:_id", (req, res) => {
    console.log(Date() + " PUT /contacts/:_id")
    var contactId = parseInt(req.params._id);
    var newName = req.body.name
    var newPhone = req.body.phone
    if (!newName || !newPhone){
        res.sendStatus(400);
    } else {
        db.update({ _id: contactId }, { $set: { name: newName, phone: newPhone } }, function (err, numReplaced) {
            console.log("Modif = " + numReplaced)
            if (numReplaced){
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        });
    }  
})

app.post(API_PATH + "/contacts", (req, res) => {
    console.log(Date() + " POST /contacts")
    var contact = req.body
    contact._id = 1;

    //On recupère le max ID
    db.find({}, function (err, docs) {
        if (docs.length) {
            docs.forEach(element => {
                if (element._id >= contact._id){
                    contact._id = element._id + 1;
                }
            });
        } 
    });
    db.insert(contact);
    res.sendStatus(201)
})

app.delete(API_PATH + "/contacts/:_id", (req, res) => {
    console.log(Date() + " DELETE /contacts/:_id")
    var contactId = parseInt(req.params._id);

    db.remove({ _id: contactId }, {}, function (err, numRemoved) {
        console.log("Suppression effectuée: " + numRemoved);
        if (numRemoved){
            res.sendStatus(201)
        }else {
            res.sendStatus(404)
        }
    });
})

app.get(API_PATH + "/contacts/:_id", (req, res) => {
    console.log(Date() + " GET /contacts/:_id")
    var contactId = parseInt(req.params._id);
    console.log("PARAM == " + contactId)

    db.find({_id: contactId}, function (err, docs) {
        res.send(docs)
    });
})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))