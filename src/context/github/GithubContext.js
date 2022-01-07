import { createContext, useReducer } from 'react'
import GithubReducer from './GithubReducer'
const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
const GITHUB_SEARCH = process.env.REACT_APP_GITHUB_SEARCH
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

const GithubContext = createContext()

export const GithubProvider = ({ children }) => {
  
  const initialState = {
    users: [],
    loading: false,
  }
  const [state, dispatch] = useReducer(GithubReducer, initialState)
  //Get search results
  const searchUsers = async (text) => {
    const params = new URLSearchParams({ q: text })
    // const params = new URLSearchParams({ q: text })
    setLoading()
    const response = await fetch(`${GITHUB_SEARCH}?${params}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    })
    const {items} = await response.json()
    dispatch({
      type: 'GET_USERS',
      payload: items,
    })
  }
  //clear users from state
  const clearUsers = () => {
    dispatch({ type: 'CLEAR_USERS' })
  }
  //Get initial users (testing purposes)
  // const fetchUsers = async () => {
  //   setLoading()
  //   const response = await fetch(`${GITHUB_URL}/users`, {
  //     headers: {
  //       Authorization: `token ${GITHUB_TOKEN}`,
  //     },
  //   })
  //   const data = await response.json()
  //   dispatch({
  //     type: 'GET_USERS',
  //     payload: data,
  //   })
  // }

  const setLoading = () => {
    dispatch({ type: 'SET_LOADING' })
  }
  return (
    <GithubContext.Provider
      value={{ users: state.users, loading: state.loading, searchUsers, clearUsers }}
    >
      {children}
    </GithubContext.Provider>
  )
}

export default GithubContext
