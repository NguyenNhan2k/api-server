class StaffController {
    async index(req, res, next) {
        res.render('staff/staff', {
            layout: 'manage',
            active: 'staff',
        });
    }
}
module.exports = new StaffController();
