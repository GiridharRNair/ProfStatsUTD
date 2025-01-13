import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ColorModeScript, extendTheme, ChakraProvider } from "@chakra-ui/react";
import App from "@/App";
import "@styles/index.css";

const config = {
    initialColorMode: "system",
    useSystemColorMode: false,
};
const theme = extendTheme({ config });

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </React.StrictMode>,
);
