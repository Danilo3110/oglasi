const api = axios.create({
    baseURL: 'http://localhost:3000'
});

const baseOfRealEstate = [];
class RealEstate {
    constructor(location, image, description, price, contacts) {
        this.location = location;
        this.image = image;
        this.description = description;
        this.price = price;
        this.contacts = contacts;
        baseOfRealEstate.push(this);
    };
    sStorage() {};
};

const ad1 = new RealEstate('Beograd', 'img/kopernikus1a.jpg', 'Kopernikus panorama, novo, lux', 166000, '063/770-9316');
const ad2 = new RealEstate('Beograd', 'img/djeram-pijaca-lux-novogradnja-id-2460-5425634537964-71787696524.jpg', 'Novi Beograd, lux, odmah useljivo', 98000, '063/200-405');
const ad3 = new RealEstate('Beograd', 'img/konjarnik-olge-alkalaj.jpg', 'Konjarnik, Olge Alkalaj, jednoiposoban', 54000, '065/5652-532');
const ad4 = new RealEstate('Beograd', 'img/dedinje---beli-dvor-8.jpg', 'Beograd, Dedinje', 165000, '062/580-965');
const ad5 = new RealEstate('Novi Sad', 'img/lux-3-0-stan-garaza-odlicna-ponuda-id-8768-5425634480684-71787728297.jpg', 'Telep, renovirano, ugradna kuhinja', 71000, '064/1252-596');
const ad6 = new RealEstate('Beograd', 'img/novi-beograd.jpg', 'Novi Beograd, Hotel Jugoslavija', 155000, '060/052-8524');
const ad7 = new RealEstate('Subotica', 'img/subotica---centar-3.jpg', 'Subotica, Centar 3', 38000, '063/512-856');
const ad8 = new RealEstate('Novi Sad', 'img/odlican-uknjizen.jpg', 'Novi Sad, Novo naselje', 56000, '069/1874-844');

function renderAds() {
    baseOfRealEstate.forEach(function (ad) {
        const $adsContainer = $('.ads-container');
        const $ad = $(`<div class="ads">
                        <div class="ads-descr">
                            <h3>Lokacija: ${ad.location}<i class="fas fa-share-alt fa-lg"></i><i class="far fa-heart fa-lg"></i><i
                                class="fas fa-map-marker-alt fa-lg"></i></h3>
                        </div>
                        <a href="ad.html"><img src="${ad.image}" alt=""></a><br>
                        <h2 class="ads-descr">${ad.description}</h2>
                        <h3 class="ads-descr">cena: ${ad.price.toLocaleString('sr-RS') == 0 ? 'po dogovoru'
                                                    : ad.price.toLocaleString('sr-RS') + '&euro;'}</h3>
                        <hr>
                        <h3 class="ads-descr">kontakt: ${ad.contacts}</h3>
                        </div>`);
        $ad.appendTo($adsContainer);
    });
};
$(document).on('load', renderAds());
