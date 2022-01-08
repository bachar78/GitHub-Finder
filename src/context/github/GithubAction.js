import axios from 'axios'
const GITHUB_SEARCH = process.env.REACT_APP_GITHUB_SEARCH
const GITHUB_USER = process.env.REACT_APP_GITHUB_USER
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN
const GITHUB_URL = process.env.REACT_APP_GITHUB_URL

//create an axios url
const github = axios.create({
  baseURL: GITHUB_URL,
  headers: { Authorization: `${GITHUB_TOKEN}` },
})

//Get search results
export const searchUsers = async (text) => {
  const params = new URLSearchParams({ q: text })
  const response = await github.get(`/search/users?${params}`)
  return response.data.items
}

//Get user and repos
export const getUserAndRepos = async (login) => {
  const [user, repos] = await Promise.all([
    github.get(`/users/${login}`),
    github.get(`users/${login}/repos`),
  ])
  return { user: user.data, repos: repos.data }
}
