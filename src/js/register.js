import {postIntoBase} from './main';

function createUser() {
    const usersObj = {};
    $("#writeAd").find("input, select").each(function () {
        usersObj[this.name] = $(this).val();
    });
    delete usersObj.passwordRepeat;
    usersObj['favorites'] = [];

    const message = 'Uspesno ste se registrovali';
    (async () => await postIntoBase('users', usersObj, message))();
    setTimeout(() => {location.href = 'index.html';}, 500);
};

export default createUser;
