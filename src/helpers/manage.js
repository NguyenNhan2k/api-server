const fs = require('fs-extra');
const removeAvatarInFolder = async (avatar, path) => {
    const pathAvatar = `${path}/${avatar}`;
    fs.remove(pathAvatar);
};
const removeArrImgInFolder = (arrImg, path) => {
    arrImg.forEach((img) => {
        const pathIg = `${path}/${img.image}`;
        fs.remove(pathIg);
    });
};
const removeArrImgInFolderNew = (arrImg, path) => {
    arrImg.forEach((img) => {
        const pathIg = `${path}/${img}`;
        fs.remove(pathIg);
    });
};
const removeAvatarForController = async (avatar) => {
    const pathAvatar = `${avatar.path}`;
    fs.remove(pathAvatar);
};
const removeArrImgForController = (arrImg) => {
    arrImg.forEach((img) => {
        const pathIg = `${img.path}`;
        fs.remove(pathIg);
    });
};
const checkOpenStore = (start, end) => {
    if (start && end) {
        const convertStart = start.split(':');
        const convertEnd = end.split(':');
        const newArrStart = convertStart.map((item) => {
            return parseInt(item);
        });
        const newArrEnd = convertEnd.map((item) => {
            return parseInt(item);
        });
        var date = new Date();
        var currtime = date.getHours() * 100 + date.getMinutes();
        const timeStart = new Date(0, 0, 0, ...newArrStart);
        const timeEnd = new Date(0, 0, 0, ...newArrEnd);
        const startTime = timeStart.getHours() * 100 + timeStart.getMinutes();
        const endTime = timeEnd.getHours() * 100 + timeEnd.getMinutes();
        return currtime > startTime && currtime < endTime;
    }
    return false;
};
module.exports = {
    removeAvatarInFolder,
    removeArrImgInFolder,
    removeArrImgForController,
    removeAvatarForController,
    removeArrImgInFolderNew,
    checkOpenStore,
};
