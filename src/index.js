import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "utils/firebase";
import { BrowserRouter } from "react-router-dom";
import "react-spring-bottom-sheet/dist/style.css";
import "styles/app.scss";
import "./i18n";
import { NavigateProvider } from "utils/navigate";
import { AuthProvider } from "utils/auth";
import { ModalProvider } from "utils/modal";
import { StatusProvider } from "utils/status";
import { StoreProvider } from "utils/store";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "config/theme";
import "react-phone-number-input/style.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // <React.StrictMode>
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <ModalProvider>
                <StatusProvider>
                    <AuthProvider>
                        <StoreProvider>
                            <NavigateProvider>
                                <App />
                            </NavigateProvider>
                        </StoreProvider>
                    </AuthProvider>
                </StatusProvider>
            </ModalProvider>
        </ThemeProvider>
    </BrowserRouter>
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
