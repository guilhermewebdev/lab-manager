import DefaultClient, { ApolloClient, gql } from "apollo-boost";

export async function verifyAuth(client: ApolloClient<any> | DefaultClient<unknown>): Promise<boolean> {
  try {
    const { data, errors } = await client.query({
      query: gql`
              query {
                isAuthenticated
              }
            `
    })
    if (errors || !data || data.isAuthenticated === (undefined || null)) return verifyAuth(client)
    alert(data.isAuthenticated)
    client.writeData({ data: { isAuthenticated: data.isAuthenticated } });
    return data.data.isAuthenticated;
  } catch (error) {
    return error;
  }
}

export async function login(client: ApolloClient<any> | DefaultClient<unknown>, token: string, keep: boolean): Promise<boolean> {
  try {
    localStorage.removeItem('bat')
    sessionStorage.removeItem('bat')
    keep ? localStorage.setItem('bat', token) : sessionStorage.setItem('bat', token)

    return await verifyAuth(client)
  } catch (error) {
    return error; 
  }
}

export async function logout(client: ApolloClient<any> | DefaultClient<unknown>): Promise<boolean> {
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