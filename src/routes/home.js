const express = require('express');
const router = express.Router();
const homeController = require('../controllers/HomeController');

router.get('/branch/:slug', homeController.indexDetailBranch);
router.get('/', homeController.index);
router.get('/cantho', homeController.indexListBranch);

module.exports = router;
