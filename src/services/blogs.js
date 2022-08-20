import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)

  const compareLikes = (a, b) => {
    if (a.likes  < b.likes) {
      return -1
    }

    if (a.likes > b.likes) {
      return 1
    }

    return 0
  }

  return request.data.sort(compareLikes)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  console.log({ baseUrl }, { id }, typeof id, `${ baseUrl } /${id}`,)

  const request = await axios.put(`${ baseUrl }/${id}`, newObject, config)
  console.log({ request })
  return request.data
}

const blogService = { getAll, create, update, setToken }

export default blogService