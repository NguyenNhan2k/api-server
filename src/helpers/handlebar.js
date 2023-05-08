const Handlebars = require('Handlebars');
const { TIME } = require('sequelize');
const handlebar = {
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
        return firt == second ? 'selected="selected"' : '';
    },
    count: (payload) => {
        return payload ? payload.length : 0;
    },
    countTwoArr: (payloads) => {
        if (payloads) {
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
    getAddresForUiBranch: (address) => {
        if (address) {
            const output = ` <a>${address.street}, ${address.ward}, ${address.district}, ${address.province}</a>`;
            return new Handlebars.SafeString(output);
        }
    },
    displayUiTotalBranch: (rates) => {
        const objRate = handlebar.getTotalRate(rates);

        const output = `<li class='total'>
            <p>${objRate.totalRate}</p>
        </li>
        <li>
            <h3>${objRate.location}</h3>
            <p>Vị trí</p>
        </li>

        <li>
            <h3>${objRate.price}</h3>
            <p>Giá cả</p>
        </li>
        <li>
            <h3>${objRate.quality}</h3>
            <p>Chất lượng</p>
        </li>
        <li>
            <h3>${objRate.servi}</h3>
            <p>Phục vụ</p>
        </li>
        <li>
            <h3>${objRate.space}</h3>
            <p>Không gian</p>
        </li>
        <li class='total-comment'>
            <h3>${objRate.countComment}</h3>
            <p>Bình luận</p>
        </li>`;
        return new Handlebars.SafeString(output);
    },
    getTotalRates: (rates) => {
        if (rates) {
            const { totalRate } = handlebar.getTotalRate(rates);
            return totalRate;
        }
    },
    displayUiTotalRatingBranch: (rates) => {
        const objRate = handlebar.getTotalRate(rates);
        const countStart = Math.ceil(objRate.totalRate / 2);
        const countStartChecked = 5 - countStart;
        let elementStart = '';
        for (let i = 1; i <= countStart; i++) {
            elementStart += ` <span class='fa fa-star checked'></span>`;
        }
        for (let i = 1; i <= countStartChecked; i++) {
            elementStart += `<span class='fa fa-star'></span>`;
        }

        const output = `   <div class='user-raing'>
        <span class='heading'>User Rating</span>
       ${elementStart}
        <p>${objRate.totalRate} average based on ${objRate.countComment} reviews.</p>
    </div>
    <div class='row'>
        <div class='detail-row'>
            <div class='side'>
                <p>Vị trí</p>
            </div>
            <div class='middle'>
                <div class='bar-container'>
                    <div class='bar-5' style='width: ${objRate.location * 10}%;'></div>
                </div>
            </div>
            <div class='side right'>
                <p>${objRate.location}</p>
            </div>
        </div>
        <div class='detail-row'>
            <div class='side'>
                <p>Giá cả</p>
            </div>
            <div class='middle'>
                <div class='bar-container'>
                    <div class='bar-4' style='width: ${objRate.price * 10}%;'></div>
                </div>
            </div>
            <div class='side right'>
                <p>${objRate.price}</p>
            </div>
        </div>
        <div class='detail-row'>
            <div class='side'>
                <p>Chất lượng</p>
            </div>
            <div class='middle'>
                <div class='bar-container'>
                    <div class='bar-3' style='width: ${objRate.quality * 10}%;'></div>
                </div>
            </div>
            <div class='side right'>
                <p>${objRate.quality}</p>
            </div>
        </div>
        <div class='detail-row'>
            <div class='side'>
                <p>Phục vụ</p>
            </div>
            <div class='middle'>
                <div class='bar-container'>
                    <div class='bar-2' style='width: ${objRate.servi * 10}%;'></div>
                </div>
            </div>
            <div class='side right'>
                <p> ${objRate.servi}</p>
            </div>
        </div>
        <div class='detail-row'>
            <div class='side'>
                <p>Không gian</p>
            </div>
            <div class='middle'>
                <div class='bar-container'>
                    <div class='bar-1' style='width: ${objRate.space * 10}%;'></div>
                </div>
            </div>
            <div class='side right'>
                <p>${objRate.space}</p>
            </div>
        </div>
    </div>`;
        return new Handlebars.SafeString(output);
    },
    displayUiTotalRatingBranchMain: (rates) => {
        const objRate = handlebar.getTotalRate(rates);
        let countStart = Math.ceil(objRate.totalRate / 2);
        const startHalf = objRate.totalRate % 2;
        let countStartChecked = 5 - countStart;
        let elementStart = '';
        // <i class='fa-solid fa-star-half-stroke'></i>
        for (let i = 1; i <= countStart; i++) {
            elementStart += ` <i class='fa-solid fa-star'></i>`;
        }
        if (startHalf > 0) {
            countStartChecked--;
            elementStart += ` <i class='fa-solid fa-star-half-stroke'></i>`;
        }
        for (let i = 1; i <= countStartChecked; i++) {
            elementStart += `<i class="fa-regular fa-star"></i>`;
        }
        if (!countStart) {
            elementStart += `<i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>`;
        }
        const output = `  
       ${elementStart}
    `;
        return new Handlebars.SafeString(output);
    },
    getCountComment: (rates) => {
        if (rates) {
            const { countComment } = handlebar.getTotalRate(rates);
            return countComment;
        }
    },
    displayTotalRating: (rates) => {
        const { totalRate } = handlebar.getTotalRate(rates);
        let statusRate = '';
        if (totalRate <= 2.5) {
            statusRate += 'Tệ';
        }
        if (totalRate > 2.5 && totalRate <= 5) {
            statusRate += 'Bình thường';
        }
        if (totalRate > 5 && totalRate <= 7.5) {
            statusRate += 'Khá tốt';
        }
        if (totalRate > 7.5) {
            statusRate += 'Rất tốt';
        }
        const output = ` <b>${totalRate} điểm </b>
        <p>-</p>
        <p> ${statusRate}</p>`;
        return new Handlebars.SafeString(output);
    },
    getTotalRate: (rates) => {
        let objRate = {};
        if (rates) {
            let location = 0.0;
            let price = 0.0;
            let quality = 0.0;
            let servi = 0.0;
            let space = 0.0;
            let count = 0.0;
            let countComment = rates.length;
            rates.forEach((rate) => {
                location += rate.location;
                price += rate.price;
                quality += rate.quality;
                space += rate.space;
                servi += rate.servi;
                count++;
            });
            location = location / count;
            price = price / count;
            quality = quality / count;
            space = space / count;
            servi = servi / count;
            totalRate = (location + price + quality + space + servi) / 5;
            objRate = {
                location,
                price,
                quality,
                space,
                servi,
                totalRate,
                countComment,
            };

            return objRate;
        }
        return objRate;
    },
    getStatusTime: (start, end) => {
        if (start && end) {
            const convertStart = start.split(':');
            const convertEnd = end.split(':');
            const newArrStart = convertStart.map((item) => {
                return parseInt(item);
            });
            const newArrEnd = convertEnd.map((item) => {
                return parseInt(item);
            });
            var d = new Date();
            var currtime = d.getHours() * 100 + d.getMinutes();
            const timeStart = new Date(0, 0, 0, ...newArrStart);
            const timeEnd = new Date(0, 0, 0, ...newArrEnd);
            const startTime = timeStart.getHours() * 100 + timeStart.getMinutes();
            const endTime = timeEnd.getHours() * 100 + timeEnd.getMinutes();
            if (currtime > startTime && currtime < endTime) {
                return new Handlebars.SafeString(`<p class = "open"> Đang mở cửa </p>`);
            } else {
                return new Handlebars.SafeString(`<p class = "close"> Đóng cửa</p>`);
            }
        }
    },
    displayTimeBranch: (start, end) => {
        if (start && end) {
            const convertStart = start.split(':');
            const convertEnd = end.split(':');

            const output = `${convertStart[0]}:${convertStart[1]} - ${convertEnd[0]}:${convertEnd[1]}`;
            return output;
        }
    },
    getPrice: ([{ minPrice, maxPrice }]) => {
        const config = { style: 'currency', currency: 'VND' };
        const maxVNG = new Intl.NumberFormat('vi-VN', config).format(maxPrice);
        const minVNG = new Intl.NumberFormat('vi-VN', config).format(minPrice);
        return `${minVNG} - ${maxVNG}`;
    },
    getComment: (rates) => {
        if (rates) {
            return rates.length;
        }
        return 0;
    },
    getTotalOneRate: (rate) => {
        if (rate) {
            const { location, price, quality, space, servi } = rate;
            const totalRate = (location + price + quality + space + servi) / 5.0;
            return totalRate;
        }
        return 0;
    },
};
module.exports = handlebar;
