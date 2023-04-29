const express = require('express');
const router = express.Router();
const multer = require('multer');
const branchController = require('../controllers/BranchController');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'E:/WorkSpaces/TieuLuan-WebFood/server/src/public/img/branch');
    },
    filename: function (req, file, cb) {
        const arrFileName = file.originalname.split('.');
        const newFileName = `${arrFileName[0]}-${Date.now()}.${arrFileName[1]}`;
        cb(null, newFileName);
    },
});
const upload = multer({ storage: storage });
router.get('/create', branchController.indexCreate);
router.get('/trash', branchController.indexTrash);
router.get('/restore/:id', branchController.restore);
router.get('/:id', branchController.indexInfoBranch);
router.get('/', branchController.indexBranch);

router.post('/handel-form-actions', branchController.handelAction);
router.post('/create', upload.single('avatar'), branchController.create);
router.patch('/update', upload.single('avatar'), branchController.update);
router.delete('/destroy/:id', branchController.destroy);
router.delete('/force/:id', branchController.force);
module.exports = router;
