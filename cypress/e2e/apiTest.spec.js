describe('Test API using mocks', () => {
  beforeEach('login', () => {
    cy.loginToApplication()
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', 
      {fixture: 'tags.json'})
  })
/*
  beforeEach('login', () => {
    //Router handler: Listaning for path, can do port, query etc.
    //cy.intercept({method: 'GET', 'tags',
    //Listening for URL
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', 
      {fixture: 'tags.json'})

  })
*/
  it('Verify correct request and responce', () => {
    cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/')
    .as('postArticle')
    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('This is the title')
    cy.get('[formcontrolname="description"]').type('This is description')
    cy.get('[formcontrolname="body"]').type('This is a body of article')
    cy.contains('Publish Article').click()
    cy.wait('@postArticle').then( xhr => {
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.request.body.article.body).to.equal('This is a body of article')
      expect(xhr.response.body.article.body).to.equal('This is a body of article')
    })
    cy.get('button.btn.btn-sm.btn-outline-danger:contains("Delete Article")')
     .click({ multiple: true })
    })
  it('Verify tags are displayed', () => {
      cy.get('.tag-list').should('contain', 'Test')
      .should('contain', 'Cypress Automation')
    })
  it('Verify global feed likes count', () => {
      cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles/feed*',
        {"articles":[],"articlesCount":0})
        cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles*', {fixture: 'articles.json'})
        cy.contains('Global Feed').click()
        cy.get('app-article-list button').then(heartList => {
          expect(heartList[0]).to.contain('999')
        })
        cy.fixture('articles').then(file => {
          const articleLink = file.articles[0].slug
          file.articles[0].favoritesCount = 1000
          cy.intercept('POST', 
            'https://conduit-api.bondaracademy.com/api/articles/'
            +articleLink+'/favorite', file)
        })
        cy.get('app-article-list button').eq(0).click().should('contain', '1000')
    })
})

describe('API Authentication', () => {
  it('Creat Article via API and delete it', () => {
    const userCredentials = {
      "user": {
        "email":"stas@stas.stas",
        "password":"stas"
      }
      }
    const bodyRequest = {
      "article": {
        "title": "API Test",
        "description": "API Test",
        "body": "API Test",
        "tagList": ["API Test"]
      }
    }
    cy.request('POST', 'https://conduit-api.bondaracademy.com/api/users/login', 
      userCredentials)
      .its('body')
      .then(body => {
        const token = body.user.token
        cy.wrap(token).as('authToken')
      })
      //Provide object to include header
      cy.get('@authToken').then(token => {
      cy.request({
        url: 'https://conduit-api.bondaracademy.com/api/articles/',
        headers: {'Authorization': 'Token ' + token},
        method: 'POST',
        body: bodyRequest
      }).then(response => {
        expect(response.status).to.equal(201)
        const articleSlug = response.body.article.slug
        cy.request({
          url: `https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`,
          headers: {'Authorization': 'Token ' + token},
          method: 'DELETE'
        }).then(deleteResponse => {
          expect(deleteResponse.status).to.equal(204); // Assuming a 200 status for successful deletion
        })
      })
    })
  })
})