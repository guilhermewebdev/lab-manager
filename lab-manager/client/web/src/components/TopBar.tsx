import React from 'react';

import { Link as RouterLink } from 'react-router-dom';

import {
	AppBar,
	Toolbar,
	Button,
} from '@material-ui/core'

import Drawer from './Drawer';

import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

export default function () {
	const { data } = useQuery(gql`
        {
            isAuthenticated @client
        }
	`);
	

	return (
		<div>
			<AppBar position="fixed">
				<Toolbar variant="dense">
					{data?.isAuthenticated &&
						<Drawer />
					}
					<div className="spacer"></div>
					{data?.isAuthenticated?
						<Button component={RouterLink} color="inherit" to="/auth">Sair</Button>:
						<Button component={RouterLink} color="inherit" to="/auth">Entre ou Cadastre</Button>
					}
				</Toolbar>
			</AppBar>
			<Toolbar variant="dense" />
		</div>
	)
}