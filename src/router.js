import BuyScreen from "./components/BuyScreen.vue";
import MovementScreen from "./components/MovementScreen.vue";
import MyAccount from "./components/MyAccount.vue";
import PersonalPortfolio from "./components/PersonalPortfolio.vue";
import SaleScreen from "./components/SaleScreen.vue";
import LoginScreen from "./components/LoginScreen.vue";

const routes = [
  { path: "/", component: LoginScreen },
  { path: "/account", name: "account", component: MyAccount },
  { path: "/buy", component: BuyScreen },
  { path: "/sale", component: SaleScreen },
  { path: "/movement", component: MovementScreen },
  { path: "/portfolio", component: PersonalPortfolio },
];

export default routes;
