'use strict';

const serverUrl = `http://localhost:3000`;
const api = axios.create({
    baseURL: `${serverUrl}`
});
api.defaults.timeout = 2500;


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

function renderFullAds() {
    const idOfsmallAds = JSON.parse(sessionStorage.getItem('idOfsmallAds'));
    baseOfRealEstate.forEach(function (ad) {
        if (ad.id === idOfsmallAds) {
            const $fullContainer = $('.item7');
            const $ad = $(`<h2>${ad.description}</h2>
            <h3>${ad.location}</h3>
            <div class="single-ad-container">
            <div class="single-ad-img">
                <img src="${ad.image}" alt="">
                <img src="${ad.image}" alt="">
                <img src="${ad.image}" alt="">
                <img src="${ad.image}" alt="">
                <img src="${ad.image}" alt="">
            </div>
            <div class="single-ad-data">
                <div>
                    <h4>Podaci o nekretnini</h4>
                    Broj soba: 3<br><br>
                    Cena: ${ad.price.toLocaleString('sr-RS') == 0 ? 'po dogovoru'
                          : ad.price.toLocaleString('sr-RS') + '&euro;'}<br><br>
                    Sprat: 2/2<br><br>
                    Uknjiženost: Uknjiženo<br><br>
                    Površina: 62 m2<br><br>
                    Stanje: Renovirano<br><br>
                    Ulica: Maksima Gorkog<br><br>
                    Linije JGP: 19, 21, 22, 29, 46, 55, E1
                </div>
            </div>
            <div class="single-ad-seller">
                <h4>Kontakt</h4>
                <h3>Expertus consulting</h3>
                Adresa: Kozjačka 20/3<br><br>
                Mesto: Beograd<br><br>
                Tel: ${ad.contacts}<br><br>
                Tel: ${ad.contacts}<br><br>
                <button type="submit">Pošalji&nbsp;poruku</button><br><br>
                <i class="fas fa-exclamation-triangle" title="Prijavi grešku"></i>
                <i class="fas fa-print" title="Odštampaj oglas"></i>
                <i class="fas fa-share-alt" title="Podeli oglas"></i>
                <i class="fas fa-heart" title="Dodaj u omiljene"></i>
            </div>
            <hr>
            <div class="single-ad-detailed">
                <h3>Dodatne&nbsp;informacije</h3>
                ${ad.description}
            </div>
            <hr>
            <div class="single-ad-tour">
                <h4>Zakažite obilazak</h4>
                <div>Izaberite termin koj vama odgovara! Ostavite podatke i kontaktiraćemo vas u najkraćem mogućem
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
                Šifra oglasa: 3044713<br><br>
                Datum kreiranja: 15.03.2019 (00:39)<br><br>
                Oglas proverila agencija: 15.03.2019 (20:38)<br><br>
                Godina izgradnje: 2008<br><br>
                Infrastruktura: TERASA<br><br>
                Opremljenost: CATV
            </div>`);
            $ad.appendTo($fullContainer);
        }
    });
    sessionStorage.removeItem('idOfsmallAds');
};

$(document).on('load', renderAds());

function advancedSearch() {
    //return $('.item-search').toggleClass('show');
    $(".show").slideToggle(1200);
};

$('#aSearch').click(advancedSearch);

function fullAds(id) {
    sessionStorage.setItem('idOfsmallAds', id);
    location.href = "ad.html";
};
