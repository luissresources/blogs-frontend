import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({blog, setBlogs}) => {

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
    console.log({ blog })
    const newObject = {
      title : blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes += 1
    }
    console.log({ newObject })
    await blogService
    .update(blog.id, newObject)
    const updateBlogs = await blogService.getAll()
    setBlogs(updateBlogs)  
  }

  return (
    <div style={ styleSingleBlogList }>
      <p>{blog.title} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button></p>
     <div style={showWhenVisible}>
      <p>{blog.author}</p>
      <p>{blog.url}</p>
      <p>{blog.likes} <span><button onClick={addLike}>like</button></span></p>
     </div>
    </div>  
  )
}

export default Blog