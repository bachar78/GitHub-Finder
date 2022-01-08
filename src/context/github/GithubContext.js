import { createContext, useReducer } from 'react'
import GithubReducer from './GithubReducer'
const GITHUB_SEARCH = process.env.REACT_APP_GITHUB_SEARCH
const GITHUB_USER = process.env.REACT_APP_GITHUB_USER
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

const GithubContext = createContext()

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  }
  const [state, dispatch] = useReducer(GithubReducer, initialState)
  //Get search results
  const searchUsers = async (text) => {
    const params = new URLSearchParams({ q: text })
    setLoading()
    const response = await fetch(`${GITHUB_SEARCH}${params}`, {
      headers: { Authorization: `${GITHUB_TOKEN}` },
    })
    const { items } = await response.json()
    dispatch({
      type: 'GET_USERS',
      payload: items,
    })
  }
  //Get single user
  const getUser = async (login) => {
    setLoading()
    const response = await fetch(`${GITHUB_USER}${login}`, {
      headers: { Authorization: `${GITHUB_TOKEN}` },
    })
    if (response.status === 404) {
      window.location = '/notfound'
    } else {
      const data = await response.json()
      dispatch({
        type: 'GET_USER',
        payload: data,
      })
    }
  }
  //Get user repos
  const getUserRepos = async (login) => {
    setLoading()
    const response = await fetch(`${GITHUB_USER}${login}/repos`, {
      headers: { Authorization: `${GITHUB_TOKEN}` },
    })
    const data = await response.json()
    dispatch({
      type: 'GET_REPOS',
      payload: data,
    })
  }
  //clear users from state
  const clearUsers = () => {
    dispatch({ type: 'CLEAR_USERS' })
  }
  

  const setLoading = () => {
    dispatch({ type: 'SET_LOADING' })
  }
  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        getUser,
        clearUsers,
        getUserRepos
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}

export default GithubContext
