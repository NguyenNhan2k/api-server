const handleClickSidebar = () => {
    const allSideMenu = document.querySelectorAll('#sidebar .sidebar-menu li a');
    if (allSideMenu) {
        allSideMenu.forEach((item) => {
            const liItem = item.parentElement;
            liItem.addEventListener('click', () => {
                allSideMenu.forEach((item) => {
                    item.parentElement.classList.remove('active');
                });
            });
        });
    }
};
const toggleMenu = () => {
    const sidebar = document.querySelector('#sidebar');
    const menu = document.querySelector('#content nav i');
    menu.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
    });
};
var eleModal = document.querySelector('#modal');
const closeModal = (close, btnClose, active, modalTitle, modalText) => {
    const modalTextEle = document.querySelector('.modal-body__text');
    const modalTitleEle = document.querySelector('.modal-title');
    const eleClose = document.querySelector(close);
    const buttonClose = document.querySelector(btnClose);
    const eleActives = document.querySelectorAll(active);
    if (eleClose && eleActives) {
        eleActives.forEach((item) => {
            const dataId = item.getAttribute('data-id');
            const dataActions = item.getAttribute('data-actions');
            const dataTable = item.getAttribute('data-table');
            item.addEventListener('click', () => {
                (modalTextEle.innerHTML = modalText), (modalTitleEle.innerHTML = modalTitle);
                eleModal.style.display = 'flex';
                eleModal.setAttribute('data-id', dataId);
                eleModal.setAttribute('data-actions', dataActions);
                eleModal.setAttribute('data-table', dataTable);
                formDelete();
            });
        });

        eleClose.addEventListener('click', () => {
            eleModal.style.display = 'none';
        });
        buttonClose.addEventListener('click', () => {
            eleModal.style.display = 'none';
        });
    }
};
const formDelete = () => {
    const formEle = document.querySelector('#deleteOne');
    const btnSubmitEl = document.querySelector('.btn-primary');
    if ((formEle, btnSubmitEl)) {
        const dataId = eleModal.getAttribute('data-id');
        const action = eleModal.getAttribute('data-actions');
        const table = eleModal.getAttribute('data-table');
        switch (action) {
            case 'destroy':
                formEle.action = `/${table}/destroy/${dataId}?_method=DELETE`;
                btnSubmitEl.addEventListener('click', () => {
                    formEle.submit();
                });
                break;
            case 'force':
                formEle.action = `/${table}/force/${dataId}?_method=DELETE`;
                btnSubmitEl.addEventListener('click', () => {
                    formEle.submit();
                });
                break;
        }
    }
};
const addDistricts = (arr) => {
    const districtEle = document.querySelector('#districts');
    arr.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.name;
        option.setAttribute('class', 'district');
        option.innerText = item.name;
        districtEle.add(option);
    });
};
const handelSelectWard = (district) => {
    const districtEle = document.querySelector('#districts');
    const wardsEle = document.querySelector('#wards');
    districtEle.addEventListener('change', (event) => {
        const valueDistrict = event.target.value;

        for (let i = 0; i < wardsEle.length; i++) {
            wardsEle.remove(i);
        }

        const indexDistrict = district.filter((item) => {
            return item.name == valueDistrict;
        });
        indexDistrict[0].wards.forEach((ward) => {
            const option = document.createElement('option');
            option.value = ward;
            option.innerText = ward;
            wardsEle.add(option);
        });
    });
};
const getAddress = async () => {
    try {
        const response = await fetch('https://provinces.open-api.vn/api/?depth=3');
        const jsonData = await response.json();
        const tinhCanTho = jsonData.filter((item) => {
            if (item.code == 92) {
                return item;
            }
        });
        const districts = tinhCanTho[0].districts.map((item) => {
            const wards = item.wards.map((ward) => {
                return ward.name;
            });
            return {
                name: item.name,
                codename: item.codename,
                wards,
            };
        });
        addDistricts(districts);
        handelSelectWard(districts);
        console.log(districts);
    } catch (error) {
        console.log(error);
        return 0;
    }
};
const handelCheckedBox = (nameInput) => {
    var submitElement = document.querySelector('.submit');
    var checkAll = document.querySelector('#checkAll');
    var checkInputs = document.querySelectorAll('.form-check-input');
    console.log(checkInputs);
    if (checkAll) {
        checkAll.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            for (let i = 0; i < checkInputs.length; i++) {
                checkInputs[i].checked = isChecked;
            }
            renderSubmitBtn();
        });
    }
    for (let i = 0; i < checkInputs.length; i++) {
        checkInputs[i].addEventListener('change', (e) => {
            const countInputChecked = document.querySelectorAll(nameInput).length;
            const isChecked = checkInputs.length === countInputChecked;
            checkAll.checked = isChecked;
            renderSubmitBtn();
        });
    }
    function renderSubmitBtn() {
        const countChecked = document.querySelectorAll(nameInput).length;
        if (countChecked > 0) {
            submitElement.removeAttribute('disabled');
        } else {
            submitElement.setAttribute('disabled', 'disabled');
        }
    }
};

function main() {
    toggleMenu();
    if (window.innerWidth < 768) {
        sidebar.classList.add('hidden');
    }
    //else if (window.innerWidth > 576) {
    //     searchButtonIcon.classList.replace('bx-x', 'bx-search');
    //     searchForm.classList.remove('show');
    // }
}
main();
