import React from 'react';
import './App.css';
import { ContextProvider } from './AppContext';
import MainView from './components/MainView';
import Menu from './components/Menu';

function App() {

  return (
    <div className='app'>
      <ContextProvider >
        <MainView />
        <Menu />
      </ContextProvider>
    </div>
  );
}

export default App;
