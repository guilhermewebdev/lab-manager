import * as React from 'react'

import Clients from './clients/index'
import { Route, Switch } from 'react-router'

export default function Home() {
    return (
        <Switch>
            <Route path="/client/:client">
                <Clients></Clients>
            </Route>
            <Route path="/">
                <Clients></Clients>
            </Route>
        </Switch>

    )
}