import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/forms/LoginForm'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/forms/BlogForm'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage('Logged')
      setTimeout(() => {
        setSuccessMessage(null)
      },5000)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = e => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setSuccessMessage('logout')
    setTimeout(() => {
      setSuccessMessage(null)
    },5000)
  }

  const addBlog = e => {
    e.preventDefault()
    const newBlog = {
      title,
      author,
      url
    }
    blogService.create(newBlog)
      .then( () => {
        setSuccessMessage(`Blog - ${title}: Added`)
        setTimeout(() => {
          setSuccessMessage(null)
        },5000)
        blogService.getAll()
          .then(result => {
            setBlogs(result)
          })
      })
      .catch( error => {
        setErrorMessage('Bad request')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const onChangeTitle = e => setTitle(e.target.value)
  const onChangeUrl = e => setUrl(e.target.value)
  const onChangeAuthor = e => setAuthor(e.target.value)

  return (
    <div>
      <h1>Blogs</h1>
      <div>
      <Notification 
        message={successMessage ? successMessage : errorMessage ? errorMessage : null}
        type={successMessage ? 'success' : errorMessage ? 'error' : null }    
      />
      </div>
      { user === null 
        ? 
          <LoginForm
            handleLogin= { handleLogin }
            username = { username }
            setUsername = { setUsername }
            password = { password }
            setPassword = { setPassword }
          />
        : 
          <>
            <div>
              <p>{ user.name } logged in</p><button onClick={ handleLogout }>logout</button>
            </div>
            <div>
              <h3>add blog</h3>
              <BlogForm 
                author = { author }
                onChangeAuthor = { onChangeAuthor }
                title = { title }
                onChangeTitle  = { onChangeTitle }
                url = { url }
                onChangeUrl = { onChangeUrl }
                addBlog = { addBlog }
              />
            </div>
            <div>
              <h2>blogs list:</h2>
              {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
              )}
            </div>
          </>
      }
    </div>
  )
}

export default App
