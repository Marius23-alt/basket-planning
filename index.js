const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Configurer CORS pour permettre les requêtes depuis le client
app.use(cors());

// Parser pour les requêtes JSON
app.use(express.json());

// Connexion à la base de données MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'astro'
});

// Vérifier la connexion à la base de données
db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});

// Route pour récupérer tous les matchs
app.get('/matchs', (req, res) => {
    db.query('SELECT * FROM matchs', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des matchs:', err);
            res.status(500).send('Erreur lors de la récupération des matchs');
        } else {
            res.json(results);
        }
    });
});

// Route pour ajouter un match
app.post('/matchs', (req, res) => {
    const { team1, team2, date } = req.body;
    const query = 'INSERT INTO matchs (team1, team2, date) VALUES (?, ?, ?)';
    db.query(query, [team1, team2, date], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'ajout du match:', err);
            res.status(500).send('Erreur lors de l\'ajout du match');
        } else {
            res.status(201).send('Match ajouté avec succès');
        }
    });
});

// Route pour supprimer un match
app.delete('/matchs/:id', (req, res) => {
    const matchId = req.params.id;
    console.log('Tentative de suppression du match avec ID:', matchId);  // Log l'ID pour vérification

    db.query('DELETE FROM matchs WHERE id = ?', [matchId], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression du match:', err);
            res.status(500).send('Erreur lors de la suppression du match');
        } else if (result.affectedRows === 0) {
            console.log('Aucun match trouvé avec cet ID:', matchId);  // Log si aucun match n'est trouvé
            res.status(404).send('Match non trouvé');
        } else {
            console.log('Match supprimé avec succès:', matchId);  // Log si la suppression a réussi
            res.status(200).send('Match supprimé avec succès');
        }
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
