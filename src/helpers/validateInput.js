const joi = require('joi');

const fullName = joi.string().min(3).max(30).required();
const url_img = joi.string();
const password = joi.string().min(6).required();
const phone = joi.string().required();
const id = joi.string().required();
const address = joi.string().required();
const email = joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required();
const confirmPwd = joi.ref('password');

const registerSchema = joi.object({
    fullName: joi.string().min(3).max(30).required(),
    password: joi.string().min(6).required(),
    email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    confirmPwd: joi.ref('password'),
});

const loginSchema = joi.object({
    email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    password: joi.string().min(6).required(),
});

const userJoi = joi.object({
    fullName,
    address,
    phone,
    email,
    id,
});
const customerJoi = joi.object({ password, phone, fullName, address, email, confirmPwd });
const customerUpdateJoi = joi.object({ phone, fullName, address, email });
module.exports = {
    registerSchema,
    loginSchema,
    userJoi,
    customerJoi,
    customerUpdateJoi,
};
