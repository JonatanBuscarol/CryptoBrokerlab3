<template>
  <div id="app" :class="{ 'with-header': !isLoginPage }">
    <header
      v-if="!isLoginPage"
      :class="{ 'sticky-header': isSticky }"
      :style="{
        display: isSticky ? 'block' : 'none',
        fontSize: dynamic.fontSize,
      }"
    >
      <div class="container">
        <router-link to="/"></router-link>
        <router-link to="/account" class="link">
          Mi cuenta<img
            alt="logo"
            :style="{
              width: dynamic.logoSize,
              height: dynamic.logoSize,
            }"
            src="./assets/logo.png"
          />
        </router-link>
        <router-link to="/buy" class="link">Compra</router-link>
        <router-link to="/sale" class="link">Venta</router-link>
        <router-link to="/movement" class="link">Movimientos</router-link>
        <router-link to="/portfolio" class="link">Portafolio</router-link>
      </div>
    </header>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isSticky: true,
      prevScrollY: 0,
      dynamic: {
        fontSize: "3vh",
        logoSize: "5vh",
      },
      isLoginPage: false,
    };
  },
  watch: {
    $route(to) {
      this.isLoginPage = to.path === "/";
    },
  },
  mounted() {
    this.isLoginPage = this.$route.path === "/";
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.changeSize);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.changeSize);
  },
  methods: {
    handleScroll() {
      const currentScrollY = window.pageYOffset;
      if (currentScrollY > this.prevScrollY) {
        this.isSticky = false;
      } else {
        this.isSticky = true;
      }
      this.prevScrollY = currentScrollY;
    },
    changeSize() {
      if (window.innerWidth <= 600) {
        this.dynamic.fontSize = "2vw";
        this.dynamic.logoSize = "3vw";
      } else {
        this.dynamic.fontSize = "3vh";
        this.dynamic.logoSize = "5vh";
      }
    },
  },
};
</script>

<style scoped>
.link {
  text-decoration: none;
  color: inherit;
}
.container {
  display: grid;
  grid-template-columns: 0% 20% 20% 20% 20% 20%;
  text-align: center;
  height: 10vh;
  align-items: center;
}
.sticky-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 10vh;
  background-color: #6439ff;
  font-weight: lighter;
  font-family: Arial, Helvetica, sans-serif;
  color: white;
  padding: 0vh 10vw;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.with-header {
  margin-top: 10vh;
}
</style>
