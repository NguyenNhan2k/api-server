const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController');

// router.get('/create', dishController.indexCreate);
// router.get('/update/:id', dishController.indexUpdate);
// router.get('/trash', dishController.indexTrash);
// router.get('/restore/:id', dishController.restore);
// router.get('/:id', dishController.indexInfoDish);
// router.get('/', dishController.indexDish);

router.post('/create/:idDish', cartController.create);
// router.post('/handel-form-actions', dishController.handelAction);
router.patch('/update/:idCart', cartController.update);
// router.delete('/destroy/:id', dishController.destroy);
// router.delete('/force/:id', dishController.force);
module.exports = router;
