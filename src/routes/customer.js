const express = require('express');
const multer = require('multer');
const router = express.Router();
const customerController = require('../controllers/CustomerController');
const { authStaff } = require('../middlewares/verifyToken');
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

router.get('/logout', customerController.logOut);
router.get('/profile', customerController.index);
router.get('/account', customerController.indexAccount);

router.get('/', authStaff, customerController.getAll);
router.patch('/update', upload.single('avatar_user'), customerController.update);

module.exports = router;
