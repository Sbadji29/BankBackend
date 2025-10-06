const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const upload = require("../middleware/upload");

// Route register avec upload de photo
router.post("/register", upload.single("photo"), authController.register);

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authController.me);
module.exports = router;
