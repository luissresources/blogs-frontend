// import { useState } from 'react'
// import blogService from '../../services/blogs'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog, onChangeTitle, title, onChangeAuthor, author, onChangeUrl, url }) => {

  const addBlog = e => {
    e.preventDefault()
    createBlog({
      title,
      author,
      url
    })
  }

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
  addBlog : PropTypes.func,
  onChangeTitle: PropTypes.func,
  onChangeAuthor: PropTypes.func,
  onChangeUrl: PropTypes.func,
  title: PropTypes.string,
  author: PropTypes.string,
  url: PropTypes.string
}

export default BlogForm