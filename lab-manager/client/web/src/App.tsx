import React from 'react';
import './App.css';
import { TopBar } from './components'
import Content from './views/index';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  Box,
  Toolbar,
} from '@material-ui/core'

type AppState = {
  height: number,
}

function App() {
  const distance = 48
  const getHeigth = () => window.innerHeight - distance;
  const initialState:AppState = {
    height: getHeigth()
  }
  const [state, setState] = React.useState<AppState>(initialState)
  const updateheigth = () => setState({ ...state, height: getHeigth() })
  
  window.addEventListener('resize', updateheigth)

  return (
    <Router>
      <TopBar />
			<Box width="100%" height={distance} />
      <Box
        width="100%"
        top={0} bottom={0}
        left={0} right={0}
        overflow="hidden"
        position="relative"
        height={state.height}
      >
        <Content />
      </Box>
    </Router>
  );
}

export default App;
