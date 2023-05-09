const express = require('express');
const router = express.Router();
const multer = require('multer');
const rateController = require('../controllers/RateController');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'E:/WorkSpaces/TieuLuan-WebFood/server/src/public/img/imgRates');
    },
    filename: function (req, file, cb) {
        const arrFileName = file.originalname.split('.');
        const newFileName = `${arrFileName[0]}-${Date.now()}.${arrFileName[1]}`;
        cb(null, newFileName);
    },
});
const upload = multer({ storage: storage });
router.post('/create/:id', upload.array('image'), rateController.create);
router.patch('/update/:idRate', upload.array('image'), rateController.update);
router.delete('/destroy/:id', rateController.destroy);

module.exports = router;
