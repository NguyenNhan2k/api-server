const express = require('express');
const router = express.Router();
const multer = require('multer');
const dishController = require('../controllers/DishController');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'E:/WorkSpaces/TieuLuan-WebFood/server/src/public/img/dish');
    },
    filename: function (req, file, cb) {
        const arrFileName = file.originalname.split('.');
        const newFileName = `${arrFileName[0]}-${Date.now()}.${arrFileName[1]}`;
        cb(null, newFileName);
    },
});
const upload = multer({ storage: storage });
const cpUpload = upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'images', maxCount: 8 },
]);
router.get('/create', dishController.indexCreate);
router.get('/update/:id', dishController.indexUpdate);
router.get('/trash', dishController.indexTrash);
router.get('/restore/:id', dishController.restore);
router.get('/:id', dishController.indexInfoDish);
router.get('/', dishController.indexDish);

router.post('/handel-form-actions', dishController.handelAction);
router.post('/create', cpUpload, dishController.create);
router.patch('/update/:id', cpUpload, dishController.update);
router.delete('/destroy/:id', dishController.destroy);
router.delete('/force/:id', dishController.force);
module.exports = router;
