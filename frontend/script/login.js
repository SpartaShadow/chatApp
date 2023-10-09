//SIGNUP
async function signUp(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const email = event.target.email.value;
  const number = event.target.number.value;
  const password = event.target.password.value;
  const userData = {
    name,
    email,
    number,
    password,
  };
  try {
    let res = await axios.post("http://localhost:3000/user/signup", userData);
    if (res.status === 201) {
      alert(`${res.data.message}`);
    }
  } catch (err) {
    alert(`${err.response.data.message}`);
  }
}

//LOGIN
async function logUp(event) {
  event.preventDefault();
  const email = event.target.chemail.value;
  const password = event.target.chpassword.value;
  const userData = {
    email,
    password,
  };
  try {
    let res = await axios.post("http://localhost:3000/user/login", userData);
    localStorage.clear();
    console.log(res);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.name);
    localStorage.setItem("groupid", 0);
    alert(`${res.data.message}`);
    window.location.href = "../views/chatApp.html";
  } catch (err) {
    console.log(err);
    alert(`${err.response.data.message}`);
  }
}

//TOGGLE SIGN UP SIGN IN
function toggleSignup() {
  document.getElementById("login-toggle").style.backgroundColor = "#fff";
  document.getElementById("login-toggle").style.color = "#222";
  document.getElementById("signup-toggle").style.backgroundColor = "#57b846";
  document.getElementById("signup-toggle").style.color = "#fff";
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "block";
}

function toggleLogin() {
  document.getElementById("login-toggle").style.backgroundColor = "#57B846";
  document.getElementById("login-toggle").style.color = "#fff";
  document.getElementById("signup-toggle").style.backgroundColor = "#fff";
  document.getElementById("signup-toggle").style.color = "#222";
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
}
