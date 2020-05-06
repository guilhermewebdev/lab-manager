import React from 'react';
import './App.css';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
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
