const Mongoclient = require('mongodb').MongoClient;
const URL_MONGODB = 'mongodb://localhost:27017';
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const URL = "http://localhost:3000/student_list";
let stud_names = [];
//EJS
const ejs = require('ejs');
app.set('views', './views');
app.set(`view engine`, `ejs`);

//Body parser -- POST
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.use(express.static(__dirname));
//Push les étudiants de la DB dans tab vide
async function get_names(){
    stud_names = [];
    let fetched_DbStud = await fetch(URL);
    let listOfStud = await fetched_DbStud.json();
    for(i = 0; i < listOfStud.length; i++){
        stud_names.push(listOfStud[i].name);
    }
}

//Routes--Students
app.get('/', function (req, res) {
    console.log('vous êtes à la racine');
    res.send('Ecoute sur :8080');
    });

app.get('/students', async (req, res) => {  
    await get_names();
    res.render('index', {stud_names});
    });

app.post('/students', async function(req, res){

    fetch(URL, { 
    method: "POST",  //Add a method POST to fetch 
    body: JSON.stringify({name: req.body.name}), // Adding body or contents to send 
    // Adding headers to the request 
    headers: { 
        "Content-type": "application/json; charset=UTF-8"
        } 
    })
    .then((res) => {
        res.json();
    })
    .then((parsed_res)=>{
        console.log(parsed_res);
        console.log(req.body);
    });
    res.redirect('/students');
});

//Routes--Groups
app.get('/groups', async (req, res) => {  
    await get_names();
    res.render('groups', {stud_names});
    });

app.listen(8080, ()=>{
    console.log("Listening on port 8080");
});


