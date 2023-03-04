class HomeController {
    async index(req, res, next) {
        res.render('customer/home');
    }
}
module.exports = new HomeController();
