const { request } = require('express');
const { customerUpdateJoi, userJoi, customerJoi } = require('../helpers/validateInput');
const customerService = require('../services/CustomerService');
const { internalServer, badRequest } = require('../middlewares/handleError');
const { equal, defaults } = require('joi');

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
    async indexTrash(req, res) {
        try {
            const { type, column, page } = await req.query;
            const order = type && column ? [column, type] : [];
            const deleted = false;
            const response = await customerService.getAll({ page, order, deleted });
            const message = await req.flash('message')[0];
            return res.render('customer/trashCustomers', {
                layout: 'manage',
                active: 'customers',
                customers: response.customers,
                countPage: response.countPage,
                message,
            });
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async indexCustomers(req, res) {
        try {
            const { type, column, page } = await req.query;
            const order = type && column ? [column, type] : [];
            const response = await customerService.getAll({ page, order });
            const message = await req.flash('message')[0];
            return res.render('customer/manageCustomers', {
                layout: 'manage',
                active: 'customers',
                customers: response.customers,
                countPage: response.countPage,
                countDeleted: response.countDeleted,
                message,
            });
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async updateProfile(req, res) {
        try {
            const { id } = await req.user;
            const { error, value } = await customerUpdateJoi.validate(req.body);
            const imgUpload = await req.file;
            if (error) {
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
            }
            const response = await customerService.update({ id, value }, imgUpload);
            req.flash('message', response);
            res.redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async updateByStaff(req, res) {
        try {
            const { error, value } = await userJoi.validate(req.body);
            const imgUpload = await req.file;
            if (error) {
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
            }
            const response = await customerService.updateByStaff(value, imgUpload);
            req.flash('message', response);
            res.redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async create(req, res) {
        try {
            const img = await await req.file;
            const { error, value } = await customerJoi.validate(req.body);
            console.log(img);
            if (error) {
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
            }
            const response = await customerService.create(value, img);
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
            if (!id) {
                return badRequest(req, res, 'Bad Reqauest!');
            }
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
    async destroy(req, res) {
        const message = {};
        try {
            const customerId = await req.params.id;
            console.log(customerId);
            const response = await customerService.destroy(customerId);
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
            const customerId = await req.params.id;
            console.log(customerId);
            const response = await customerService.force(customerId);
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
            const customerId = await req.params.id;
            console.log(customerId);
            const response = await customerService.restore(customerId);
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
            const { actions, customers } = await req.body;
            switch (actions) {
                case 'delete':
                    const resDeleted = await customerService.destroyMutiple(customers);
                    req.flash('message', resDeleted);
                    res.redirect('back');
                    break;
                case 'restore':
                    const resRestore = await customerService.restoreMutiple(customers);
                    req.flash('message', resRestore);
                    res.redirect('back');
                    break;
                    defaults: message.mes = 'Action invalid !';
            }
            console.log(req.body);
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
}
module.exports = new CustomerController();
