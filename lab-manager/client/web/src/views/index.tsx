import React from 'react';

import Home from './home';

import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

export default function Content() {
    const { data } = useQuery(gql`
        {
            isAuthenticated @client
        }
    `);

    if (data?.isAuthenticated === true) {

        return (
            <div>Você está logado</div>
        )
    } else {
            return (
                <Home />
            )
    }
}