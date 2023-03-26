const handleClickSidebar = () => {
    const allSideMenu = document.querySelectorAll('#sidebar .sidebar-menu li a');
    if (allSideMenu) {
        allSideMenu.forEach((item) => {
            const liItem = item.parentElement;
            liItem.addEventListener('click', () => {
                allSideMenu.forEach((item) => {
                    item.parentElement.classList.remove('active');
                });
                liItem.classList.add('active');
            });
        });
    }
};
const sidebar = document.querySelector('#sidebar');
const toggleMenu = () => {
    const menu = document.querySelector('#content nav i');
    menu.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
    });
};

function main() {
    handleClickSidebar();
    toggleMenu();
    if (window.innerWidth < 768) {
        sidebar.classList.add('hidden');
    } else if (window.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
}
main();
