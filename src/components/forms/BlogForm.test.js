import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('blogForm', () => {

  test.only('test onSubmit', () => {

    const addBlog = jest.fn()

    const component = render(
      <BlogForm  createBlog={() => addBlog(newBlog)}/>
    )

    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')

    fireEvent.change(title, {
      target: {
        value: 'test blog'
      }
    })

    fireEvent.change(author, {
      target: {
        value: 'Luis Sanchez'
      }
    })

    fireEvent.change(url, {
      target: {
        value: 'http:luiss.dev'
      }
    })

    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value
    }

    const form = component.container.querySelector('form')
    fireEvent.submit(form)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0]).toEqual(newBlog)
  })
})