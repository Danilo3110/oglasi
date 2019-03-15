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
const ad3 = new RealEstate('Zrenjanin', 'img/krovopokrivacki-radovi-5425626382088-71785611462.jpg', 'Popravka svih vrsta krovova', 0, '065/5652-532');
const ad4 = new RealEstate('Niš', 'img/vodoinstalater-najnize-cene-hitne-intervencij-5425491020580-71782157444.jpg', 'Sve vrste vodoinstalaterskih usluga', 1500, '062/580-965');
const ad5 = new RealEstate('Novi Sad', 'img/lux-3-0-stan-garaza-odlicna-ponuda-id-8768-5425634480684-71787728297.jpg', 'Prelep, renovirano, ugradna kuhinja', 71000, '064/1252-596');
const ad6 = new RealEstate('Šabac', 'img/molersko-farbarski-radovi-5425475228587-71781068721.jpg', 'Sve vrste molersko-farbarskih radova', 0, '060/052-8524');
const ad7 = new RealEstate('Beograd', 'img/mac-book-air-2017--kao-novi-5425634510378-71787565208.jpg', 'Mac book air 2017, povoljno', 1200, '063/512-856');
const ad8 = new RealEstate('Čačak', 'img/prodajem-huawei-mate-20-lite-crna-boja-64-gb-slika-108441511.jpg', 'Huawei mate 20 lite, nov', 300, '069/1874-844');

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
                        <h3 class="ads-descr">cena: ${ad.price.toLocaleString('sr-RS') <= 0 ? 'po dogovoru'
                                                    : ad.price.toLocaleString('sr-RS')}&euro;</h3>
                        <hr>
                        <h3 class="ads-descr">kontakt: ${ad.contacts}</h3>
                        </div>`);
        $ad.appendTo($adsContainer);
    });
};
$(document).on('load', renderAds());
