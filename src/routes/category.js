const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');

router.get('/create', categoryController.indexCreate);
router.get('/trash', categoryController.indexTrash);
router.get('/restore/:id', categoryController.restore);
router.get('/:id', categoryController.indexInfoCategory);
router.get('/', categoryController.indexCategory);

router.post('/handel-form-actions', categoryController.handelAction);
router.post('/create', categoryController.create);
router.patch('/update', categoryController.update);
router.delete('/destroy/:id', categoryController.destroy);
router.delete('/force/:id', categoryController.force);
module.exports = router;
