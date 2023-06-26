<template>
  <div class="home">
    <div class="container">
      <h1>Welcome to Neuerln!</h1>
      <ul>
        <li>
          <router-link to="/login">Login / Registration</router-link>
        </li>
        <li>
          <router-link to="/game">Game</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  display: flex;
  text-align: center;
}

.container {
  display: inline;
  border-radius: 5px;
  width: 500px;
  padding: 15px;
  margin: auto;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 15px 0;
}

router-link {
  text-decoration: none;
  color: #42b983;
}
</style>
