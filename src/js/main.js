'use strict';

const serverUrl = `http://localhost:3000`;
const api = axios.create({
    baseURL: `${serverUrl}`
});
api.defaults.timeout = 4000;

async function getBase(location) {
    const responsFromBase = await api.get(`${location}`);
    return responsFromBase.data;
};

async function renderAds() {
    const listings = await getBase('/listings?_sort=id&_order=desc');
    const limitListings = listings.slice(0, 8);
    (async () => await _render_small(limitListings, '.ads-container'))();
    $('body').removeAttr('onload');
};

async function renderAllAds() {
    $('.item7').html(`<h1 class="ads-click-scroll">eKvadrat - svi oglasi:</h1><div class="ads-container"></div>`);
    const listingsAll = await getBase('/listings');
    (async () => await _render_small(listingsAll, '.ads-container'))();
    animateFocus('.ads-click-scroll');
    await setTimeout(() => {loadFavorites();}, 400);
};

async function _render_small(listings, location) {
    for (const ad of listings) {
        const users = await getBase(`/users/${ad.authorId}`);
        const $adsContainer = $(`${location}`);
        const $ad = $(`<div class="ads" id="${ad.id}">
                    <div class="ads-descr">
                    <h3>Lokacija: ${ad.city}<i class="fas fa-share-alt fa-lg"></i>
                    <span id="fav_${ad.id}"><i title="Dodaj u omiljene" class="far fa-heart fa-lg offHeart"></i></span>
                    <i class="fas fa-map-marker-alt fa-lg"></i></h3>
                    </div>
                    <img src="${ad.imgUrl[0]}" alt="" class="image_${ad.id}"><br>
                    <h2 class="ads-descr" id="ads-height">${ad.title}</h2>
                    <h3 class="ads-descr">cena: ${Number(ad.price).toLocaleString('sr-RS') == null ? ad['price-other']
                                                : Number(ad.price).toLocaleString('sr-RS') + '&euro;'}</h3>
                    <hr>
                    <h3 class="ads-descr">kontakt: ${users.mobile}</h3><br>
                    </div>`);
        $ad.appendTo($adsContainer);
        $(`.image_${ad.id}`).on('click', () => fullAds(ad.id));
        $(`#fav_${ad.id}`).on('click', addToFavorites);
    }
};

