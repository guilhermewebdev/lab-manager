import DefaultClient, { ApolloClient, gql } from "apollo-boost";

export async function verifyAuth(client: ApolloClient<any>|DefaultClient<unknown>): Promise<boolean> {
  try {
    const data = await client.query({
      query: gql`
              query {
                isAuthenticated
              }
            `
    })

    client.writeData({ data: { isAuthenticated: data.data.isAuthenticated } });
    return data.data.isAuthenticated;
  } catch (error) {
    return error;
  }
}

export async function logout(client: ApolloClient<any>|DefaultClient<unknown>): Promise<boolean> {
  try {
    localStorage.removeItem('bat')
    sessionStorage.removeItem('bat')
    client.clearStore()
    client.cache.reset()
    client.resetStore()
    return await verifyAuth(client)
  } catch (error) {
    return error;
  }
}