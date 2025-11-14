const express = require('express');
const router = express.Router();
const monthlyController = require('../controllers/monthlyController');
router.get('/', monthlyController.get);
router.post('/register', monthlyController.create);
router.put('/:_id', monthlyController.update);
router.delete('/:_id', monthlyController.delete);

module.exports = router;