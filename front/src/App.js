import React from "react";
import Main from "./components/Main";
import { CookiesProvider } from 'react-cookie';

const App = () => (
  <div>
    <CookiesProvider>
      <Main />
    </CookiesProvider>
  </div>
);

export default App;
