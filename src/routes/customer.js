const express = require('express');
const multer = require('multer');
const router = express.Router();
const customerController = require('../controllers/CustomerController');
// const orderController = require('../controllers/OrderController');
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

router.get('/cart', customerController.indexCart);
router.get('/logout', customerController.logOut);
router.get('/changepwd', customerController.indexChangePwd);
router.get('/profile', customerController.index);
router.get('/order', customerController.indexOrder);
router.get('/account', customerController.indexAccount);
router.get('/history', customerController.indexHistory);

router.get('/create', authStaff, customerController.indexCreate);
router.get('/trash', authStaff, customerController.indexTrash);
router.get('/restore/:id', authStaff, customerController.restore);
router.get('/:id', authStaff, customerController.indexInfoCustomer);
router.get('/', authStaff, customerController.indexCustomers);

router.post('/create-order/:idCart', customerController.createOrderForCustomer);
router.post('/handel-form-actions', authStaff, customerController.handelAction);
router.post('/create', upload.single('url_img'), authStaff, customerController.create);

router.patch('/update', upload.single('url_img'), customerController.updateProfile);
router.patch('/changepwd', upload.single('url_img'), customerController.changePwd);
router.patch('/updateByStaff', upload.single('url_img'), customerController.updateByStaff);
router.delete('/destroy/:id', customerController.destroy);
router.delete('/force/:id', customerController.force);
module.exports = router;
