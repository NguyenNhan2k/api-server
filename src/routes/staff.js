const express = require('express');
const router = express.Router();
const multer = require('multer');
const staffController = require('../controllers/StaffController');
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
router.get('/create', staffController.indexCreate);
router.get('/:id', staffController.indexInfoStaff);
router.get('/', staffController.indexStaff);

router.post('/create', upload.single('url_img'), staffController.create);
router.patch('/update', upload.single('url_img'), staffController.update);
router.delete('/destroy/:id', staffController.destroy);
module.exports = router;
