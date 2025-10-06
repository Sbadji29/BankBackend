const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const upload = require("../middleware/upload");
// Routes CRUD
router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/stats/count", userController.countUsersByType);
router.patch("/:id/statut", userController.switchStatut);
router.put("/:id", upload.single("photo"), userController.updateUser);
router.post("/delete-multiple", userController.deleteMultipleUsers);
router.post("/switch-statut-multiple", userController.switchStatutMultiple);
module.exports = router;
