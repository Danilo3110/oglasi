import {postIntoBase} from './main';

function createAdObjects(post = true) {
    const listingsObj = {};
    const option = [];
    const imgUrls = [];

    const currentDate = new Date();
    const listingCreated = currentDate.toLocaleString('sr-RS');
    const randomCheckingTime = Math.floor(Math.random() * Math.floor(24));
    const listingChecked = new Date(currentDate.setHours(currentDate.getHours() + randomCheckingTime)).toLocaleString('sr-RS');
    listingsObj['listingCreated'] = listingCreated;
    listingsObj['listingChecked'] = listingChecked;

    if (post) {
        const listingNumber = Math.floor(Math.random() * 999);
        listingsObj['listingNumber'] = listingNumber;
    }
    listingsObj['authorId'] = JSON.parse(localStorage.getItem('id'));

    $('#writeAd').find('input:not(:checkbox), textarea, select').each(function () {
        listingsObj[this.name] = $(this).val();
    });
    $('#writeAd').find('input[type="number"]').each(function () {
        listingsObj[this.name] = Number($(this).val());
    });
    $('#writeAd').find(':checkbox').each(function () {
        if ($(this).is(':checked')) {
            listingsObj[this.id] = true;
            option.push(this.value);
            listingsObj['options'] = option.join(', ');
        } else {
            listingsObj[this.id] = false;
        }
    });
    if (post) {
        const files = $("#imgUrl")[0].files;
        for (const i of files) {
            imgUrls.push('img/' + i.name);
            listingsObj.imgUrl = imgUrls;
        }
        const message = 'Uspesno ste dodali novi oglas';
        (async () => {await postIntoBase('listings', listingsObj, message); await (location.href = 'user_panel.html');})();
    } else return listingsObj;
};

function checkUserLogIn() {
    return localStorage.getItem('validation') ? location.href = 'publish_ad.html' :
        alert('Da bi dodali novi oglas, morate biti ulogovani!');
};

export {createAdObjects, checkUserLogIn};
