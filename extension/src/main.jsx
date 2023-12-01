/**
 * Entry point for rendering the React application using Chakra UI for styling.
 */

import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { ColorModeScript } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App'
import './styles/index.css';

const config = {
  initialColorMode: 'system',
  useSystemColorMode: false,
}
const theme = extendTheme({ config })

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* Enable color mode script based on Chakra UI theme configuration */}
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />

    {/* Provide the Chakra UI theme to the entire React application */}
    <ChakraProvider theme={theme}>
      {/* Render the main application component */}
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)