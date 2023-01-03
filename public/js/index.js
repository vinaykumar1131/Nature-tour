import '@babel/polyfill';
import { login, logout } from './login'
import{updateset} from './updateSetting'
const loginForm = document.querySelector('.form--login');
const logoutbtn = document.getElementById('gg');
const updateuser=document.querySelector('.form-user-data');
const updatepass=document.querySelector('.form-user-password')

if(updatepass){
  updatepass.addEventListener('submit',async e=>{
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent="Updating...";
    const currentpass= document.getElementById('password-current').value;

    const password = document.getElementById('password').value;
    const conformpass = document.getElementById('password-confirm').value;
    await updateset({currentpass,password,conformpass},'password')
    document.querySelector('.btn--save-password').textContent="Save Changes";
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  })

}
if(loginForm){
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
})
}
if(updateuser){
  updateuser.addEventListener('submit',e=>{
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    console.log(email,name)
    updateset({name,email},'user');
  })
}
if(logoutbtn)
  logoutbtn.addEventListener('click', logout)
