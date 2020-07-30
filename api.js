const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const URL_MONGODB = 'mongodb://localhost:27017';
const api = express();

//Body parser
api.use(express.urlencoded({extended: true}));
api.use(express.json());


const main = async () =>{
    try {

        api.use(express.urlencoded({extended: true})); //Décoder le body de REQ.

        //Me connecter à la DB
        const client = await MongoClient.connect(URL_MONGODB, {useNewUrlParser: true, useUnifiedTopology: true });
        const db = await client.db('classroom');


        //Créer mes routes 

        api.get('/', function (req, res) {
            console.log('vous êtes à la racine');
            res.send('2coute sur port 3000');
            });

        api.get('/student_list', async function (req, res) {
            res.json(await db.collection('students').find().toArray());
        });
        
        
        api.post('/student_list', async (req,res) => {
        let myrep =  req.body.name;
        console.log(req.body);

            db.collection('students').insertOne({name : myrep}, (error, result) =>{
                if(error){
                    throw error;
                }
                res.json({msg : "Bien ajouté"});
            });

            });

        api.delete('/toDelete/:name', async (req,res) =>{
            try {
                let name_to_delete = await req.params.name;
             await  db.collection("students").deleteOne({name : name_to_delete});
            } catch (e) {
                console.log(e);
            }
        });

        api.listen(3000, function () {
        console.log('Example api listening on port 3000!');
        });

    } catch (e) {
        console.log(e);
    }
};

main();

