const Handlebars = require('Handlebars');

module.exports = {
    activeSidebar: (active, nameActive) => {
        if (active === nameActive) {
            const classList = `active`;
            return classList;
        }
        return 0;
    },
    sortable: (field, sort) => {
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
        const href = Handlebars.escapeExpression(`?_sort&column=${field}&type=${type}`);
        const output = `
            <a href="${href}"><i class="${icon}"></i> </a>`;
        return new Handlebars.SafeString(output);
    },
};
