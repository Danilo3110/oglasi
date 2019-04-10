import '@babel/polyfill';
import renderFullAds from './ad';
import createUser from './register';
import {createAdObjects, checkUserLogIn} from './publish_ad';
import {usersAds, loadAdToForm} from './user_panel';
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
    loadFavorites();
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
                    <img src="${ad.imgUrl[0] == undefined ? './img/image-not-found.jpg' : ad.imgUrl[0]}" alt="" class="image_${ad.id}"><br>
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

function fullAds(id) {
    sessionStorage.setItem('idOfsmallAds', id);
    window.open('ad.html', '', '');
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
    setTimeout(() => {
        const adsId = fav['favorites'];
        if (localStorage.getItem('validation') && (adsId !== undefined)) {
            for (const ad of adsId) {
                $(`#fav_${ad}`).html(`<i title="Dodato u omiljene" class="fas fa-heart fa-lg onHeart"></i>`);
            }
        }}, 400);
};

async function renderFavorites() {
    const user = await getBase(`/users/${localStorage.getItem('id')}`);
    const adsId = user.favorites;
    if (adsId.length > 0) {
        let queryForRender = '';
        for (const ad of adsId) {
            queryForRender += `id=${ad}&`;
        }
        $('.item7').html(`<h1 class="ads-click-scroll">Korisnik: ${localStorage.getItem('user')} - Omiljeni oglasi:</h1>
                            <div class="user-container"></div>`);
        const adsForRender = await getBase(`/listings/?${queryForRender}`);
        (async () => await _render_small(adsForRender, '.user-container'))();
        animateFocus('.item7');
        loadFavorites();
    } else {alert('Nemate dodate omiljene oglase');}
};

function advancedSearch() {
    $('.show').slideToggle(850);
    animateFocus('#aSearch');
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
        localStorage.clear();
        sessionStorage.clear();
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
    loadFavorites();
};

function printAd() {
    const restorepage = $('body').html();
    const printcontent = $('#item7').clone();
    $('body').empty().html(printcontent);
    print();
    $('body').html(restorepage);
};

function onLoadHTML() {
    const page = location.href;
    if (page.search('/index.html') >= 0) {
        return renderAds();
    } else if (page.search('/ad.html') >= 0) {
        return renderFullAds();
    } else if (page.search('/publish_ad.html') >= 0) {
        return loadAdToForm();
    } else if (page.search('/user_panel.html') >= 0) {
        return usersAds();
    }
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
$(document).on('load', onLoadHTML(), addLogOut(), eventsAll(), animationsAll(), favorites(), loadFavorites());

export {api, getBase, animateFocus, addToFavorites, printAd, postIntoBase, _render_small, renderFavorites};