async function renderFullAds() {
    const idOfsmallAds = JSON.parse(sessionStorage.getItem('idOfsmallAds'));
    const responseListings = await api.get(`/listings/${idOfsmallAds}`);
    if (responseListings.status < 400) {
        const listings = responseListings.data;
        const users = await getBase(`/users/${listings.authorId}`);

        $('html head').find('title').text(`Šifra oglasa: ${listings.listingNumber}`);
        const pricePerM2 = Math.floor(Number(listings.price) / Number(listings.m2)).toLocaleString('sr-RS');

        const $fullContainer = $('.item7');
        const $ad = $(`<h2>${listings.title}</h2>
            <h3>${listings.city}</h3>
            <div class="single-ad-container">
            <div class="single-ad-img">
                <img src="${listings.imgUrl[0]}" alt="slika1">
                <img src="${listings.imgUrl[1]}" alt="slika2">
                <img src="${listings.imgUrl[2]}" alt="slika3">
                <img src="${listings.imgUrl[3]}" alt="slika4">
                <img src="${listings.imgUrl[4]}" alt="slika5">
            </div>
            <div class="single-ad-data">
                <div>
                    <h4>Podaci o nekretnini</h4>
                    Broj soba: ${listings.roomCount}<br><br>
                    Cena: ${Number(listings.price).toLocaleString('sr-RS') == 0 ? listings['price-other']
                            : Number(listings.price).toLocaleString('sr-RS') + '&euro;'}<br><br>
                    Sprat: ${listings.floor}/${listings.floors}<br><br>
                    Uknjiženost: ${listings.legalised}<br><br>
                    Površina: ${listings.m2}&nbsp;m&sup2;<br><br>
                    Cena po m&sup2;: ${pricePerM2 + '&euro;'} <br><br>
                    Stanje: ${listings.state}<br><br>
                    Ulica: ${listings.street}<br><br>
                    Linije JGP: ${listings.publicTransport}
                </div>
            </div>
            <div class="single-ad-seller">
                <h4>Kontakt</h4>
                <h3>${users.name}</h3>
                Adresa: ${users.address}<br><br>
                Mesto: ${users.city}<br><br>
                Tel: ${users.telephone == null ? '/' : users.telephone}<br><br>
                Tel: ${users.mobile}<br><br>
                <button type="submit">Pošalji&nbsp;poruku</button><br><br>
                <i class="fas fa-exclamation-triangle fa-lg" title="Prijavi grešku"></i>
                <i class="fas fa-print fa-lg" id="printAd" onclick="printAd()" title="Odštampaj oglas"></i>
                <i class="fas fa-share-alt fa-lg" title="Podeli oglas"></i>
                <span id="fav_${listings.id}"><i class="far fa-heart fa-lg offHeart" title="Dodaj u omiljene"></i></span>
            </div>
            <hr>
            <div class="single-ad-detailed">
                <h3>Dodatne&nbsp;informacije</h3>
                ${listings.additionalinfo}
            </div>
            <hr>
            <div class="single-ad-tour">
                <h4>Zakažite obilazak</h4>
                <div>Izaberite termin koji vama odgovara! Ostavite podatke i kontaktiraćemo vas u najkraćem mogućem
                    roku.</div>
                <div>
                    <input type="text" placeholder="ime i prezime"><br>
                    <input type="text" placeholder="email"><br>
                    <input type="text" placeholder="telefon"><br>
                    <button type="submit">Pošalji podatke</button>
                </div>
            </div>
            <div class="single-ad-map" id="map-text">
                <img src="img/jgp.PNG" alt="" srcset="">
                Lokacija stana
            </div>
            <div class="single-ad-rest">
                Šifra oglasa: ${listings.listingNumber}<br><br>
                Datum kreiranja: ${listings.listingCreated}<br><br>
                Oglas proverila agencija: ${listings.listingChecked}<br><br>
                Godina izgradnje: ${listings.yearOfConstruction}<br><br>
                Grejanje: ${listings.heating}<br><br>
                Opremljenost: ${listings.options == null ? '' : listings.options}
            </div>`);
        $ad.appendTo($fullContainer);
        animateFocus('.item6');
        $(`#fav_${listings.id}`).on('click', addToFavorites);
    }
};

const fav = {favorites: []};
async function addToFavorites() {
    const iconId = event.currentTarget.id;
    const adId = Number(iconId.slice(4, ));
    if (localStorage.getItem('validation')) {
        if ($(`#${iconId} i`).hasClass('offHeart')) {
            $(`#${iconId}`).html(`<i title="Dodato u omiljene" class="fas fa-heart fa-lg onHeart"></i>`);
            fav['favorites'].push(adId);
            await api.patch(`/users/${localStorage.getItem('id')}`, fav);
        } else {
            $(`#${iconId}`).html(`<i title="Dodaj u omiljene" class="far fa-heart fa-lg offHeart"></i>`);
            const index = fav.favorites.indexOf(adId);
            fav['favorites'].splice(index, 1);
            await api.patch(`/users/${localStorage.getItem('id')}`, fav);
        }
    }
};

async function favorites() {
    if (localStorage.getItem('validation')) {
        const user = await getBase(`/users/${localStorage.getItem('id')}`);
        const favorites = user.favorites;
        fav['favorites'] = favorites;
    }
};

function loadFavorites() {
    const adsId = fav['favorites'];
    if (localStorage.getItem('validation') && adsId.length) {
        for (const ad of adsId) {
            $(`#fav_${ad}`).html(`<i title="Dodato u omiljene" class="fas fa-heart fa-lg onHeart"></i>`);
        }
    }
};

async function renderFavorites() {
    const user = await getBase(`/users/${localStorage.getItem('id')}`);
    const adsId = user.favorites;
    let queryForRender = '';
    for (const ad of adsId) {
        queryForRender += `id=${ad}&`;
    }
    $('.item7').html(`<h2>eKorisnički panel</h2><h1 class="ads-click-scroll">Korisnik: ${localStorage.getItem('user')} - Omiljeni oglasi:</h1>
                        <div class="user-container"></div>`);
    const adsForRender = await getBase(`/listings/?${queryForRender}`);
    (async () => await _render_small(adsForRender, '.user-container'))();
    await setTimeout(() => {loadFavorites();}, 100);
};

