import { useState } from 'react'
import blogService from '../services/blogs'
import './Blog.css'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleBlogs, handleSuccessMessage }) => {

  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const styleSingleBlogList = {
    border: '1px solid black',
    padding: '0.5rem',
    backgroundColor: '#F6F5F5',
    margin: '0.5rem 0'
  }

  const addLike = async () => {
    const newObject = {
      title : blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes += 1
    }
    await blogService
      .update(blog.id, newObject)
    const updateBlogs = await blogService.getAll()
    handleBlogs(updateBlogs)
  }

  const deleteBlog = async () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService
        .remove(blog.id)
      handleSuccessMessage(`Item "${blog.title}" deleted`)
      const blogs = await blogService.getAll()
      handleBlogs(blogs)
    }
  }

  return (
    <div style={ styleSingleBlogList }>
      <p>{blog.title} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button></p>
      <div style={showWhenVisible}>
        <p>{blog.author}</p>
        <p>{blog.url}</p>
        <p>{blog.likes} <span><button onClick={addLike}>like</button></span></p>
        <button className='btnDelete' onClick={deleteBlog}>delete</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog : PropTypes.object,
  handleBlogs : PropTypes.func.isRequired,
  handleSuccessMessage : PropTypes.func,
  handleErrorMessage : PropTypes.func
}

export default Blog