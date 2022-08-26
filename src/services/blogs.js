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
      return 1
    }

    if (a.likes > b.likes) {
      return -1
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

  const request = await axios.put(`${ baseUrl }/${id}`, newObject, config)
  return request.data
}

const remove = async(id) => {
  const config = {
    headers: { Authorization: token },
  }

  await axios.delete(`${baseUrl}/${id}`, config)
}

const blogService = { getAll, create, update, remove, setToken }

export default blogService