const { customerJoi, userJoi, handelAction } = require('../helpers/validateInput');
const staffService = require('../services/StaffService');
const { internalServer, badRequest } = require('../middlewares/handleError');
const { equal, defaults } = require('joi');

class StaffController {
    async indexStaff(req, res) {
        try {
            const { type, column, page } = await req.query;
            const order = type && column ? [column, type] : [];
            const response = await staffService.getAll({ page, order });
            const message = await req.flash('message')[0];
            return res.render('staff/staffs', {
                layout: 'manage',
                active: 'staff',
                staffs: response.staffs,
                countPage: response.countPage,
                countDeleted: response.countDeleted,
                message,
            });
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async indexCreate(req, res) {
        try {
            const message = await req.flash('message')[0];
            return res.status(200).render('staff/create', {
                layout: 'manage',
                message,
                active: 'staff',
            });
        } catch (error) {
            console.log(error);
            internalServer(req, res);
        }
    }
    async indexInfoStaff(req, res) {
        try {
            const idStaff = await req.params.id;
            if (!idStaff) {
                const messageError = 'Yêu cầu thất bại!';
                return badRequest(req, res, messageError);
            }
            const response = await staffService.getOne(idStaff);
            const message = await req.flash('message')[0];
            return res.render('staff/infoStaff', {
                layout: 'manage',
                staff: response.err !== 1 ? response.staff : {},
                active: 'staff',
                message,
            });
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async indexTrash(req, res) {
        try {
            const { type, column, page } = await req.query;
            const order = type && column ? [column, type] : [];
            const deleted = false;
            const response = await staffService.getAll({ page, order, deleted });
            const message = await req.flash('message')[0];
            return res.render('staff/trashStaff', {
                layout: 'manage',
                active: 'staff',
                staffs: response.staffs,
                countPage: response.countPage,
                message,
            });
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async create(req, res) {
        try {
            const { id } = await req.user;
            await delete req.body.url_img;
            const { error, value } = await customerJoi.validate(req.body);
            if (error) {
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
            }

            const response = await staffService.create(req.body);
            console.log(response);
            req.flash('message', response);
            return res.status(200).redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async update(req, res) {
        try {
            const { error, value } = await userJoi.validate(req.body);
            const imgUpload = await req.file;
            if (error) {
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
            }
            const response = await staffService.update(value, imgUpload);
            req.flash('message', response);
            res.redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async destroy(req, res) {
        const message = {};
        try {
            const customerId = await req.params.id;
            console.log(customerId);
            const response = await staffService.destroy(customerId);
            req.flash('message', response);
            res.redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async restore(req, res) {
        const message = {};
        try {
            const staffId = await req.params.id;
            const response = await staffService.restore(staffId);
            req.flash('message', response);
            res.redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async force(req, res) {
        const message = {};
        try {
            const staffId = await req.params.id;
            const response = await staffService.force(staffId);
            req.flash('message', response);
            res.redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async handelAction(req, res) {
        const message = {};
        try {
            const { actions, staffs } = await req.body;

            if (!actions || staffs.length < 0) {
                return badRequest(req, res, 'Input invalid !');
            }
            switch (actions) {
                case 'delete':
                    const resDeleted = await staffService.destroyMutiple(staffs);
                    req.flash('message', resDeleted);
                    res.redirect('back');
                    break;
                case 'restore':
                    const resRestore = await staffService.restoreMutiple(staffs);
                    req.flash('message', resRestore);
                    res.redirect('back');
                    break;
                case 'force':
                    const resForce = await staffService.forceMutiple(staffs);
                    req.flash('message', resForce);
                    res.redirect('back');
                    break;
                    defaults: message.mes = 'Action invalid !';
            }
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
}
module.exports = new StaffController();
