const joi = require('joi');
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

const userSchema = joi.object({
    fullName: joi.string().required(),
    address: joi.string().required(),
    phone: joi.string().required(),
    email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
});
module.exports = {
    registerSchema,
    loginSchema,
    userSchema,
};
