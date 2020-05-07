import React from 'react';
import './App.css';
import { TopBar } from './components'
import Content from './views/index';
import { BrowserRouter as Router } from 'react-router-dom';


function App() {

    return (
      <Router>
        <TopBar />
        <Content />
      </Router>
    );
}

export default App;
