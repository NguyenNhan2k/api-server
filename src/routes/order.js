const express = require('express');
const router = express.Router();

const orderController = require('../controllers/OrderController');

// router.get('/create', orderController.indexCreate);
router.get('/trash', orderController.indexTrash);
router.get('/restore/:id', orderController.restore);
router.get('/', orderController.indexOrder);
router.delete('/destroy/:id', orderController.destroy);
router.post('/handel-form-actions', orderController.handelAction);
// router.post('/handel-form-actions', dishController.handelAction);
// router.post('/create', cpUpload, dishController.create);
// router.patch('/update/:id', cpUpload, dishController.update);
// router.delete('/force/:id', dishController.force);
module.exports = router;
