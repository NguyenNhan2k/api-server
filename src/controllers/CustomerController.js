const { request } = require('express');
const { customerJoi, userSchema } = require('../helpers/validateInput');
const customerService = require('../services/CustomerService');
const { internalServer, badRequest } = require('../middlewares/handleError');

class CustomerController {
    async index(req, res) {
        try {
            const { id } = await req.user;
            const mes = await req.flash('message')[0];
            const getOneCustomer = await customerService.getOne(id);
            const { type, err, customer } = await getOneCustomer;

            if (type === 'waring' && err === 1) {
                req.flash('message', getOneCustomer);
                return res.redirect('back');
            }
            return res.status(200).render('customer/profile', {
                layout: 'main',
                message: mes,
                customer,
            });
        } catch (error) {
            internalServer(req, res);
        }
    }
    async indexAccount(req, res) {
        try {
            return res.render('customer/account');
        } catch (error) {
            internalServer(req, res);
        }
    }
    async indexCreate(req, res) {
        try {
            const message = await req.flash('message')[0];
            return res.status(200).render('customer/create', {
                layout: 'manage',
                message,
                active: 'customers',
            });
        } catch (error) {
            console.log(error);
            internalServer(req, res);
        }
    }

    async indexInfoCustomer(req, res) {
        try {
            const idCustomer = await req.params.id;
            if (!idCustomer) {
                const messageError = 'Yêu cầu thất bại!';
                return badRequest(req, res, messageError);
            }

            const response = await customerService.getOne(idCustomer);

            if (response.err === 1 || response.type === 'warning') {
                const messageError = 'Yêu cầu thất bại!';
                req.flash('message', messageError);
                return res.redirect('back');
            }
            const message = await req.flash('message')[0];
            return res.render('customer/infoCustomer', {
                layout: 'manage',
                customer: response.customer,
                active: 'customers',
                message,
            });
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async getAll(req, res) {
        try {
            const { type, column, page } = await req.query;
            const order = type && column ? [column, type] : [];
            const response = await customerService.getAll({ page, order });
            return res.render('customer/manageCustomers', {
                layout: 'manage',
                active: 'customers',
                customers: response.customers,
                countPage: response.countPage,
            });
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async update(req, res) {
        try {
            const { id } = await req.user;

            const { error, value } = await userSchema.validate(req.body);
            const imgUpload = await req.file;
            if (error) {
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
            }
            const response = await customerService.update({ id, ...req.body }, imgUpload);
            const message = {
                type: response.type,
                mes: response.message,
            };
            req.flash('message', message);
            res.redirect('back');
        } catch (error) {
            console.log(error);
        }
    }
    async create(req, res) {
        try {
            const { id } = await req.user;
            const { error, value } = await customerJoi.validate(req.body);
            if (error) {
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
            }

            const response = await customerService.create(req.body);
            console.log(response);
            req.flash('message', response);
            return res.status(200).redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async logOut(req, res) {
        try {
            const { id } = await req.user;
            console.log(id);
            const response = await customerService.logout(id);
            if (response.err === 0) {
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');
                res.clearCookie('user');
                req.flash('message', response);
                return res.redirect('/auth/login');
            }
            req.flash('message', response);
            return res.redirect('/auth/login');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
}
module.exports = new CustomerController();
