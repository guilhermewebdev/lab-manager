import React from 'react';

import { Link as RouterLink, Route } from 'react-router-dom';

import routes from '../routes';

import {
    Breadcrumbs,
    Link,
} from '@material-ui/core'


import { gql } from 'apollo-boost';

export default function () {


    return (
        <Breadcrumbs aria-label="breadcrumb">
            {routes.map(({ path }, index) => (
                <Route
                    exact
                    key={index}
                    path={path}
                    render={(props) =>
                        routes.filter(({ path }) => props.match.path.includes(path))
                            .map(({ path }, index) => (
                                !!path &&
                                <Link
                                    color='inherit'
                                    component={RouterLink}
                                    key={index}
                                    to={Object.keys(props.match.params).length
                                        ? Object.keys(props.match.params).reduce(
                                            (path, param) => path.replace(
                                                `:${param}`, props.match.params[param]
                                            ), path
                                        )
                                        : path}
                                >{path}</Link>
                            ))
                    }
                />
            ))
            }
        </Breadcrumbs >
    )
}