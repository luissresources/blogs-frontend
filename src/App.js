import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/forms/LoginForm'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/forms/BlogForm'
import './App.css'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // const blogFormRef = useRef()

  useEffect( () => {
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
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setSuccessMessage('logout')
    setTimeout(() => {
      setSuccessMessage(null)
    },5000)
  }

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
          handleUsernameChange = { ({ target }) => setUsername(target.value) }
          password = { password }
          handlePasswordChange = { ({ target }) => setUsername(target.value) }
        />
        :
        <>
          <div>
            <p>{ user.name } logged in</p><button onClick={ handleLogout }>logout</button>
          </div>
          <div>
            <h3>add blog</h3>
            <Togglable buttonLabel = 'new blog'>
              <BlogForm
                handleBlogs = { (arrBlogs) => setBlogs(arrBlogs)   }
                handleErrorMessage = { (message) => setErrorMessage(message) }
                handleSuccessMessage = { (message) => setSuccessMessage(message) }
              />
            </Togglable>
          </div>
          <div>
            <h2>blogs list:</h2>
            {blogs.map(blog =>
              <div key={blog.id}>
                <div>
                  <Blog
                    blog={blog}
                    handleBlogs = { (arrBlogs) => setBlogs(arrBlogs)   }
                    handleErrorMessage = { (message) => setErrorMessage(message) }
                    handleSuccessMessage = { (message) => setSuccessMessage(message) }
                  />
                </div>
              </div>
            )}
          </div>
        </>
      }
    </div>
  )
}

export default App
