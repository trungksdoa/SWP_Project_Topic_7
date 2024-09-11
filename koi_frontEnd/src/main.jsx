import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "./utils/i18n.js";
import { ReactToastifyProvider } from "./context/ReactToastifyProvider.jsx";
import { Provider } from "react-redux";
import { store } from "./store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ReactToastifyProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ReactToastifyProvider>
  </Provider>
);
