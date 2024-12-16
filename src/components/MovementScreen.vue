<template>
  <div class="screen-container">
    <div class="screen">
      <div v-if="viewMessage" class="view">{{ viewMessage }}</div>
      <h1 class="screen-title">Historial de Movimientos</h1>
      <table class="transaction-table">
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Monto</th>
            <th>Tipo Mov.</th>
            <th>Fecha y Hora</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction._id">
            <td>{{ transaction.crypto_code }}</td>
            <td>{{ transaction.crypto_amount }}</td>
            <td>{{ transaction.money }}</td>
            <td>{{ getActionLabel(transaction.action) }}</td>
            <td>{{ new Date(transaction.datetime).toLocaleString() }}</td>
            <td>
              <button
                class="action-button"
                @click="viewTransaction(transaction._id)"
              >
                Ver
              </button>
              <button
                class="action-button"
                @click="editTransaction(transaction._id)"
              >
                Editar
              </button>
              <button
                class="action-button delete-button"
                @click="deleteTransaction(transaction._id)"
              >
                Borrar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      transactions: [],
      viewMessage: "",
      errorMessage: "",
      timeoutId: null,
    };
  },
  methods: {
    async fetchTransactions() {
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
        this.transactions = response.data;
      } catch (error) {
        console.error("Error al obtener las transacciones:", error);
        this.errorMessage = "Hubo un problema al cargar los movimientos.";
      }
    },

    async viewTransaction(id) {
      try {
        const response = await axios.get(
          `https://labor3-d60e.restdb.io/rest/transactions/${id}`,
          {
            headers: { "x-apikey": "64a2e9bc86d8c525a3ed8f63" },
          }
        );

        const { user_id, crypto_code, crypto_amount, money, action, datetime } =
          response.data;
        this.viewMessage = `Usuario: ${user_id}
          Criptomoneda: ${crypto_code}
          Cantidad: ${crypto_amount}
          Monto: $${money}
          Tipo de movimiento: ${action === "purchase" ? "Compra" : "Venta"}
          Fecha: ${new Date(datetime).toLocaleString()}
        `;

        if (this.timeoutId) clearTimeout(this.timeoutId);

        this.timeoutId = setTimeout(() => {
          this.viewMessage = "";
          this.timeoutId = null;
        }, 15000);
      } catch (error) {
        console.error("Error al ver la transacción:", error);
        this.errorMessage = "Hubo un problema al ver la transacción.";
      }
    },

    async editTransaction(id) {
      const newMoneyValue = prompt("Ingrese el nuevo monto:");
      if (newMoneyValue) {
        try {
          await axios.patch(
            `https://labor3-d60e.restdb.io/rest/transactions/${id}`,
            { money: newMoneyValue },
            {
              headers: { "x-apikey": "64a2e9bc86d8c525a3ed8f63" },
            }
          );
          alert("Transacción actualizada correctamente.");
          this.fetchTransactions();
        } catch (error) {
          console.error("Error al editar la transacción:", error);
          this.errorMessage = "Hubo un problema al editar la transacción.";
        }
      }
    },

    async deleteTransaction(id) {
      if (confirm("¿Estás seguro de que deseas eliminar esta transacción?")) {
        try {
          await axios.delete(
            `https://labor3-d60e.restdb.io/rest/transactions/${id}`,
            {
              headers: { "x-apikey": "64a2e9bc86d8c525a3ed8f63" },
            }
          );
          alert("Transacción eliminada correctamente.");
          this.fetchTransactions();
        } catch (error) {
          console.error("Error al eliminar la transacción:", error);
          this.errorMessage = "Hubo un problema al eliminar la transacción.";
        }
      }
    },

    getActionLabel(action) {
      return action === "sale"
        ? "Venta"
        : action === "purchase"
        ? "Compra"
        : "Desconocido";
    },
  },
  mounted() {
    this.fetchTransactions();
  },
  beforeUnmount() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
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
.transaction-table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}
.action-button {
  margin-right: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}
.delete-button {
  background-color: #dc3545;
}
.view {
  background-color: #6439ff;
  font-weight: 600;
  font-family: Arial, Helvetica, sans-serif;
  color: black;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  border-radius: 5px;
  white-space: pre-line;
}
</style>
