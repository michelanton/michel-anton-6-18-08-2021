//verif authentification//

const jwt = require("jsonwebtoken"); // package objet littéral, un jeton ou une chaîne représentant un JSON valide.
const dotenv = require("dotenv"); //package // charge les variables d'environnement d'un fichier.permet d'avoir plusieurs environements
dotenv.config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; //extraction du token du header auth//
    const decodedToken = jwt.verify(token, process.env.Secret_word_token); //decodage token - jsonwebtoken//
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) { 
      //comparaison id utilisateur ET celui du token//
      /////si id utilisateur différent de user id on envoie une erreur////
      throw "user ID non valable";
    } else {
      ///si ok on passe l'exécution///////////////////////////
      next();
    }
  } catch {
    res.status(403).json({
      error: new Error("unauthorized request"),
    });
  }
};

