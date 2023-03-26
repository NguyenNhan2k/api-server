class HomeController {
    async index(req, res, next) {
        const mes = await req.flash('message')[0];

        res.render('customer/home', {
            layout: 'main',
            message: mes,
        });
    }
}
module.exports = new HomeController();
