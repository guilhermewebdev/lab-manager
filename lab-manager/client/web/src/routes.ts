import { ApolloClient } from "apollo-boost";


export function getRoutes(client: ApolloClient<any>){
    return [
        {
            path: '/',
        },
        {
            path: '/client/',
        },
        {
            path: '/client/:client/',
        },
        {
            path: '/client/:client/patient/',
        },
        {
            path: '/client/:client/patient/:patient/'
        },
        {
            path: '/client/:client/patient/:patient/job/'
        },
        {
            path: '/client/:client/patient/:patient/job/:job/'
        },
    ]
}

export default [
    {
        path: '/',
    },
    {
        path: '/client/',
    },
    {
        path: '/client/:client/',
    },
    {
        path: '/client/:client/patient/',
    },
    {
        path: '/client/:client/patient/:patient/'
    },
    {
        path: '/client/:client/patient/:patient/job/'
    },
    {
        path: '/client/:client/patient/:patient/job/:job/'
    },
]