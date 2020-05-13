import React from 'react';
import './App.css';
import { TopBar } from './components'
import Content from './views/index';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMuiTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';

import {
  Box,
  Toolbar,
} from '@material-ui/core'
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';

type AppState = {
  height: number,
}

function App() {
  const distance = 48
  const data = useQuery(gql`
    {
      themeDark @client
    }
  `)
  const theme = responsiveFontSizes(createMuiTheme({
    palette: {
      type: data.data?.themeDark ? 'dark' : 'light',
      primary: {
        main: '#fdd835',
        light: '#fddf5d',
        dark: '#b19725',
        contrastText: '#000',
      },
      secondary: {
        main: '#03a9f4',
        light: '#35baf6',
        dark: '#0276aa',
      },
      error: {
        main: '#f44336',
        light: '#ff7961',
        dark: '#ba000d',
      },
    }
  }))
  const getHeigth = () => window.innerHeight - distance;
  const initialState: AppState = {
    height: getHeigth()
  }
  const [state, setState] = React.useState<AppState>(initialState)
  const updateheigth = () => setState({ ...state, height: getHeigth() })

  window.addEventListener('resize', updateheigth)

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default App;
