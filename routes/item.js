const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');

router.post('/create/:id', itemController.item_post);

router.get('/create/:id', itemController.item_create);

router.post('/:id', itemController.item_delete);

router.get('/:id', itemController.item_detail);

module.exports = router;
