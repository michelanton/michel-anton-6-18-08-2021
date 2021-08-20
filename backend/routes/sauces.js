///////////////////////////////////////////////////////////////////////LOGIQUE ROUTE STUFF Enregistrement des routes dans appli express////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////creation d'un routeur express, importation du middleware en argument des routes pour protection/////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////6 ROUTES THING SAUCE///////////////////////////////////////////////////////////////////////////////////////
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config"); //package qui permet de gérer les fichiers entrants//
const sauceCtrl = require("../controllers/sauces");

router.get("/", auth, sauceCtrl.getAllSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);

module.exports = router;
