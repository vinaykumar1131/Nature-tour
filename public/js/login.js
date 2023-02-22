// const axios=require('axios')
import axios from 'axios';

console.log("yes we got it");
// console.log(f);

export const login = async function (email, password) {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/user/login',
      data: {
        email,
        password
      }
    }, { withCredentials: true });

    if (res.data.status === "Success") {
      alert("Login Successfully");
      window.setTimeout(() => {
        location.assign('/')
      }, 1000);
    }
  } catch (err) {
    console.log(err);
  }
}
export const signup = async function (name, email,password,conformpass) {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/user/signup',
      data: {
        name,
        email,
        password,conformpass
      }
    }, { withCredentials: true });

    if (res.data.status === "Success") {
      alert("Login Successfully");
      window.setTimeout(() => {
        location.assign('/')
      }, 1000);


    }


  } catch (err) {
    console.log(err);
  }
}

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/user/logout',
    })
    if (res.data.status === 'Success') {
      location.reload(true);
    }
  } catch (err) {
    console.log(err.response)
    window.alert("some error in logout")
    console.log("some error is there")
  }
}

