<template>
  <div class="login-wrapper">
    <div class="login">
      <h1>Ingresa a tu cuenta</h1>
      <form @submit.prevent="handleLogin">
        <label for="userId">Ingrese su usuario:</label>
        <input
          v-model="userId"
          type="text"
          id="userId"
          placeholder="Ingrese su usuario"
        />
        <span v-if="errorMessage" class="error">{{ errorMessage }}</span>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: "",
      errorMessage: "",
    };
  },
  methods: {
    handleLogin() {
      if (!this.userId) {
        this.errorMessage = "El usuario es obligatorio";
      } else {
        localStorage.setItem("user_id", this.userId);
        this.$router.push({ name: "account" });
      }
    },
  },
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #e0e0e0;
}

.login {
  max-width: 450px;
  padding: 4ch;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

form {
  display: flex;
  flex-direction: column;
}

input {
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px;
  background-color: #6439ff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
}

button:hover {
  background-color: #3c6c9c;
}

.error {
  color: red;
  margin-bottom: 10px;
  font-size: 14px;
}
</style>
