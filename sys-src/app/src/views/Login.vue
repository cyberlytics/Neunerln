<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import router from '@/router'
import Cookies from 'js-cookie'

const header = ref('Login')
const showLoginParts = ref(true)
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const showErrorOrSuccess = ref(true)
const errorState = ref('')
const isloading = ref(false)

function handleInput(e: any, input: string) {
  switch (input) {
    case 'benutzername':
      username.value = e.target.value
      break
    case 'password':
      password.value = e.target.value
      break
    case 'confirmPassword':
      confirmPassword.value = e.target.value
      break
    case 'email':
      email.value = e.target.value
      break
    case 'name':
      name.value = e.target.value
      break
  }
}

async function signup() {
  /*if (!isEmailCorrect()) {
    alert('Bitte korrekte Email Adresse eingeben.')
    return
  }
  if (!arePasswordsEqual()) {
    alert('Die Passwörter stimmen nicht überein!')
    return
  }*/
  isloading.value = !isloading.value
  try {
    const res = await axios.post('https://35.158.148.247:3000/api/auth/signup', {
      username: username.value,
      email: email.value,
      password: password.value
    })
    showErrorOrSuccess.value = true
  } catch (err: any) {
    isloading.value = !isloading.value
    if (err.response.status === 400)
      errorState.value = 'Fehler beim Registieren. Bitte überprüfen Sie die Eingaben.'
    else if (err.response.status === 500)
      errorState.value = 'Verbindung zum Server fehlgeschlagen. Bitte erneut versuchen.'
    console.log(err)
    return
  }
  errorState.value = 'Registrierung war erfolgreich.'
  showLoginParts.value = true
  isloading.value = false
}

async function login() {
  isloading.value = !isloading.value
  try {
    const res: any = await axios.post('http://35.158.148.247:3000/api/auth/signin', {
      name: name.value,
      password: password.value
    })

    Cookies.set('token', res.data.token)
    Cookies.set('username', res.data.username)
    showErrorOrSuccess.value = true
  } catch (err: any) {
    isloading.value = !isloading.value
    if (err.status === 404) {
      errorState.value = 'Fehler beim Einloggen. Bitte überprüfen Sie die Eingaben.'
    } else if (err.status === 500) {
      errorState.value = 'Verbindung zum Server fehlgeschlagen. Bitte erneut versuchen.'
    }
    console.log(err)
    return
  }
  errorState.value = 'Einloggen war erfolgreich.'

  await router.push('/game')
}

function showRegisterView() {
  showLoginParts.value = !showLoginParts.value
  header.value = 'Registrieren'
  errorState.value = ''
}

function showLoginView() {
  showLoginParts.value = !showLoginParts.value
  header.value = 'Login'
  errorState.value = ''
}

function isEmailCorrect() {
  //contains email @
  if (email.value.indexOf('@') == -1) return false
  //is there a dot after the @
  if (email.value.indexOf('.', email.value.indexOf('@')) == -1) return false
  return true
}
function arePasswordsEqual() {
  if (password.value != confirmPassword.value) return false
  else return true
}
</script>

<template>
  <head> </head>

  <body>
    <table>
      <tr>
        <td colspan="2">
          <div class="heading">{{ header }}</div>
        </td>
      </tr>
      <tr v-if="showLoginParts">
        <td><label for="benutzername">Benutzername oder E-Mail</label></td>
        <td>
          <input
            :value="name"
            id="benutzername"
            class="inputField"
            type="text"
            placeholder="NeunerlnGeek2000"
            @input="(e) => handleInput(e, 'name')"
            required
          />
        </td>
      </tr>
      <tr v-if="!showLoginParts">
        <td><label for="benutzername">Benutzername</label></td>
        <td>
          <input
            :value="username"
            id="benutzername"
            class="inputField"
            type="text"
            placeholder="NeunerlnGeek2000"
            @input="(e) => handleInput(e, 'benutzername')"
            required
          />
        </td>
      </tr>
      <tr v-if="!showLoginParts">
        <td><label for="email">E-Mail</label></td>
        <td>
          <input
            :value="email"
            id="email"
            class="inputField"
            type="email"
            placeholder="benutzer@oth-aw.de"
            required
            @input="(e) => handleInput(e, 'email')"
          />
        </td>
      </tr>
      <tr>
        <td><label for="password">Password</label></td>
        <td>
          <input
            :value="password"
            id="password"
            class="inputField"
            type="password"
            placeholder="Over9000"
            required
            @input="(e) => handleInput(e, 'password')"
          />
        </td>
      </tr>
      <tr v-if="!showLoginParts">
        <td><label for="password">Password bestätigen</label></td>
        <td>
          <input
            :value="confirmPassword"
            id="password"
            class="inputField"
            type="password"
            placeholder="Over9000"
            required
            @input="(e) => handleInput(e, 'confirmPassword')"
          />
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <div
            v-if="showErrorOrSuccess"
            :class="{
              success: errorState.includes('erfolgreich'),
              fail: !errorState.includes('erfolgreich')
            }"
          >
            {{ errorState }}
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <div v-if="isloading" class="container"><div class="loader"></div></div>
          <button
            v-if="showLoginParts && !isloading"
            class="button"
            type="submit"
            form="LoginForm"
            @click="login"
          >
            Login
          </button>
          <!-- TODO: Ladeanimation im Button anzeigen-->
          <button
            v-if="!showLoginParts && !isloading"
            class="button"
            type="submit"
            form="LoginForm"
            @click="signup"
          >
            Registrieren
          </button>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <a v-if="showLoginParts" href="#top" @click="showRegisterView">Ich habe keinen Account</a>
          <p v-else></p>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <a v-if="!showLoginParts" href="#top" @click="showLoginView">Zurück zum Login</a>
          <p v-else></p>
        </td>
      </tr>
    </table>
  </body>
</template>

<style>
* {
  font-family: 'Lucida Console', 'Courier New', monospace;
}

body {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

table {
  max-height: 500px;
}

label {
  align-items: center;
  margin-right: 20px;
}

a {
  text-align: center;
  margin: 0 auto;
  display: block;
}
.button {
  position: relative;
  border: none;
  background-color: darkblue;
  color: white;
  padding: 15px 30px;
  text-align: center;
  font-size: 16px;
  margin: 0 auto;
  display: block;
}

.heading {
  position: relative;
  font-size: large;
  padding: 5px;
  text-align: center;
}

.success {
  font-size: large;
  padding: 5px;
  text-align: center;
  color: hsla(160, 100%, 37%, 1);
}

.fail {
  font-size: large;
  padding: 5px;
  text-align: center;
  color: rgb(209, 44, 15);
}
.inputField {
  background: whitesmoke;
  border-radius: calc(5.8rem * 0.3);
  padding: calc(5.8rem * 0.2);
  box-shadow: 0 0 2rem rgb(0, 0, 0, 20%);
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.loader {
  z-index: 1;
  border: 16px solid #f3f3f3;
  border-top: 16px solid #21d427;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: loading 2s linear infinite;
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
