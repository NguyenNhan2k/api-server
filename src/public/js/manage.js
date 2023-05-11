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
    if (menu) {
        menu.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
        });
    }
};
var eleModal = document.querySelector('#modal');
// closeModal('.close','.btn-secondary','#delete-branchs','Xóa chi nhánh','Bạn có chắc chắn muốn xóa trường này?');
const closeModal = (close, btnClose, active, modalTitle, modalText) => {
    console.log(eleModal);
    const modalTextEle = document.querySelector('.modal-body__text');
    const modalTitleEle = document.querySelector('.modal-title');
    const eleClose = document.querySelector(close);
    const buttonClose = document.querySelector(btnClose);
    const eleActives = document.querySelectorAll(active);
    console.log(eleActives);
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
const handleSelectFilter = (districts, eleSelect) => {
    if (districts) {
        districts.forEach((district) => {
            const option = document.createElement('option');
            option.value = district;
            option.innerText = district;
            eleSelect.add(option);
        });
    }
};
const increaseQuanlity = (parentSelect) => {
    const minus = document.querySelectorAll('.minus');
    const plus = document.querySelectorAll('.plus');
    if (plus && minus) {
        minus.forEach((item) => {
            item.addEventListener('click', () => {
                const parent = getParent(item, parentSelect);
                const input = parent.querySelector('#quanlity');
                const value = parseInt(input.value) - 1;
                input.value = value >= 1 ? value : 1;
            });
        });
        plus.forEach((item) => {
            item.addEventListener('click', () => {
                const parent = getParent(item, parentSelect);
                const input = parent.querySelector('#quanlity');
                const value = parseInt(input.value) + 1;
                input.value = value;
            });
        });
    }
};
const removeElement = (elementRemove, parentElement) => {
    const remove = document.querySelectorAll(elementRemove);
    if (remove) {
        remove.forEach((item) => {
            item.addEventListener('click', () => {
                const parent = getParent(item, parentElement);
                parent.remove();
            });
        });
    }
};
const getDistricts = async (select) => {
    try {
        const eleSelect = await document.querySelector('#district');
        const response = await fetch('https://provinces.open-api.vn/api/?depth=3');
        const jsonData = await response.json();
        const tinhCanTho = await jsonData.filter((item) => {
            if (item.code == 92) {
                return item;
            }
        });
        const districts = tinhCanTho[0].districts.map((item) => {
            return item.name;
        });
        console.log(districts);
        handleSelectFilter(districts, eleSelect);
    } catch (error) {
        return 0;
    }
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

function handleImgComment() {
    let files = [],
        input = document.querySelector('.image-comment input'),
        container = document.querySelector('.list-img');
    input.addEventListener('change', () => {
        let file = input.files;
        // if user select no image
        if (file.length == 0) return;

        for (let i = 0; i < file.length; i++) {
            if (file[i].type.split('/')[0] != 'image') continue;
            if (!files.some((e) => e.name == file[i].name)) files.push(file[i]);
        }
        input.files = null;
        console.log('oday');
        showImgcomment(files, container);
    });
}
function showImgcomment(files, container) {
    let images = files.reduce(function (prev, file, index) {
        console.log(URL.createObjectURL(file));
        return (prev += `<div class='detail-img'>
            <img src='${URL.createObjectURL(file)}' alt='' />
            <span onclick="delImg(${index})" aria-hidden='true'>&times;</span>
        </div>`);
    }, '');
    container.innerHTML = images;
}

function delImg(index) {
    let container = document.querySelector('.list-img');
    files.splice(index, 1);
    showImgcomment(files, container);
}

function getParent(element, selector) {
    while (element.parentElement) {
        if (element.parentElement.matches(selector)) {
            return element.parentElement;
        }
        element = element.parentElement;
    }
}
function handleInputRates(selectRange) {
    const rangeElements = document.querySelectorAll(selectRange);
    if (rangeElements) {
        rangeElements.forEach((range) => {
            range.addEventListener('input', (e) => {
                const value = e.target.value;
                const parentForm = getParent(range, '.detail-row');
                const textRange = parentForm.querySelector('.value-range');
                textRange.innerHTML = value;
            });
        });
    }
}
