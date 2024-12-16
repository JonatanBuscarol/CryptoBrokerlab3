<template>
  <div class="screen-container">
    <div class="screen">
      <h1 class="screen-title">Portafolio</h1>
      <table class="portfolio-table">
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Valorizada</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(crypto, code) in portfolio" :key="code">
            <td>{{ code }}</td>
            <td>{{ crypto.amount }}</td>
            <td>
              {{ crypto.value ? `$${crypto.value.toFixed(2)}` : "Cargando..." }}
            </td>
          </tr>
        </tbody>
      </table>
      <h2>
        Total: $<strong>{{ totalValue.toFixed(2) }}</strong>
      </h2>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      portfolio: {},
      totalValue: 0,
      errorMessage: "",
    };
  },
  methods: {
    async fetchPortfolio() {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        this.errorMessage = "Debe iniciar sesión para ver los movimientos.";
        return;
      }
      try {
        const response = await axios.get(
          `https://labor3-d60e.restdb.io/rest/transactions?q={"user_id":"${userId}"}`,
          {
            headers: { "x-apikey": "64a2e9bc86d8c525a3ed8f63" },
          }
        );
        this.calculatePortfolio(response.data);
      } catch (error) {
        console.error("Error al obtener el portafolio:", error);
      }
    },
    async fetchPrice(cryptoCode) {
      let apiUrl = "";
      if (cryptoCode === "bitcoin") {
        apiUrl = "https://criptoya.com/api/argenbtc/BTC/ARS/1";
      } else if (cryptoCode === "usdc") {
        apiUrl = "https://criptoya.com/api/cocoscrypto/USDC/ARS/1";
      } else if (cryptoCode === "ethereum") {
        apiUrl = "https://criptoya.com/api/argenbtc/ETH/ARS/1";
      }

      if (apiUrl) {
        try {
          const response = await axios.get(apiUrl);
          return response.data.totalAsk;
        } catch (error) {
          console.error(
            `No se pudo obtener el precio de ${cryptoCode}:`,
            error
          );
          return 0;
        }
      }
      return 0;
    },
    async calculatePortfolio(transactions) {
      this.portfolio = {};
      let totalValue = 0;

      // Agrupar cantidades por criptomoneda
      transactions.forEach((transaction) => {
        const code = transaction.crypto_code;
        const amount = parseFloat(transaction.crypto_amount);

        if (!this.portfolio[code]) {
          this.portfolio[code] = { amount: 0, value: 0 };
        }

        if (transaction.action === "purchase") {
          this.portfolio[code].amount += amount;
        } else if (transaction.action === "sale") {
          this.portfolio[code].amount -= amount;
        }
      });

      // Obtener precios actuales y calcular valor
      for (const code in this.portfolio) {
        const currentPrice = await this.fetchPrice(code);
        this.portfolio[code].value = this.portfolio[code].amount * currentPrice;
        totalValue += this.portfolio[code].value;
      }

      this.totalValue = totalValue;
    },
  },
  mounted() {
    this.fetchPortfolio();
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
.portfolio-table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}
</style>

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
.portfolio-table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}
</style>
