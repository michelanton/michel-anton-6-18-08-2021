/////////////////////////////////////////////////////////////////////////////GESTION OPERATIONS CRUD POUR SAUCES///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Sauce = require("../models/Sauce");
const fs = require("fs"); ///package systeme de fichier de node acces aux fct pour modif,supprettion///////////

///////////////////////////////////////////////////////////////////////enregistrement création d'une sauce///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); // on recupere la sauce
  delete sauceObject._id; //L'id de la sauce est suprimé
  const sauce = new Sauce({
    // on créé la nouvelle sauce
    ...sauceObject, /* opérateur spread ... = opérateur de décomposition...extrait les éléments d'un objet itérable en JavaScript // copie tous les éléments de req.body*/
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`, //variable pour l'implantation de l'image
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save() // on sauvegarde la nouvelle sauce
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};

///////////////////////////////////////////////////////////////////////////Récupération d'une seule sauce avec id fourni ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

///////////////////////////////////////////////////////////////////////////Requête PUT ,ternaire a ton recu un nouveau fichier ou non pour modification?Mise a jour de la sauce avec id fourni////////////////////////////////////////////////////////////////////////////////////////
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file //nouvelle image//
    ? {
        ...JSON.parse(req.body.sauce), //récup infos sur lobjet///* opérateur spread ... = opérateur de décomposition...copie tous les éléments de req.body*/
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          //on genere la nouvelle image url//
          req.file.filename ///// si req file existe on traite la nouvelle image///
        }`,
      }
    : { ...req.body }; //// sinon on traite l'objet entrant /* opérateur spread ... = opérateur de décomposition...copie tous les éléments de req.body*/
  Sauce.updateOne(
    /// on mofif id de l'objet//
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id } /* opérateur spread ... = opérateur de décomposition...copie tous les éléments de req.body*/
  )
    .then(() => res.status(200).json({ message: "Sauce bien modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

//////////////////////////////////////////////////////////////////////////////////////Requête Delete pour supprimer sauce/////////////////////////////////////////////////////////////////////////////////////////////
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // id comme parametre pr acceder au sauce correspondant//
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        //suppretion du fichier de l'image en question et callback  executer qd fichier sup//
        Sauce.deleteOne({ _id: req.params.id })
          .then(() =>
            res.status(200).json({ message: "Sauce bien supprimée !" })
          )
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

////////////////////////////////////////////////////////////////////////////////////récupe tableau de sauces, méthode find//////////////////////////////////////////////////////////////////////////////////////
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

///créa fct likeThings  définit le statut jaime pour userID fourni/////
//si jaime= 1 user aime la sauce ok
///si jaime =0 user annule ce quil aime ou ce quil naime pas ok
//si jaime= -1 user naime pas   ok
//id utilisateur doit etre ajouté ou supprimé du tableau  ok
//il faut garder une trace de ses préférences
//lempecher daimer ou non la meme sauce plusieurs fois ok
// mise a jour nombre total jaime je naime pas
//corps de la demande userid et jaime réponse attendue : message  ok

exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;

  Sauce.findOne({ _id: req.params.id }) //recherche de la sauce dans la BD//

    .then((sauce) => {
      //On récupère les likes et dislikes de la sauce avant mise à jour
      let usersLiked = sauce.usersLiked;
      let usersDisliked = sauce.usersDisliked;
      let likes = sauce.likes;
      let dislikes = sauce.dislikes;

      //si user aime une sauce quil na pas déjà aimé //
      if (req.body.like == 1 && !usersLiked.includes(userId)) {
        //le tableau userLiked ne contient pas userid//
        //méthode include
        likes += 1; //on ajoute un like//
        usersLiked.push(userId); //je push dans tableau usersliked
      }
      //Si user n'aime pas une sauce quil na pas déjà disliké//
      if (req.body.like == -1 && !usersDisliked.includes(userId)) {
        dislikes += 1; // on ajoute de 1 la qté  d'utilisateur qui n'aime pas la sauce  dans mon tableau(object) usersdisliked
        usersDisliked.push(userId);

        //et si le user annule ce quil aime//
      } else if (req.body.like == 0 && usersLiked.includes(userId)) {
        likes -= 1; // on annule le like//
        sauce.usersLiked.splice(usersLiked, 1); //on enleve de 1 dans le tableau de ceux qui aiment //

        //et si user annule ce quil n'aime pas//
      } else if (req.body.like == 0 && usersDisliked.includes(userId)) {
        //et si user annule ce quil n'aime pas//
        dislikes -= 1; //on annule le dislike//
        sauce.usersDisliked.splice(usersDisliked, 1); // on enleve de 1 dans le tableau de ceux qui naiment pas//
      }
      sauce
        .save()
        .then(() => res.status(201).json({ message: "Like pris en compte" }))
        .catch((error) => res.status(400).json({ error }));
    });
};
