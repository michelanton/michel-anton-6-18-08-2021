const express = require('express');
const bodyParser = require('body-parser'); // permet de lire le corps de la qeuete en format JS
const mongoose = require('mongoose');  // package pour MongoDB (DataBase)
const path = require('path'); // gere repertaoire et chemin de fichier
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const app = express();  // fonction express requête  HTTP

const dotenv = require("dotenv"); //package // charge les variables d'environnement d'un fichier.permet d'avoir plusieurs environements
dotenv.config();

const helmet = require("helmet"); //configure entete http lié à la sécurité//

app.use(helmet());  //connecté à express, ogmente la sécurité de l'en-tête http (use=Express)


mongoose.connect(process.env.MONGO_connction,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//(use=Express)
app.use((req, res, next) => {     //régles de CORS pour que l'app acceder à l'API
    res.setHeader('Access-Control-Allow-Origin', '*'); // autorise tout le monde a acceder dans le CROS
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');// autorise certain titre de header dans le CROS
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');// autorise certaine methodes dans le CROS
    next();
  });

app.use(bodyParser.json());//(use=Express)

app.use('/images', express.static(path.join(__dirname, 'images'))); //.join : assembler plusieurs parties de chemin - path ////(use=Express)

app.use('/api/sauces', sauceRoutes);//(use=Express)
app.use('/api/auth', userRoutes);//(use=Express)

module.exports = app;