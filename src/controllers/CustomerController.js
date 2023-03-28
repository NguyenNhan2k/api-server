const customerService = require('../services/CustomerService');

const { internalServer, badRequest } = require('../middlewares/handleError');
const { userSchema } = require('../helpers/validateInput');
const { request } = require('express');

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
    async getAll(req, res) {
        try {
            const { type, column, page } = await req.query;
            const order = type && column ? [column, type] : [];
            const response = await customerService.getAll({ page, order });
            return res.render('customer/manageCustomers', {
                layout: 'manage',
                customers: response.customers,
                active: 'customers',
            });
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async indexAccount(req, res) {
        try {
            return res.render('customer/account');
        } catch (error) {
            internalServer(req, res);
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
