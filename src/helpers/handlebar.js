const Handlebars = require('Handlebars');

module.exports = {
    activeSidebar: (active, nameActive) => {
        if (active === nameActive) {
            const classList = `active`;
            return classList;
        }
        return 0;
    },
};
