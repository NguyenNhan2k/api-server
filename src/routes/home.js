const express = require('express');
const router = express.Router();
const homeController = require('../controllers/HomeController');

router.get('/amthuc/:slug', homeController.indexDetailBranch);
router.get('/cantho', homeController.indexListBranch);
router.get('/', homeController.index);

module.exports = router;
