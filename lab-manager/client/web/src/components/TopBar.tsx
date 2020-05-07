import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
	AppBar,
	Toolbar,
	Button,
} from '@material-ui/core'

import Drawer from './Drawer';

import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
		},
	}),
);

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
					{!data?.isAuthenticated &&
						<Button color="inherit">Login</Button>
					}
				</Toolbar>
			</AppBar>
			<Toolbar variant="dense" />
		</div>
	)
}