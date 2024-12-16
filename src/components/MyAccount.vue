<template>
  <div class="screen-container">
    <div class="screen">
      <h1 class="screen-title">Mi Cuenta</h1>
      <p>
        Usuario: <strong>{{ userId }}</strong>
      </p>
      <p>
        Última Sesión: <strong>{{ lastLogin }}</strong>
      </p>

      <button class="action-button" @click="logout">Cerrar Sesión</button>

      <h2 class="section-title">Rendimiento de Criptomonedas</h2>
      <table class="performance-table">
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Resultado (ARS)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bitcoin</td>
            <td :class="getClassForResult(bitcoinPerformance)">
              {{ bitcoinPerformance }}
            </td>
          </tr>
          <tr>
            <td>USDC</td>
            <td :class="getClassForResult(usdcPerformance)">
              {{ usdcPerformance }}
            </td>
          </tr>
          <tr>
            <td>Ethereum</td>
            <td :class="getClassForResult(ethereumPerformance)">
              {{ ethereumPerformance }}
            </td>
          </tr>
        </tbody>
      </table>
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
      userId: localStorage.getItem("user_id"),
      lastLogin: new Date().toLocaleString("sv-SE", {
        timeZone: "America/Argentina/Buenos_Aires",
      }),
      bitcoinPerformance: 0,
      usdcPerformance: 0,
      ethereumPerformance: 0,
    };
  },
  methods: {
    async fetchCryptoPerformance() {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        console.error("Debe iniciar sesión para ver el rendimiento.");
        return;
      }

      try {
        const response = await apiClient.get(
          `transactions?q={"user_id":"${userId}"}`
        );
        const transactions = response.data;

        await this.calculatePerformance(transactions, "bitcoin");
        await this.calculatePerformance(transactions, "usdc");
        await this.calculatePerformance(transactions, "ethereum");
      } catch (error) {
        console.error("Error al obtener los datos de rendimiento:", error);
      }
    },
    async calculatePerformance(transactions, crypto) {
      const apiUrls = {
        bitcoin: "https://criptoya.com/api/argenbtc/BTC/ARS/1",
        usdc: "https://criptoya.com/api/cocoscrypto/USDC/ARS/1",
        ethereum: "https://criptoya.com/api/argenbtc/ETH/ARS/1",
      };

      let totalPurchase = 0;
      let totalSale = 0;
      let totalAmount = 0;

      transactions.forEach((transaction) => {
        if (transaction.crypto_code === crypto) {
          const amount = parseFloat(transaction.crypto_amount);
          const money = parseFloat(transaction.money);

          if (transaction.action === "purchase") {
            totalPurchase += money;
            totalAmount += amount;
          } else if (transaction.action === "sale") {
            totalSale += money;
            totalAmount -= amount;
          }
        }
      });

      if (totalAmount > 0 && apiUrls[crypto]) {
        try {
          const response = await axios.get(apiUrls[crypto]);
          const currentPrice = response.data.totalAsk;
          const currentValue = totalAmount * currentPrice;
          const performance = currentValue + totalSale - totalPurchase;

          if (crypto === "bitcoin") {
            this.bitcoinPerformance = performance.toFixed(2);
          } else if (crypto === "usdc") {
            this.usdcPerformance = performance.toFixed(2);
          } else if (crypto === "ethereum") {
            this.ethereumPerformance = performance.toFixed(2);
          }
        } catch (error) {
          console.error(`Error al obtener el precio de ${crypto}:`, error);
        }
      }
    },
    getClassForResult(value) {
      return value >= 0 ? "positive" : "negative";
    },
    logout() {
      localStorage.removeItem("user_id");
      this.$router.push("/");
    },
  },
  mounted() {
    this.fetchCryptoPerformance();
  },
};
</script>

<style scoped>
.screen {
  width: 75vw;
  padding: 4ch;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
.screen-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100vw;
  height: 100vh;
  background-color: #e0e0e0;
  padding: 7ch;
}
.screen-title {
  font-size: 24px;
  margin-bottom: 20px;
}
.section-title {
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 10px;
}
.performance-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}
.positive {
  color: green;
}
.negative {
  color: red;
}
.action-button {
  margin-top: 20px;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}
</style>
