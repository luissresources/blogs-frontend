import { useState } from 'react'
import blogService from '../services/blogs'
import './Blog.css'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleBlogs, handleSuccessMessage, addLike }) => {

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
    <div style={ styleSingleBlogList } className='singleBlog'>
      <p>{blog.title} - <span>{blog.author}</span> <button onClick={toggleVisibility} className='btnShowAndHide'>{visible ? 'hide' : 'view'}</button></p>
      <div style={showWhenVisible} className='contentBlogHidden'>
        <p>{blog.url}</p>
        <p>{blog.likes} <span><button onClick={addLike} className='btnLike'>like</button></span></p>
        <button className='btnDelete' onClick={deleteBlog}>delete</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog : PropTypes.object,
  handleBlogs : PropTypes.func,
  handleSuccessMessage : PropTypes.func,
  handleErrorMessage : PropTypes.func
}

export default Blog