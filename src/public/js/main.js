function turnOffMessage() {
    const iconMessage = document.querySelector('.icon-close');
    const toast = document.querySelector('.toast');
    if (iconMessage && toast) {
        iconMessage.addEventListener('click', () => {
            toast.remove();
        });
    }
}
let files = [],
    dragArea = document.querySelector('.drag-area'),
    input = document.querySelector('.drag-area input'),
    button = document.querySelector('.card button');
select = document.querySelector('.drag-area .select');
container = document.querySelector('.container');
function handleMutipleImage() {
    select.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
        let file = input.files;

        // if user select no image
        if (file.length == 0) return;

        for (let i = 0; i < file.length; i++) {
            if (file[i].type.split('/')[0] != 'image') continue;
            if (!files.some((e) => e.name == file[i].name)) files.push(file[i]);
        }

        input.files = null;
        showImages();
    });
    /* DRAG & DROP */
    dragArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragArea.classList.add('dragover');
    });

    /* DRAG LEAVE */
    dragArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dragArea.classList.remove('dragover');
    });

    /* DROP EVENT */
    dragArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dragArea.classList.remove('dragover');

        let file = e.dataTransfer.files;
        for (let i = 0; i < file.length; i++) {
            /** Check selected file is image */
            if (file[i].type.split('/')[0] != 'image') continue;

            if (!files.some((e) => e.name == file[i].name)) files.push(file[i]);
        }
        showImages();
    });
}
function showImages() {
    let images = files.reduce(function (prev, file, index) {
        return (prev += `<div class="image">
         <img src="${URL.createObjectURL(file)}" alt="image">
         <span onclick="delImage(${index})">&times;</span>
     </div>`);
    }, '');
    container.innerHTML = images;

    console.log();
}
function delImage(index) {
    files.splice(index, 1);
    showImages(files);
}
function slideImg() {
    const allHoverImages = document.querySelectorAll('.hover-container div img');
    const imgContainer = document.querySelector('.img-container');

    window.addEventListener('DOMContentLoaded', () => {
        allHoverImages[0].parentElement.classList.add('active');
    });

    allHoverImages.forEach((image) => {
        image.addEventListener('mouseover', () => {
            imgContainer.querySelector('img').src = image.src;
            resetActiveImg();
            image.parentElement.classList.add('active');
        });
    });
    function resetActiveImg() {
        allHoverImages.forEach((img) => {
            img.parentElement.classList.remove('active');
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
function initMap() {
    // Map option
    var options = {
        center: { lat: 38.346, lng: -0.4907 },
        zoom: 10,
    };

    //New Map
    map = new google.maps.Map(document.getElementById('map'), options);

    //listen for click on map location

    google.maps.event.addListener(map, 'click', (event) => {
        //add Marker
        addMarker({ location: event.latLng });
    });

    //Marker
    /*
    const marker = new google.maps.Marker({
    position:{lat: 37.9922, lng: -1.1307},
    map:map,
    icon:"https://img.icons8.com/nolan/2x/marker.png"
    });
    //InfoWindow
    const detailWindow = new google.maps.InfoWindow({
        content: `<h2>Murcia City</h2>`
    });
    marker.addListener("mouseover", () =>{
        detailWindow.open(map, marker);
    })
    */

    //Add Markers to Array

    let MarkerArray = [
        {
            location: { lat: 37.9922, lng: -1.1307 },
            imageIcon: 'https://img.icons8.com/nolan/2x/marker.png',
            content: `<h2>Murcia City</h2>`,
        },

        { location: { lat: 39.4699, lng: -0.3763 } },

        { location: { lat: 38.5411, lng: -0.1225 }, content: `<h2>Benidorm City</h2>` },
    ];

    // loop through marker
    for (let i = 0; i < MarkerArray.length; i++) {
        addMarker(MarkerArray[i]);
    }

    // Add Marker

    function addMarker(property) {
        const marker = new google.maps.Marker({
            position: property.location,
            map: map,
            //icon: property.imageIcon
        });

        // Check for custom Icon

        if (property.imageIcon) {
            // set image icon
            marker.setIcon(property.imageIcon);
        }

        if (property.content) {
            const detailWindow = new google.maps.InfoWindow({
                content: property.content,
            });

            marker.addListener('mouseover', () => {
                detailWindow.open(map, marker);
            });
        }
    }
}
