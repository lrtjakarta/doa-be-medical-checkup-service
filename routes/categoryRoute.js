const express = require('express');
const router = express.Router();
const medicalController = require('../controllers/categoryController');
router.get('/', medicalController.get);
router.post('/register', medicalController.create);
router.put('/:_id', medicalController.update);
router.delete('/:_id', medicalController.delete);

module.exports = router;