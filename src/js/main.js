'use strict';

const serverUrl = `http://localhost:3000`;
const api = axios.create({
    baseURL: `${serverUrl}`
});
api.defaults.timeout = 4000;

async function renderAds() {
    const responseListings = await api.get(`/listings`);
    const listings = responseListings.data;
    for (const ad of listings) {
        const responselistingSeller = await api.get(`/listingSeller/${ad.authorId}`);
        const listingSeller = responselistingSeller.data;
        const $adsContainer = $('.ads-container');
        const $ad = $(`<div class="ads" id="${ad.id}">
                        <div class="ads-descr">
                        <h3>Lokacija: ${ad.city}<i class="fas fa-share-alt fa-lg"></i><i class="far fa-heart fa-lg"></i>
                        <i class="fas fa-map-marker-alt fa-lg"></i></h3>
                        </div>
                        <img src="${ad.imgUrl}" alt=""><br>
                        <h2 class="ads-descr">${ad.street}, ${ad.state}, ${ad.m2}</h2>
                        <h3 class="ads-descr">cena: ${ad.price.toLocaleString('sr-RS') == 0 ? 'po dogovoru'
                : ad.price.toLocaleString('sr-RS') + '&euro;'}</h3>
                        <hr>
                        <h3 class="ads-descr">kontakt: ${listingSeller.sellerPhone}</h3>
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

        const responseListingDescriptions = await api.get(`/listingDescriptions/${listings.descriptionId}`);
        const listingD = responseListingDescriptions.data;
        const responseListingSeller = await api.get(`/listingSeller/${listingD.authorId}`);
        const listingS = responseListingSeller.data;

        const $fullContainer = $('.item7');
        const $ad = $(`<h2>${listings.street}, ${listings.m2}, ${listings.state}</h2>
            <h3>${listings.city}</h3>
            <div class="single-ad-container">
            <div class="single-ad-img">
                <img src="${listings.imgUrl}" alt="">
                <img src="${listings.imgUrl}" alt="">
                <img src="${listings.imgUrl}" alt="">
                <img src="${listings.imgUrl}" alt="">
                <img src="${listings.imgUrl}" alt="">
            </div>
            <div class="single-ad-data">
                <div>
                    <h4>Podaci o nekretnini</h4>
                    Broj soba: ${listings.roomCount}<br><br>
                    Cena: ${listings.price.toLocaleString('sr-RS') == 0 ? 'po dogovoru'
                : listings.price.toLocaleString('sr-RS') + '&euro;'}<br><br>
                    Sprat: ${listings.floor}<br><br>
                    Uknjiženost: ${listings.legalised}<br><br>
                    Površina: ${listings.m2}<br><br>
                    Stanje: ${listings.state}<br><br>
                    Ulica: ${listings.street}<br><br>
                    Linije JGP: ${listingD.publicTrasport}
                </div>
            </div>
            <div class="single-ad-seller">
                <h4>Kontakt</h4>
                <h3>${listingS.sellerName}</h3>
                Adresa: ${listingS.sellerAddress}<br><br>
                Mesto: ${listings.city}<br><br>
                Tel: ${listingS.sellerPhone}<br><br>
                Tel: ${listingS.sellerPhone}<br><br>
                <button type="submit">Pošalji&nbsp;poruku</button><br><br>
                <i class="fas fa-exclamation-triangle" title="Prijavi grešku"></i>
                <i class="fas fa-print" title="Odštampaj oglas"></i>
                <i class="fas fa-share-alt" title="Podeli oglas"></i>
                <i class="fas fa-heart" title="Dodaj u omiljene"></i>
            </div>
            <hr>
            <div class="single-ad-detailed">
                <h3>Dodatne&nbsp;informacije</h3>
                ${listingD.additionalinfo}
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
                Šifra oglasa: ${listingD.listingNumber}<br><br>
                Datum kreiranja: ${listingD.listingCreated}<br><br>
                Oglas proverila agencija: ${listingD.listingChecked}<br><br>
                Godina izgradnje: ${listingD.yearOfConstruction}<br><br>
                Infrastruktura: ${listingD.infrastructure}<br><br>
                Opremljenost: ${listingD.equipment}
            </div>`);
        $ad.appendTo($fullContainer);
        $('html, body').animate({
            scrollTop: $('.item6').offset().top
        }, 1000)
    }
};

$(document).on('load', renderAds());

function advancedSearch() {
    $(".show").slideToggle(1200);
};

$('#aSearch').click(advancedSearch);

function fullAds(id) {
    sessionStorage.setItem('idOfsmallAds', id);
    window.open('ad.html', '', '');
};

$(document).ready(function () {
    $(window).scroll(function () {
        if ($(window).scrollTop() > 100)
            $(".item1").css({ "background-color": "rgba(55, 66, 82, 0.95)" }) && $(".item2").css({ "background-color": "rgba(55, 66, 82, 0.95)" }) && $(".item3").css({ "background-color": "rgba(55, 66, 82, 0.95)" }) && $(".item4").css({ "background-color": "rgba(55, 66, 82, 0.95)" });
        else
            $(".item1").css({ "background-color": "rgba(55, 66, 82, 0.5)" }) && $(".item2").css({ "background-color": "rgba(55, 66, 82, 0.5)" }) && $(".item3").css({ "background-color": "rgba(55, 66, 82, 0.5)" }) && $(".item4").css({ "background-color": "rgba(55, 66, 82, 0.5)" });;
    });
});

$(document).ready(function () {
    $('.ads-click-scroll').on('click', function () {
        $('html, body').animate({
            scrollTop: $('.ads-click-scroll').offset().top
        }, 1000);
    });
});
