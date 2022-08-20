import { useState } from 'react'
import blogService from '../../services/blogs'
import PropTypes from 'prop-types'

const BlogForm = ({ handleBlogs, handleErrorMessage, handleSuccessMessage }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async e => {
    e.preventDefault()
    const newBlog = {
      title,
      author,
      url
    }
    await blogService.create(newBlog)
    handleSuccessMessage(`Blog - ${title}: Added`)
    setTimeout(() => {
      handleSuccessMessage(null)
    },5000)
    const result = await blogService.getAll()
    try {
      handleBlogs(result)
    } catch (exception) {
      handleErrorMessage('Bad request')
      setTimeout(() => {
        handleErrorMessage(null)
      }, 5000)
    }

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const onChangeTitle = e => setTitle(e.target.value)
  const onChangeUrl = e => setUrl(e.target.value)
  const onChangeAuthor = e => setAuthor(e.target.value)

  return (
    <form onSubmit={ addBlog }>
      <div>
        <label htmlFor='title'>title</label>
        <input type='text' id='title' value={ title } onChange = { onChangeTitle }/>
      </div>
      <div>
        <label htmlFor='author'>author</label>
        <input type='text' id='author' value={ author } onChange = { onChangeAuthor } />
      </div>
      <div>
        <label htmlFor="url">url</label>
        <input type='text' id='url' value = { url } onChange = { onChangeUrl } />
      </div>
      <button type="submit">Add</button>
    </form>
  )
}

BlogForm.propTypes = {
  handleBlogs : PropTypes.func.isRequired,
  handleErrorMessage: PropTypes.func.isRequired,
  handleSuccessMessage: PropTypes.func.isRequired
}

export default BlogForm