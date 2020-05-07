import React from 'react';
import './App.css';
import { TopBar } from './components'
import { Content } from './views';


function App() {

    return (
      <div>
        <TopBar />
        <Content />
      </div>
    );
}

export default App;
