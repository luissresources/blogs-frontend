describe('blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user1 = {
      name: 'Luis Sanchez',
      username: 'luissdev',
      password: 'letsgo'
    }

    cy.request('POST', 'http://localhost:3003/api/users', user1)

    const user2 = {
      name: 'John Doe',
      username: 'johndoe',
      password: 'letsgo'
    }

    cy.request('POST', 'http://localhost:3003/api/users', user2)

    cy.visit('http://localhost:3000')
  })

  it('show login form', function() {
    cy.get('form')
    cy.get('#username')
    cy.get('#password')
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.login({
        username: 'luissdev',
        password: 'letsgo'
      })

      cy.contains('Luis Sanchez logged in')
    })

    it('fails with wrong credential', function() {
      cy.get('#username').type('luissdev')
      cy.get('#password').type('le')
      cy.contains('login').click()

      cy.get('.error')
        .should('contain','Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({
        username: 'luissdev',
        password: 'letsgo'
      })

      cy.visit('http://localhost:3000')

      cy.create({
        title : 'test blog 0',
        author: 'Luis Sanchez',
        url: 'http://localhost:3000/api/blogs'
      })

      cy.create({
        title : 'test blog 1',
        author: 'Luis Sanchez',
        url: 'http://localhost:3000/api/blogs',
        likes: 2
      })

      cy.get('.singleBlog').should('contain', 'test blog 1').parent().as('firstSingleBlog')
      cy.get('@firstSingleBlog').contains('view').click()
      cy.get('@firstSingleBlog').contains('like').click()

      cy.contains('test blog 1')
    })

    it('A blog can be created', function() {
      cy.create({
        title : 'test blog 2',
        author: 'Luis Sanchez',
        url: 'http://localhost:3000/api/blogs'
      })
      cy.contains('test blog 2')
    })

    it('likes', function() {
      cy.get('.singleBlog').should('contain', 'test blog 1').parent().as('firstSingleBlog')
      cy.get('@firstSingleBlog').contains('view').click()
      cy.get('@firstSingleBlog').contains('0')
      cy.get('@firstSingleBlog').contains('like').click()
      cy.get('@firstSingleBlog').contains('1')
    })

    it('delete single blog', function() {
      cy.create({
        title : 'test blog 3',
        author: 'Luis Sanchez',
        url: 'http://localhost:3000/api/blogs'
      })

      cy.get('.singleBlog').should('contain','test blog 3').parent().as('blogToDelete')
      cy.get('@blogToDelete').contains('view').click()
      cy.get('@blogToDelete').contains('delete').click()
      cy.get('@blogToDelete').not('test blog 3')
    })

    describe('user not authorized', function() {
      beforeEach('user without authorization', function() {
        cy.get('html').contains('logout').click()
        cy.login({
          username: 'johndoe',
          password: 'letsgo'
        })
      })

      it('delete single blog', function() {
        cy.get('.singleBlog').should('contain','test blog 1').parent().as('blogToDelete')
        cy.get('@blogToDelete').contains('view').click()
        Cypress.on('uncaught:exception', (err, runnable, promise) => {
          // when the exception originated from an unhandled promise
          // rejection, the promise is provided as a third argument
          // you can turn off failing the test in this case
          if (promise) {
            return false
          }
          // we still want to ensure there are no other unexpected
          // errors, so we let them fail the test
        })

        cy.get('@blogToDelete').contains('delete').click()
        cy.get('@blogToDelete').contains('test blog 1')
      })
    })

    describe('likes array', function() {
      it.only('verify sort blogs by likes', function() {
        let arrQuantityLikes = []
        cy.get('.btnShowAndHide')
          .then(response => {
            console.log(response)
            for(let element of response) {
              cy.get(element).click()
            }
          })

        cy.get('span[class="numberLikes"]').as('nLikes')
        cy.get('@nLikes')
          .then(elements => {
            for(let ele of elements) {
              console.log(ele.innerText)
              arrQuantityLikes = [...arrQuantityLikes, ele.innerText]
            }
          })
          .then(() => {
            console.log({ arrQuantityLikes })
            cy.get('.numberLikes')
              .then($items => {
                return $items.map((index,html) => Cypress.$(html).text()).get()
              })
              .should('deep.eq', ['1','0'])
          })
      })
    })
  })
})