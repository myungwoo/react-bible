import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';

import { useMediaQuery } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';

import App from './App';

import reportWebVitals from './reportWebVitals';

import './css/index.css';

function ThemeProvidedApp(){
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: prefersDarkMode ? {
            main: grey[900],
          } : undefined,
        },
      }),
    [prefersDarkMode],
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline key="css" />
      <HashRouter key="router">
        <Switch>
          <Route path='/' component={App} />
        </Switch>
      </HashRouter>
    </MuiThemeProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvidedApp />
  </React.StrictMode>, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();