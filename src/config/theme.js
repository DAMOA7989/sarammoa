import styles from "styles/include.scss";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            main: styles.primaryColor,
        },
        black: {
            main: "#000000",
        },
    },
});
