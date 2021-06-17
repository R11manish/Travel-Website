import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSetting } from './updateSettings';


//DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateForm = document.querySelector('.form-user-data');

//values


//DELEGATION
if (mapBox) {
    const locations = JSON.parse(document.getElementById('map').dataset.locations);
    displayMap(locations);
}

if (loginForm)
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (updateForm)
    updateForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        updateSetting(name, email);
    })