async function usersAds() {
    const userListings = await getBase(`/listings?authorId=${localStorage.getItem('id')}`);
    $('.item7').append(`<h2>eKorisnički panel</h2><h1 class="ads-click-scroll">Korisnik: ${localStorage.getItem('user')} - oglasi:</h1>
                        <button id="showFavorites">Omiljeni&nbsp;oglasi&nbsp;</button>
                        <div class="user-container"></div>`);
    await _render_small(userListings, '.user-container');

    $('.ads').append(`<button class="editAd" type="submit">Izmeni&nbsp;oglas</button>
                    <button class="deleteAd" type="submit">Obriši&nbsp;oglas</button><br>`);
    $('.editAd').on('click', initialiseEdit);
    $('.deleteAd').on('click', () => deleteAds('Uspesno ste obrisali vaš oglas!'));
    $('#showFavorites').on('click', () => renderFavorites());
};

async function initialiseEdit() {
    const ad = event.currentTarget.parentElement.id;
    const editAds = await getBase(`/listings/${ad}`);
    delete editAds.options;
    sessionStorage.setItem('adForEdit', JSON.stringify(editAds));
    sessionStorage.setItem('adCheckLoadValidity', 1);
    sessionStorage.setItem('adId', ad);
    location.href = 'publish_ad.html';
};

function getAdForEditFromSessionStorage() {
    $('#imgUrl').remove();
    const ad = JSON.parse(sessionStorage.getItem('adForEdit'));

    $('#writeAd').find(':checkbox').each(function () {
        if (ad[this.id] === true) {
            this.checked = true;
        }
    });
    function populate(form, data) {
        $.each(data, function (key, value) {
            $(`[name = ${key}]`, form).val(value);
        });
    };
    populate('#writeAd', ad);
    sessionStorage.removeItem('adCheckLoadValidity');
    sessionStorage.removeItem('adForEdit');
    $('.item7 h2').html('Izmena oglasa');
    $('#createObjects').remove();
    $('button[type=reset]').after(`&nbsp;&nbsp;&nbsp;<button type="button" id="modifyObjects">Sačuvaj&nbsp;izmene</button>`);
    $('#modifyObjects').on('click', patch_Ads);
};

function loadAdToForm() {
    if (JSON.parse(sessionStorage.getItem('adCheckLoadValidity')) === 1) {
        $('html head').find('title').text(`Izmena oglasa`);
        getAdForEditFromSessionStorage();
    };
};

async function patch_Ads() {
    const listing = createAdObjects(false);
    await api.patch(`/listings/${sessionStorage.getItem('adId')}`, listing)
        .then((response) => alert(`Uspešno ste izmenili oglas!`))
        .catch((error) => alert(error));
    sessionStorage.removeItem('adId');
    location.href = 'user_panel.html';
};

async function deleteAds(message) {
    const ad = event.currentTarget.parentElement.id;
    if (confirm('Da li ste sigurni da želite da obrisete odabrani oglas ?')) {
        return await api.delete(`/listings/${ad}`)
            .then((response) => {alert(`${message}`); location.reload();})
            .catch((error) => {
                alert(error);
            });
    }
};

function advancedSearch() {
    $('.show').slideToggle(850);
    animateFocus('#aSearch');
};

function fullAds(id) {
    sessionStorage.setItem('idOfsmallAds', id);
    window.open('ad.html', '', '');
};

function animateFocus(toLocation) {
    $('html, body').animate({scrollTop: $(`${toLocation}`).offset().top}, 850);
};

function animationsAll() {
    $(document).ready(() => {
        $(window).scroll(() => {
            return $(window).scrollTop() > 100 ?
                $('.item1, .item2, .item3, .item4').css('background', 'rgba(55, 66, 82, 0.95)') :
                $('.item1, .item2, .item3, .item4').css('background', 'rgba(55, 66, 82, 0.7)');
        });
    });
    $(document).ready(() => {
        $('.ads-click-scroll').on('click', () => {
            $('html, body').animate({
                scrollTop: $('.ads-click-scroll').offset().top
            }, 850);
        });
    });
};

function createUser() {
    const usersObj = {};
    $("#writeAd").find("input, select").each(function () {
        usersObj[this.name] = $(this).val();
    });
    delete usersObj.passwordRepeat;

    const message = 'Uspesno ste se registrovali';
    (async () => await postIntoBase('users', usersObj, message))();
};

