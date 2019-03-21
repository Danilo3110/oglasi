'use strict';

const serverUrl = `http://localhost:3000`;
const api = axios.create({
    baseURL: `${serverUrl}`
});
api.defaults.timeout = 4000;

async function renderAds() {
    const responseListings = await api.get(`/listings`);
    const listings = responseListings.data;
    const listingsOrder = listings.sort((a, b) => (a.id < b.id) ? 1 : -1);
    for (const ad of listingsOrder) {
        const responseUsers = await api.get(`/users/${ad.authorId}`);
        const users = responseUsers.data;
        const $adsContainer = $('.ads-container');
        const $ad = $(`<div class="ads" id="${ad.id}">
                        <div class="ads-descr">
                        <h3>Lokacija: ${ad.city}<i class="fas fa-share-alt fa-lg"></i><i class="far fa-heart fa-lg"></i>
                        <i class="fas fa-map-marker-alt fa-lg"></i></h3>
                        </div>
                        <img src="${ad.imgUrl[0]}" alt=""><br>
                        <h2 class="ads-descr">${ad.title}</h2>
                        <h3 class="ads-descr">cena: ${Number(ad.price).toLocaleString('sr-RS') == null ? ad['price-other']
                                                    : Number(ad.price).toLocaleString('sr-RS') + '&euro;'}</h3>
                        <hr>
                        <h3 class="ads-descr">kontakt: ${users.mobile}</h3>
                        </div>`);
        $ad.appendTo($adsContainer);
        $(`#${ad.id}`).on('click', () => fullAds(ad.id));
    }
};

async function renderFullAds() {
    const idOfsmallAds = JSON.parse(sessionStorage.getItem('idOfsmallAds'));
    const responseListings = await api.get(`/listings/${idOfsmallAds}`);
    if (responseListings.status < 400) {
        const listings = responseListings.data;

        const responseUsers = await api.get(`/users/${listings.authorId}`);
        const users = responseUsers.data;

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
                <i class="fas fa-exclamation-triangle" title="Prijavi grešku"></i>
                <i class="fas fa-print" title="Odštampaj oglas"></i>
                <i class="fas fa-share-alt" title="Podeli oglas"></i>
                <i class="fas fa-heart" title="Dodaj u omiljene"></i>
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
        $('html, body').animate({
            scrollTop: $('.item6').offset().top
        }, 850)
    }
};

$(document).on('load', renderAds());

function advancedSearch() {
    $('.show').slideToggle(850);
    $('html, body').animate({
        scrollTop: $('#aSearch').offset().top
    }, 850);
};

$('#aSearch, #closeSearch').click(advancedSearch);

function fullAds(id) {
    sessionStorage.setItem('idOfsmallAds', id);
    window.open('ad.html', '', '');
};

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

function createUser() {
    const usersObj = {};

    $("#writeAd").find("input, select").each(function () {
        usersObj[this.name] = $(this).val();
    });
    delete usersObj.passwordRepeat;
    console.log(usersObj);

    (async () => {postUsers(usersObj);})();
};

async function postUsers(obj) {
    return await api.post('/users', obj)
        .then((response) => alert(`Uspesno ste se registrovali`))
        .catch((error) => {
            alert(error);
        });
};

async function userLogIn() {
    const email = $('#userEmail').val();
    const pass = $('#pass').val();
    const response = await api.get(`/users`);
    const usersFromBase = response.data;

    for (const user of usersFromBase) {
        if (user.email === email && user.password === pass) {
            localStorage.setItem('validation', true);
            localStorage.setItem('id', user.id);
        }
    }
    if (JSON.parse(localStorage.getItem('validation'))) {
        alert(`Uspesno ste ulogovani!`);
    } else {
        $('#userEmail').css('background', 'rgba(255, 0, 0, 0.4)');
        $('#pass').css('background', 'rgba(255, 0, 0, 0.4)');
        alert(`Nije dobar unos podataka za login!`);
    }
};

function createAdObjects() {
    const listingsObj = {};
    const option = [];
    const imgUrls = [];
    const files = $("#imgUrl")[0].files;

    const currentDate = new Date();
    const listingCreated = currentDate.toLocaleString('sr-RS');
    const randomCheckingTime = Math.floor(Math.random() * Math.floor(24));
    const listingChecked = new Date(currentDate.setHours(currentDate.getHours() + randomCheckingTime)).toLocaleString('sr-RS');
    listingsObj['listingCreated'] = listingCreated;
    listingsObj['listingChecked'] = listingChecked;

    const listingNumber = Math.floor(Math.random() * 999);
    listingsObj['listingNumber'] = listingNumber;
    listingsObj['authorId'] = JSON.parse(localStorage.getItem('id'));

    $("#writeAd").find("input:not(:checkbox), textarea, select").each(function () {
        listingsObj[this.name] = $(this).val();
    });

    $('#writeAd').find('input:checked').each(function () {
        option.push(this.value);
        listingsObj['options'] = option.join(', ');
    });

    for (const i of files) {
        imgUrls.push('img/' + i.name);
        listingsObj.imgUrl = imgUrls;
    };
    //Object.entries(listingsObj).sort().reduce((o, [k, v]) => (o[k] = v, o), {})
    (async () => {return await postAds(listingsObj);})();
};

async function postAds(obj) {
    return await api.post('/listings', obj)
        .then((response) => alert(`Uspesno ste dodali novi oglas`))
        .catch((error) => {
            alert(error);
        });
};

async function deleteAds() {
    return await api.delete('/listings/' + 9)
        .then((response) => alert(`Uspesno ste obrisali oglas`))
        .catch((error) => {
            alert(error);
        });
};
