import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';


//DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateForm = document.querySelector('.form-user-data');
const updatePassword = document.querySelector('.form-user-settings');


//values
//.form-user-data

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
        const form = new FormData();
        form.append('name', document.getElementById('name').value)
        form.append('email', document.getElementById('email').value)
        form.append('photo', document.getElementById('photo').files[0]);
        updateSettings(form, 'data');
    })

if (updatePassword)
    updatePassword.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'updating...'

        const currentPassword = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('password-confirm').value;


        await updateSettings({ currentPassword, password, confirmPassword }, 'password');

        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
        document.querySelector('.btn--save-password').textContent = 'save password'
    })