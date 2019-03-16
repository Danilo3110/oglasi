const api = axios.create({
    baseURL: 'http://localhost:3000'
});

const baseOfRealEstate = [];
class RealEstate {
    constructor(id, location, image, description, price, contacts) {
        this.id = id;
        this.location = location;
        this.image = image;
        this.description = description;
        this.price = price;
        this.contacts = contacts;
        baseOfRealEstate.push(this);
    };
};

const ad1 = new RealEstate(1, 'Beograd', 'img/kopernikus1a.jpg', 'Kopernikus panorama, novo, lux', 166000, '063/770-9316');
const ad2 = new RealEstate(2, 'Beograd', 'img/djeram-pijaca-lux-novogradnja-id-2460-5425634537964-71787696524.jpg', 'Novi Beograd, lux, odmah useljivo', 98000, '063/200-405');
const ad3 = new RealEstate(3, 'Beograd', 'img/konjarnik-olge-alkalaj.jpg', 'Konjarnik, Olge Alkalaj, jednoiposoban', 54000, '065/5652-532');
const ad4 = new RealEstate(4, 'Beograd', 'img/dedinje---beli-dvor-8.jpg', 'Beograd, Dedinje', 165000, '062/580-965');
const ad5 = new RealEstate(5, 'Novi Sad', 'img/lux-3-0-stan-garaza-odlicna-ponuda-id-8768-5425634480684-71787728297.jpg', 'Telep, renovirano, ugradna kuhinja', 71000, '064/1252-596');
const ad6 = new RealEstate(6, 'Beograd', 'img/novi-beograd.jpg', 'Novi Beograd, Hotel Jugoslavija', 155000, '060/052-8524');
const ad7 = new RealEstate(7, 'Subotica', 'img/subotica---centar-3.jpg', 'Subotica, Centar 3', 38000, '063/512-856');
const ad8 = new RealEstate(8, 'Novi Sad', 'img/odlican-uknjizen.jpg', 'Novi Sad, Novo naselje', 56000, '069/1874-844');

function renderAds() {
    baseOfRealEstate.forEach(function (ad) {
        const $adsContainer = $('.ads-container');
        const $ad = $(`<div class="ads" id="${ad.id}">
                        <div class="ads-descr">
                            <h3>Lokacija: ${ad.location}<i class="fas fa-share-alt fa-lg"></i><i class="far fa-heart fa-lg"></i><i
                                class="fas fa-map-marker-alt fa-lg"></i></h3>
                        </div>
                        <img src="${ad.image}" alt=""><br>
                        <h2 class="ads-descr">${ad.description}</h2>
                        <h3 class="ads-descr">cena: ${ad.price.toLocaleString('sr-RS') == 0 ? 'po dogovoru'
                : ad.price.toLocaleString('sr-RS') + '&euro;'}</h3>
                        <hr>
                        <h3 class="ads-descr">kontakt: ${ad.contacts}</h3>
                        </div>`);
        $ad.appendTo($adsContainer);
        $(`#${ad.id}`).on('click', () => fullAds(ad.id));
    });
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
