class HomeController {
    async index(req,res,next){
        res.render("home")
    }
}
module.exports = new HomeController()