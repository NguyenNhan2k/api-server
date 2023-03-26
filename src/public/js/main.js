function turnOffMessage() {
    const iconMessage = document.querySelector('.icon-close');
    const toast = document.querySelector('.toast');
    if (iconMessage && toast) {
        iconMessage.addEventListener('click', () => {
            toast.remove();
        });
    }
}
function handleImage() {
    const uploadImage = document.querySelector('.image');
    const image = document.querySelector('.img');
    if (uploadImage && image) {
        uploadImage.addEventListener('change', (event) => {
            console.log(event.target.value);
            const reader = new FileReader();
            reader.onload = () => {
                image.setAttribute('src', reader.result);
            };
            reader.readAsDataURL(uploadImage.files[0]);
        });
    }
}
function getNameUser() {
    let userName = document.cookie;
    const userElement = document.querySelector('.signup__account');
    if (userName && userElement) {
        userElement.innerHTML = `
        <i class='fa-solid fa-user icon-user'></i>
        <a class='my-account__title' href='#'>My account</a>
        <i class='fa-sharp fa-solid fa-caret-down'></i>
        <ul class='popup_account-list'>
            <li class='popup_account-item'><a href='/customer/profile'>My profile</a></li>
            <li class='popup_account-item'><a href='#'>Change password</a></li>
            <li class='popup_account-item'><a href='/customer/logout'>Log out</a></li>
        </ul>`;
    } else {
        userElement.innerHTML = `
        <i class='fa-solid fa-user icon-user'></i>
        <a href='/auth/login'>Login</a>`;
    }
    console.log(userName);
}
