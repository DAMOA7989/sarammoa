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
import { StatusProvider } from "utils/status";
import { StoreProvider } from "utils/store";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "config/theme";
import "react-phone-number-input/style.css";
import { RecoilRoot } from "recoil";
import DebugObserver from "recoil/DebugObserver";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // <React.StrictMode>
    <RecoilRoot>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <StatusProvider>
                    <AuthProvider>
                        <StoreProvider>
                            <NavigateProvider>
                                <DebugObserver />
                                <App />
                            </NavigateProvider>
                        </StoreProvider>
                    </AuthProvider>
                </StatusProvider>
            </ThemeProvider>
        </BrowserRouter>
    </RecoilRoot>
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
