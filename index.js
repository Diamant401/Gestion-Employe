const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');

const app = express();
const Port = 2000;

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'employe_bd'
});

connection.connect((err) => {
    if(err){
        console.error('Erreur de connexion à la base de données:',err);
        return;
    }
    console.log('Connecté à la base de données Mysql');
});

app.use(bodyParser.json());

let employees = [
    {id: 1, name:'',position:'', task:''},
    {id: 2, name:'',position:'', task:''},
];

// Servir les fichiers statiques du dossier "public"
app.use(express.static(path.join(__dirname, 'public')));

// Route pour afficher la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','app.html'));
});

// Routes CRUD
// lire tous les empoyees
app.get('/employees',(req,res) => {
    connection.query('SELECT * FROM employés',(err,results) =>{
        if(err){
            console.error('Erreur lors de la récupération des employés:',err);
            res.status(500).send('Erreur serveur');
            return;
        }
        res.json(results);
    });
    
});

//lire un employé par id
app.get('/employees/:id',(req,res) => {
    const id = parseInt(req.params.id);
    connection.query('SELECT * FROM employés WHERE ID = ?',[id],(err,results) =>{
        if(err){
            console.error('Erreur lors de la récupération des employés:',err);
            res.status(500).send('Erreur serveur');
            return;
        }
        if(results.length === 0){
            res.status(404).send('Employé non trouvé');
            return;
        }
        res.json(results[0]);
    });
});

//créer un nouveau employé
app.post('/employees',(req,res) =>{
    const {name,position,task} = req.body;
    connection.query('INSERT INTO employés (nom,poste,tache) VALUES (?,?,?)',[name,position,task],(err,results) =>{
        if(err){
            console.error('Erreur lors de ajout des employés:',err);
            res.status(500).send('Erreur serveur');
            return;
        }
        res.send('Employé ajouté avec succès');
    });
});

//mettre à jour un employé
app.put('/employees/:id',(req,res) => {
    const id = parseInt(req.params.id);
    const {name,position,task} = req.body;
    connection.query('UPDATE employés SET nom = ?, poste =?, tache = ? WHERE id = ?',[name,position,task,id],(err,results) =>{
        if(err){
            console.error('Erreur lors de la mise à jour des employés:',err);
            res.status(500).send('Erreur serveur');
            return;
        }
        res.send('Employé mis à jour avec succès');
    });
});

//supprimer un employé
app.delete('/employees/:id', (req,res) => {
    const id = parseInt(req.params.id);
    connection.query('DELETE FROM employés WHERE id = ?',[id],(err,results) =>{
        if(err){
            console.error('Erreur lors de la suppresion  des employés:',err);
            res.status(500).send('Erreur serveur');
            return;
        }
        res.send('Employé supprimé avec succès');
    });
});

app.listen(Port, () => {
    console.log('Serveur démarré sur le port http://localhost:${Port}');
});