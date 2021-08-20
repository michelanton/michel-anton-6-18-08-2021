const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
/////////////////////////////////////////////////////////////////////2 routes pour envoyer données utilisateurs////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
