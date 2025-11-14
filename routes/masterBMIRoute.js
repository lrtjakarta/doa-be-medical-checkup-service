const express = require('express');
const router = express.Router();
const masterBMIController = require('../controllers/masterBMIController');
router.get('/', masterBMIController.get);
router.post('/register', masterBMIController.create);
router.put('/:_id', masterBMIController.update);
router.delete('/:_id', masterBMIController.delete);

module.exports = router;
