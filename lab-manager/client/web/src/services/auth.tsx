import DefaultClient, { ApolloClient, gql } from "apollo-boost";

const TOKEN_NAME = 'lafdljdsf'


export function getToken(): string {
  if (typeof Storage !== undefined) {
    return sessionStorage.getItem(TOKEN_NAME) || localStorage.getItem(TOKEN_NAME) || ''
  }
  return ''
}

export function setToken(token: string, keep: boolean): boolean {
  const tring = (tryes: number): boolean => {
    if ((typeof localStorage !== undefined) && (typeof sessionStorage !== undefined)) {
      localStorage.removeItem(TOKEN_NAME)
      sessionStorage.removeItem(TOKEN_NAME)
      keep ? localStorage.setItem(TOKEN_NAME, token) : sessionStorage.setItem(TOKEN_NAME, token)
      return getToken() === token ? true : tring(tryes + 1) ;
    } else {
      return tryes === 3 ? false : tring(tryes + 1)
    }
  }
  return tring(0)
}

export async function setAuth(client: ApolloClient<any> | DefaultClient<unknown>, state: boolean): Promise<boolean>{
  client.writeData({ data: { isAuthenticated: state } });
  return state;
}

export async function verifyAuth(client: ApolloClient<any> | DefaultClient<unknown>): Promise<boolean> {
  try {
    if (getToken() === '') {
      client.writeData({ data: { isAuthenticated: false } });
      return false;
    }
    const { data, errors } = await client.query({
      query: gql`
              query {
                isAuthenticated
              }
            `
    })
    if (errors || !data || data.isAuthenticated === (undefined || null)) return verifyAuth(client)
    setAuth(client, data.isAuthenticated)
    return data.data.isAuthenticated;
  } catch (error) {
    return error;
  }
}

export async function login(client: ApolloClient<any> | DefaultClient<unknown>, token: string, keep: boolean): Promise<boolean> {
  try {
    return setAuth(client, setToken(token, keep))
  } catch (error) {
    return error;
  }
}

export async function logout(client: ApolloClient<any> | DefaultClient<unknown>): Promise<boolean> {
  try {
    localStorage.removeItem(TOKEN_NAME)
    sessionStorage.removeItem(TOKEN_NAME)
    client.clearStore()
    client.cache.reset()
    client.resetStore()
    return await verifyAuth(client)
  } catch (error) {
    return error;
  }
}
