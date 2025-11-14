const express = require('express');
const router = express.Router();
const diagnosisController = require('../controllers/diagnosisController');
router.get('/', diagnosisController.get);
router.post('/register', diagnosisController.create);
router.put('/:_id', diagnosisController.update);
router.delete('/:_id', diagnosisController.delete);

module.exports = router;