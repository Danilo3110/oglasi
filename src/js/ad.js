import {api, getBase, animateFocus, addToFavorites, printAd} from './main';

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
            <div class="single-ad-img"></div>
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
                <i class="fas fa-print fa-lg" title="Odštampaj oglas"></i>
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
        if ((listings.imgUrl).length != 0) {
            listings.imgUrl.forEach(function (image, index) {
                $('.single-ad-img').append(`<img src="${image}" alt="slika${index}">`);
            });
        } else {
            $('.single-ad-img').append(`<img src="./img/image-not-found.jpg" alt="nema slike">`);
        }
        animateFocus('.item6');
        $('.fa-print').on('click', printAd);
        $(`#fav_${listings.id}`).on('click', addToFavorites);
    }
};

export default renderFullAds;
