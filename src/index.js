import * as React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import router from "./App";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// import './index.css';
import 'react-loading-skeleton/dist/skeleton.css'
import "./App.css";
import "animate.css/animate.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rsuite/dist/rsuite.min.css';
import { getLocalKey } from "./utils/commonfunction";
import enTranslation from "./Locales/en.json";
import deTranslation from "./Locales/de.json";
import esTranslation from "./Locales/es.json";
import huTranslation from "./Locales/hu.json";

// globalSetting().then(async (globalDetails) => {
//   i18n.use(LanguageDetector).init({
//     resources: {
//       en: { translation: enTranslation },
//       ja: { translation: jaTranslation },
//     },
//   });
//   /**setting default language */
//   let usersSelectedLanguage = getLocalKey("system_language");
//   if (!usersSelectedLanguage) {
//     i18n.changeLanguage(
//       globalDetails && globalDetails.data && globalDetails.data.default_language
//         ? globalDetails.data.default_language
//         : "en"
//     );
//   }
// });
(async () => {
  await i18n.use(LanguageDetector).init({
    resources: {
      en: { translation: enTranslation },
      de: { translation: deTranslation }, 
      es: { translation: esTranslation },
      hu: { translation: huTranslation },
    },
    fallbackLng:'en' /** Default lang */
  });

  // Setting default language
  let usersSelectedLanguage = getLocalKey("system_language");
  if (!usersSelectedLanguage) {
    const defaultLanguage = "en"; // Set your default language here
    i18n.changeLanguage(defaultLanguage);
  }
})();
/**JS PATHS >>>>>*/
// import "jquery-ui/dist/jquery-ui.js";
// import "jquery-ui/ui/widgets/datepicker.js";
// import "../src/assets/bootstrap-daterangepicker/daterangepicker.js"
/**JS PATHS <<<<<*/
// GetLanguageJson("en.json").then((response)=>{
//   console.log("response",response)
// })

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <RouterProvider router={router} />
        <div
          id="main-loader"
          className="main-loader"
          style={{ display: "none" }}
        >
          
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </I18nextProvider>
    </Provider>
  // </React.StrictMode>
);