async function postIntoBase(location, obj, message) {
    return await api.post(`/${location}`, obj)
        .then((response) => alert(`${message}`))
        .catch((error) => {
            alert(error);
        });
};

async function userLogIn() {
    const $email = $('#userEmail').val();
    const $pass = $('#pass').val();
    const usersFromBase = await getBase(`/users`);

    for (const user of usersFromBase) {
        if (user.email === $email && user.password === $pass) {
            localStorage.setItem('validation', true);
            localStorage.setItem('id', user.id);
            localStorage.setItem('user', user.name);
        }
    }
    if (JSON.parse(localStorage.getItem('validation'))) {
        alert(`Uspesno ste se ulogovali!\nDobro došao/la ${localStorage.getItem('user')}`);
        location.href = 'index.html';
    } else {
        $('#userEmail').css('border', '1.5px solid rgb(250, 100, 100)');
        $('#pass').css('border', '1.5px solid rgb(250, 100, 100)');
        $('#alert').html(`Nije dobar unos podataka za login`).css('color', 'rgb(250, 100, 100)');
    }
};

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
        (async () => await postIntoBase('listings', listingsObj, message))();
    } else return listingsObj;
};

function checkUserLogIn() {
    return localStorage.getItem('validation') ? location.href = 'publish_ad.html' :
        alert('Da bi dodali novi oglas, morate biti ulogovani!');
};

function goToUserPanel() {
    if (localStorage.getItem('validation')) {
        location.href = 'user_panel.html';
    } else {
        alert('Da bi koristili korisnički panel, morate biti ulogovani!');
    }
};

function addLogOut() {
    if (localStorage.getItem('validation')) {
        $('#logIn-out').html(`<i title="Odjavi se" class="fas fa-sign-out-alt fa-lg"></i>`);
    } else {
        $('#logIn-out').html(`<i title="Prijava korisnika" class="fas fa-sign-in-alt fa-lg"></i>`);
    }
};

function logInOut() {
    if (localStorage.getItem('validation')) {
        localStorage.removeItem('validation');
        localStorage.removeItem('id');
        localStorage.removeItem('user');
        sessionStorage.removeItem('adId');
        addLogOut();
        alert('Uspesno ste se izlogovali!');
        location.href = 'index.html';
    } else {
        $(this).next('#login-content').slideToggle(500);
    }
};

async function searchAds(location, animation) {
    const inputsAll = {};
    $('#advancedSearch, #basicSearch').find('input:not(:checkbox), select').each(function () {
        if (this.value !== '') {
            inputsAll[this.id] = this.value;
        }
    });
    $('#advancedSearch').find('input:checked').each(function () {
        inputsAll[this.id] = this.checked;
    });
    const response = await api.get(`/listings`, {params: inputsAll});
    const listingsFiltered = response.data;

    $(`${location}`).html('');
    $(`${animation}`).html('Rezultati pretrage:');
    animateFocus(`${animation}`);
    (async () => await _render_small(listingsFiltered, `${location}`))();
    await setTimeout(() => {loadFavorites();}, 100);
};

function printAd() {
    const restorepage = $('body').html();
    const printcontent = $('#item7').clone();
    $('body').empty().html(printcontent);
    print();
    $('body').html(restorepage);
};

function eventsAll() {
    $('#ads_showAll').on('click', renderAllAds);
    $('#aSearch, #closeSearch').on('click', advancedSearch);
    $('.item4 button').on('click', checkUserLogIn);
    $('#userPanel').on('click', goToUserPanel);
    $('#logIn').on('click', userLogIn);
    $('#createUser').on('click', createUser);
    $('#logIn-out').on('click', logInOut);
    $('#createObjects').on('click', () => createAdObjects());
    $('#searchAdsAll, #searchAdsAll_2').on('click', () => searchAds('.ads-container', '.ads-click-scroll'));
    $('#ad_searchAdsAll, #ad_searchAdsAll_2').on('click', () => {
        $('.item7').html(`<h1 class="ads-click-scroll"></h1>
                            <div class="user-container"></div>`);
        searchAds('.user-container', '.ads-click-scroll')
    });
};
$(document).on('load', addLogOut(), eventsAll(), animationsAll(), favorites(), setTimeout(() => {loadFavorites();}, 400));
