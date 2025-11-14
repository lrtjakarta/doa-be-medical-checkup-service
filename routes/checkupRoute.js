const express = require("express");
const router = express.Router();
const medicalController = require("../controllers/checkupController");
router.get("/", medicalController.get);
router.get("/many", medicalController.getMany);
router.get("/history", medicalController.getHistory);
router.get("/dashboard", medicalController.getDashboard);
router.post("/register", medicalController.create);
router.put("/:_id", medicalController.update);
router.get("/count", medicalController.getCount);
router.delete("/:_id", medicalController.delete);

module.exports = router;
