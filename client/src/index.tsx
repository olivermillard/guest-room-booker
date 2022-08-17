import React from 'react';
// import ReactDOM from 'react-dom';
import App from './App';
import { NativeBaseProvider, extendTheme } from 'native-base';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import ReactDOM from 'react-dom';

const theme = extendTheme({
    config: {
        initialColorMode: 'light',
    },
});

// extend the theme
type MyThemeType = typeof theme;
declare module 'native-base' {
  type ICustomTheme = MyThemeType
}

// import { createRoot } from 'react-dom/client';
// const container = document.getElementById('app');
// // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
// const root = createRoot(container!);
// root.render(
//     <NativeBaseProvider theme={theme}>
//         <App />
//     </NativeBaseProvider>
// );

ReactDOM.render(
    <React.StrictMode>
        <NativeBaseProvider theme={theme}>
            <App />
        </NativeBaseProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

