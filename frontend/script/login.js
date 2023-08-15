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
    let res = await axios.post("http://localhost:4000/user/signup", userData);
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
  const email = event.target.cremail.value;
  const password = event.target.crpassword.value;
  const userData = {
    email,
    password,
  };
  try {
    let res = await axios.post("http://localhost:4000/user/login", userData);
    localStorage.setItem("token", res.data.token);
    alert(`${res.data.message}`);
  } catch (err) {
    console.log(err);
    alert(`${err.response.data.message}`);
  }
}
