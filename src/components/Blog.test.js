import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import Togglable from './Togglable'

describe('Blogs - Togglable', () => {
  let component
  let blog

  beforeEach(() => {
    blog = {
      title : 'test blog',
      author: 'Luis Sanchez',
      likes: 10,
      url: 'http:luiss.dev'
    }

    component = render(
      <Togglable buttonLabel='add blog'>
        <Blog blog={blog}/>
      </Togglable>
    )
  })

  test('show only the name blog and author', () => {
    const contentHidden = component.container.querySelector('.contentBlogHidden')
    expect(contentHidden).toHaveStyle('display: none')
  })

  test('show url and likes after clicking view button', () => {
    const buttonHide = component.getByText('view')
    const contentHidden = component.container.querySelector('.contentBlogHidden')

    fireEvent.click(buttonHide)

    expect(buttonHide).toHaveTextContent('hide')
    expect(contentHidden).not.toHaveStyle('display:none')
  })

  test('verify calls to the function that adds likes', () => {
    const addLike = jest.fn()

    const blog = {
      title : 'test blog',
      author: 'Luis Sanchez',
      likes: 10,
      url: 'http:luiss.dev'
    }

    const component2 = render(
      <Blog blog={blog} addLike={addLike}/>
    )

    const buttonLike = component2.container.querySelector('.btnLike')
    fireEvent.click(buttonLike)
    fireEvent.click(buttonLike)

    expect(addLike.mock.calls).toHaveLength(2)
  })
})

