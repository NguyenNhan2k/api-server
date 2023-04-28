const express = require('express');
const router = express.Router();
const multer = require('multer');
const storeController = require('../controllers/StoreController');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'E:/WorkSpaces/TieuLuan-WebFood/server/src/public/img/user');
    },
    filename: function (req, file, cb) {
        const arrFileName = file.originalname.split('.');
        const newFileName = `${arrFileName[0]}-${Date.now()}.${arrFileName[1]}`;
        cb(null, newFileName);
    },
});
const upload = multer({ storage: storage });
router.get('/create', storeController.indexCreate);
router.get('/trash', storeController.indexTrash);
router.get('/restore/:id', storeController.restore);
router.get('/:id', storeController.indexInfoStore);
router.get('/', storeController.indexStore);

router.post('/handel-form-actions', storeController.handelAction);
router.post('/create', storeController.create);
router.patch('/update', storeController.update);
router.delete('/destroy/:id', storeController.destroy);
router.delete('/force/:id', storeController.force);
module.exports = router;
