import React, { useContext } from 'react';
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Signin from './components/Signin';
import Admin from './components/Admin';
import { AuthProvider, AuthContext } from './AuthContext';
import Item from './components/Item';

function App() {
  const authContext = useContext(AuthContext);

  return (
    <div className="App">
      <BrowserRouter>
        {authContext.auth.admin ?
          <Routes>
            <Route path="/" element={<Admin />} />
            <Route path="/:id" element={<Item />} />
          </Routes>
          :
          <Routes>
            <Route path="/" element={<Signin />} />
          </Routes>
        }
      </BrowserRouter>
    </div>
  );
}

function AppWithStore() {
  return (<AuthProvider>
    <App />
  </AuthProvider>);
}

export default AppWithStore;
