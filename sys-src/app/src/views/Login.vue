<template>
  <head> </head>

  <body>
    <table>
      <tr>
        <td colspan="2"><div class="heading">Login</div></td>
      </tr>
      <tr>
        <td><label for="benutzername"></label> Benutzername</td>
        <td>
          <input
            id="benutzername"
            class="inputField"
            type="text"
            placeholder="NeunerlnGeed2000"
            required
          />
        </td>
      </tr>
      <tr>
        <td><label for="password">Password</label></td>
        <td>
          <input
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
          <button class="button" type="submit" form="LoginForm">Login</button>
        </td>
      </tr>
    </table>
  </body>
</template>
<style>
* {
  font-family: "Lucida Console", "Courier New", monospace;
}
body {
  width: 100%;
  height: 100%;
}
#LoginForm {
  display: grid;
}
label {
  align-items: center;
  grid-template-columns: auto 1fr;
}
table {
  left: 50%;
  top: 50%;
  transform: translate(50%, 50%);
}
.button {
  border: none;
  background-color: darkblue;
  color: white;
  padding: 15px 30px;
  text-align: center;
  font-size: 16px;
  margin: 5px;
}
.heading {
  position: relative;
  font-size: large;
  padding: 5px;
  text-align: center;
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
</style>
