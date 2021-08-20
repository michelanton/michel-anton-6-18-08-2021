//////////////////////////////////////////////////////////////////////////multer permet de gérer les fichiers rentrants////////////////////////////////////////////////////////////////////////////
const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  //pour enregistrer fichier entrants//
  destination: (req, file, callback) => {
    callback(null, "images"); //enregistrement dans le dossier images//
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); ///il faut utiliser le nom dorigine,remplacer espaces par underS ,utiliser un timestamp///////
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
