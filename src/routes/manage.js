const express = require('express');
const multer = require('multer');
const router = express.Router();
const manageController = require('../controllers/ManageController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'E:/WorkSpaces/TieuLuan-WebFood/server/src/public/img/user');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname;
        const arrFileName = file.originalname.split('.');
        const newFileName = `${arrFileName[0]}-${Date.now()}.${arrFileName[1]}`;
        cb(null, newFileName);
    },
});

const upload = multer({ storage: storage });
router.get('/', manageController.index);

module.exports = router;
