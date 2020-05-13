import React from 'react';

import { Link as RouterLink } from 'react-router-dom';

import { logout } from '../services/auth';

import {
	AppBar,
	Toolbar,
	Button,
	IconButton,
	Icon,
} from '@material-ui/core'

import { Icon as MDI } from '@mdi/react';

import Drawer from './Drawer';
import Breadcrumbs from './Breadcrumbs';

import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { mdiBrightness4, mdiBrightness5 } from '@mdi/js';

export default function () {
	const { data } = useQuery(gql`
        query {
            isAuthenticated @client
        }
	`);
	const THEME_QUERY = gql`
		query {
			themeDark @client
		}
	`
	const theme = useQuery(THEME_QUERY)
	const client = useApolloClient()
	const logOut = () => {
		logout(client)
	}
	const toggleTheme = () => {
		client.writeData({ data: { themeDark: !theme.data?.themeDark } })
	}

	return (
		<AppBar position="fixed">
			<Toolbar variant="dense">
				{!!data?.isAuthenticated &&
					<Drawer />
				}
				<Breadcrumbs />
				<div className="spacer"></div>
				<IconButton
					aria-label="theme"
					onClick={toggleTheme}
				>
					<Icon
						component={MDI}
						path={theme.data?.themeDark ? mdiBrightness4 : mdiBrightness5}
						color='default'

					/>
				</IconButton>
				{data?.isAuthenticated ?
					<Button color="inherit" onClick={logOut}>Sair</Button> :
					<Button component={RouterLink} color="inherit" to="/auth">Entre ou Cadastre</Button>
				}
			</Toolbar>
		</AppBar>
	)
}