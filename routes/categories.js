const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');

router.get('/create', categoryController.create_get);

router.post('/create', categoryController.create_post);

router.get('/delete/:id', categoryController.delete_get);

router.post('/delete/:id', categoryController.delete_post);

router.get('/:id', categoryController.category_detail);

module.exports = router;
