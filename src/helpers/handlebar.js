const Handlebars = require('Handlebars');

module.exports = {
    activeSidebar: (active, nameActive) => {
        if (active === nameActive) {
            const classList = `active`;
            return classList;
        }
        return 0;
    },
    sortable: (field, sort, page) => {
        const isType = ['asc', 'desc'];
        const sortType = field === sort.column && isType.includes(sort.type) ? sort.type : 'default';
        const icons = {
            default: 'fa-solid fa-sort sort',
            asc: 'fa-solid fa-arrow-down-wide-short',
            desc: `fa-solid fa-arrow-up-wide-short`,
        };
        const types = {
            default: 'desc',
            asc: 'desc',
            desc: 'asc',
        };
        const icon = icons[sortType];
        const type = types[sortType];
        const href = Handlebars.escapeExpression(`?_sort&column=${field}&type=${type}&page=${page.index}`);
        const output = `
            <a href="${href}"><i class="${icon}"></i> </a>`;
        return new Handlebars.SafeString(output);
    },
    pageView: (page, countPage) => {
        const indexPage = [];
        for (let i = 1; i < countPage + 1; i++) {
            indexPage.push(`<a class =${page.index == i ? '"active"' : '""'} href='?page=${i}'>${i}</a>`);
        }
        const prePage = page.index === 1 ? page.index : page.index - 1;
        const nextPage = page.index === countPage ? 1 : page.index + 1;
        const newOutput = `
                <a href='?page=${prePage}'>&laquo;</a>
                ${indexPage.join('')}
                <a href='?page=${nextPage}'>&raquo;</a>
        `;
        return newOutput;
        // const output = index + 1 === page.pageIndex ? 'paging_ground' + page.select : 'paging_ground';
    },
    autoIncrement: (preIndex, index) => {
        return preIndex + index;
    },
    convertToDate: (date) => {
        const result = new Date(date);
        return result.toLocaleString();
    },
    convertToVND: (payload) => {
        const config = { style: 'currency', currency: 'VND' };
        const formated = new Intl.NumberFormat('vi-VN', config).format(payload);
        return formated;
    },
    sale: (exportPrice, sale) => {
        const priceSale = (exportPrice * sale) / 100;
        const priceExport = exportPrice - priceSale;
        const config = { style: 'currency', currency: 'VND' };
        const formated = new Intl.NumberFormat('vi-VN', config).format(priceExport);
        return formated;
    },
    defaultSelect: (firt, second) => {
        console.log(firt, second);
        return firt == second ? 'selected="selected"' : '';
    },
    count: (payload) => {
        return payload ? payload.length : 0;
    },
    countTwoArr: (payloads) => {
        if (payloads) {
            console.log(payloads);
            const quantity = payloads.reduce((acc, cur) => {
                return acc + cur.rates.length;
            }, 0);
            return quantity;
        } else {
            return 0;
        }
    },
    countImgs: (payloads) => {
        if (payloads) {
            const quantity = payloads.reduce((acc, cur) => {
                return acc + cur.rates.length;
            }, 0);
            return quantity;
        } else {
            return 0;
        }
    },
    getName: (rate) => {
        if (rate) {
            return rate[0].customer.fullName;
        }
        return 'NoE';
    },
    getContent: (rate) => {
        if (rate) {
            return rate[0].content;
        }
        return 'Trống!';
    },
    getAvatar: (rate) => {
        if (rate) {
            return rate[0].customer.url_img;
        }
        return 'Trống!';
    },
    map: (address) => {
        if (address) {
            return new Handlebars.SafeString(address);
        }
    },
};
