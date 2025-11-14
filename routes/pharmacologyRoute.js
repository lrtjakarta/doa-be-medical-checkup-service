const express = require('express');
const router = express.Router();
const pharmacologyController = require('../controllers/pharmacologyController');
router.get('/', pharmacologyController.get);
router.post('/register', pharmacologyController.create);
router.put('/:_id', pharmacologyController.update);
router.delete('/:_id', pharmacologyController.delete);

module.exports = router;