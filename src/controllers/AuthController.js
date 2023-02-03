class AuthController {
    async login(req,res,next){
        res.send("Login")
    }
    async register(req,res,next){
        res.send("register")
    }
}
module.exports = new AuthController()