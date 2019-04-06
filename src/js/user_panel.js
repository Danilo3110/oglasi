import {api, getBase, animateFocus, _render_small, renderFavorites} from './main';
import {createAdObjects} from './publish_ad';

async function usersAds() {
    const userListings = await getBase(`/listings?authorId=${localStorage.getItem('id')}`);
    $('.item7').append(`<h1 class="ads-click-scroll">Korisnik: ${localStorage.getItem('user')} - oglasi:</h1>
                        <div class="user-container"></div>`);
    await _render_small(userListings, '.user-container');
    animateFocus('.item7');
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
    sessionStorage.setItem('adCheckLoadValidity', true);
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
    if (JSON.parse(sessionStorage.getItem('adCheckLoadValidity'))) {
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

export {usersAds, loadAdToForm};
