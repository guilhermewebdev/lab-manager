import React from 'react';

import { Link as RouterLink } from 'react-router-dom';

import { logout } from '../services/auth';

import {
	AppBar,
	Toolbar,
	Button,
} from '@material-ui/core'

import Drawer from './Drawer';

import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

export default function () {
	const { data } = useQuery(gql`
        {
            isAuthenticated @client
        }
	`);
	const client = useApolloClient()
	const logOut = () => {
		logout(client)
	}

	return (
			<AppBar position="fixed">
				<Toolbar variant="dense">
					{data?.isAuthenticated &&
						<Drawer />
					}
					<div className="spacer"></div>
					{data?.isAuthenticated ?
						<Button color="inherit" onClick={logOut}>Sair</Button> :
						<Button component={RouterLink} color="inherit" to="/auth">Entre ou Cadastre</Button>
					}
				</Toolbar>
			</AppBar>
	)
}