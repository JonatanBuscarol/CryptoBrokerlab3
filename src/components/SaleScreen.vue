<template>
  <div class="sale-screen-container">
    <div class="sale-screen">
      <h1>Vender</h1>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="crypto">Criptomoneda:</label>
          <select v-model="crypto" id="crypto" @change="fetchPrice">
            <option disabled value="">Selecciona una criptomoneda</option>
            <option value="bitcoin">Bitcoin</option>
            <option value="usdc">USDC</option>
            <option value="ethereum">Ethereum</option>
          </select>
        </div>

        <div v-if="cryptoAmount && currentPrice">
          <p>Precio por unidad: {{ currentPrice }} ARS</p>
          <p>Total a recibir: {{ totalCost }} ARS</p>
        </div>

        <div>
          <label for="cryptoAmount">Cantidad:</label>
          <input
            v-model="cryptoAmount"
            type="number"
            step="0.00001"
            id="cryptoAmount"
            placeholder="Cantidad en criptomoneda"
            @input="calculateTotalCost"
          />
        </div>

        <div>
          <label for="purchaseDate">Fecha y hora de venta:</label><br />
          <input
            v-model="purchaseDate"
            type="datetime-local"
            id="purchaseDate"
          />
        </div>

        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success">{{ successMessage }}</div>

        <button type="submit">Vender</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://labor3-d60e.restdb.io/rest/",
  headers: { "x-apikey": "64a2e9bc86d8c525a3ed8f63" },
});

export default {
  data() {
    return {
      crypto: "",
      cryptoAmount: "",
      purchaseDate: "",
      errorMessage: "",
      successMessage: "",
      currentPrice: null,
      totalCost: null,
      priceInterval: null,
    };
  },
  methods: {
    async fetchPrice() {
      let apiUrl = "";
      if (this.crypto === "bitcoin") {
        apiUrl = "https://criptoya.com/api/argenbtc/BTC/ARS/1";
      } else if (this.crypto === "usdc") {
        apiUrl = "https://criptoya.com/api/cocoscrypto/USDC/ARS/1"; //Uso otro broker poque argenbtc me tira error
      } else if (this.crypto === "ethereum") {
        apiUrl = "https://criptoya.com/api/argenbtc/ETH/ARS/1";
      }

      if (apiUrl) {
        try {
          const response = await axios.get(apiUrl);
          this.currentPrice = response.data.totalAsk;
          this.calculateTotalCost();
        } catch (error) {
          this.errorMessage = "No se pudo obtener el precio.";
        }
      }
    },
    calculateTotalCost() {
      if (this.cryptoAmount && this.currentPrice) {
        this.totalCost = (this.cryptoAmount * this.currentPrice).toFixed(2);
      } else {
        this.totalCost = null;
      }
    },
    async handleSubmit() {
      if (this.crypto === "" || this.cryptoAmount <= 0 || !this.purchaseDate) {
        this.errorMessage =
          "Todos los campos deben ser completados correctamente.";
        return;
      }

      const userId = localStorage.getItem("user_id");
      if (!userId) {
        this.errorMessage = "Debe iniciar sesión primero.";
        return;
      }

      const transactionData = {
        user_id: userId,
        action: "sale",
        crypto_code: this.crypto,
        crypto_amount: this.cryptoAmount,
        money: this.totalCost,
        datetime: new Date(this.purchaseDate).toISOString(),
      };

      try {
        const response = await apiClient.post("/transactions", transactionData);
        if (response) {
          this.successMessage = "Venta registrada correctamente.";
          this.errorMessage = "";
          setTimeout(() => {
            this.clearForm();
            this.successMessage = "";
          }, 3000);
        } else {
          this.errorMessage = "Hubo un error al registrar la venta.";
        }
      } catch (error) {
        this.errorMessage = "Hubo un problema de conexión con el servidor.";
      }
    },
    clearForm() {
      this.crypto = "";
      this.cryptoAmount = "";
      this.purchaseDate = new Date()
        .toLocaleString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" })
        .slice(0, 16);
      this.currentPrice = null;
      this.totalCost = null;
      this.errorMessage = "";
      this.successMessage = "";
    },
  },
  mounted() {
    this.priceInterval = setInterval(() => {
      this.fetchPrice();
    }, 500);

    if (this.crypto) {
      this.fetchPrice();
    }

    this.purchaseDate = new Date()
      .toLocaleString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" })
      .slice(0, 16);
  },
  beforeUnmount() {
    clearInterval(this.priceInterval);
  },
};
</script>

<style scoped>
.sale-screen-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #e0e0e0;
}

.sale-screen {
  width: 450px;
  padding: 4ch;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

form {
  display: flex;
  flex-direction: column;
}

input,
select {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
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

.success {
  background-color: #6439ff;
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  border-radius: 5px;
}
</style>
