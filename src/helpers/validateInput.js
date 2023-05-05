const joi = require('joi');
const staffs = joi.array().required();
const actions = joi.string().required();
const fullName = joi.string().min(3).max(30).required();
const name = joi.string().required();
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
const province = joi.string().required();
const districts = joi.string().required();
const wards = joi.string().required();
const street = joi.string().required();
const id_store = joi.string().required();
const startTime = joi.string().required();
const price = joi.number().required();
const sale = joi.number();
const link = joi.string();
const description = joi.string();
const id_category = joi.string().required();
const id_branch = joi.string().required();
const endTime = joi.string().required();
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
const storeJoi = joi.object({ phone, name, email });
const baranchJoi = joi.object({ province, districts, wards, street, id_store, name, startTime, endTime, link });
const branchUpdateJoi = joi.object({ province, districts, wards, street, id_store, name, startTime, endTime, id });
const storeUpdateJoi = joi.object({ phone, name, email });
const customerUpdateJoi = joi.object({ phone, fullName, address, email });
const categoryJoi = joi.object({ name });
const dishJoi = joi.object({ name, price, sale, description, id_category, id_branch });
const categoryUpdateJoi = joi.object({ name, id });
const handelAction = joi.object({
    staffs,
    actions,
});
module.exports = {
    registerSchema,
    loginSchema,
    userJoi,
    customerJoi,
    customerUpdateJoi,
    handelAction,
    storeJoi,
    storeUpdateJoi,
    baranchJoi,
    branchUpdateJoi,
    categoryJoi,
    categoryUpdateJoi,
    dishJoi,
};
