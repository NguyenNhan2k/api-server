const iconMessage = document.querySelector('.icon-close');
const toast = document.querySelector('.toast');
if (iconMessage && toast) {
    iconMessage.addEventListener('click', () => {
        toast.remove();
    });
}
