<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const header = ref('Login')
const showLoginParts = ref(true)
const benutzername = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const showErrorOrSuccess = ref(true)
const errorState = ref('')

function handleInput(e: any, input: string) {
  switch (input) {
    case 'benutzername':
      benutzername.value = e.target.value
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
  if (!isEmailCorrect()) {
    alert('Bitte korrekte Email Adresse eingeben.')
    return
  }
  if (!arePasswordsEqual()) {
    alert('Die Passwörter stimmen nicht überein!')
    return
  }
  try {
    const res = await axios.post('http://localhost:3000/api/auth/signup', {
      benutzername,
      password,
      confirmPassword,
      email
    })
    console.log(res.status)
    showErrorOrSuccess.value = true
  } catch (err: any) {
    if (err.response.status === 400)
      errorState.value = 'Fehler beim Registieren. Bitte überprüfen Sie die Eingaben.'
    else if (err.response.status === 500)
      errorState.value = 'Verbindung zum Server fehlgeschlagen. Bitte erneut versuchen.'
    console.log(err)
    return
  }
  errorState.value = 'Registrierung war erfolgreich.'
  //TODO: Weiterleiten an Lobby
}

async function login() {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/signin', {
      name,
      password
    })
    //console.log(res.status)
    showErrorOrSuccess.value = true
  } catch (err: any) {
    //TODO: Fehler dem User anzeigen
    if (err.response.status === 404) {
      errorState.value = 'Fehler beim Einloggen. Bitte überprüfen Sie die Eingaben.'
    } else if (err.response.status === 500)
      errorState.value = 'Verbindung zum Server fehlgeschlagen. Bitte erneut versuchen.'
    console.log(err)
    return
  }
  errorState.value = 'Einloggen erfolgreich'
  //TODO: Weiterleitung
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
            :value="benutzername"
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
          />
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <div
            v-if="showErrorOrSuccess"
            :class="{
              success: !errorState.includes('Fehler'),
              fail: errorState.includes('Fehler')
            }"
          >
            {{ errorState }}
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <button
            v-if="showLoginParts"
            class="button"
            type="submit"
            form="LoginForm"
            @click="login"
          >
            Login
          </button>
          <!-- TODO: Ladeanimation im Button anzeigen-->
          <button
            v-if="!showLoginParts"
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
html,
body {
  width: 100%;
  height: 100%;
}
#LoginForm {
  display: grid;
}
label {
  align-items: center;
  margin-right: 20px;
}
table {
  left: 50%;
  top: 20%;
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
  animation-name: loading;
  animation-duration: 2s;
  animation-iteration-count: 5;
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
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: auto;
  padding: 5px;
  transform: translate(-50%, -50%);
}
.inputField {
  background: whitesmoke;
  border-radius: calc(5.8rem * 0.3);
  padding: calc(5.8rem * 0.2);
  box-shadow: 0 0 2rem rgb(0, 0, 0, 20%);
}

@keyframes loading {
  from {
    background-color: blue;
  }
  to {
    background-color: darkorchid;
  }
}
</style>
