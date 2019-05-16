const site_url = 'https://demo.uptrade.co'

describe('Login flow happy case', function () {
  describe('User Login', function () {
    it('Go to the site and check for login redirect', function () {
      cy.visit(site_url)
      cy.url().should('include', '/user/login')
    })
    it('Do login then check if redirect to home', function () {
      cy.get('input#email').type('janthiftle0@last.fm')
      cy.get('input#password').type('123456')
      cy.get('.option-buttons > button').click()
      cy.url().should('include', '/home')
    })
    it('Do logout then check if redirect to user login again', function () {
      cy.get('button.nav_bar_button').click({ multiple: true })
      cy.get('#logout').click()
      cy.url().should('include', '/user/login')
    })
  })
  describe('Admin Login', function () {
    it('Go to the site', function () {
      cy.visit(`${site_url}/super-admin/login`)
      cy.contains('ADMIN ACCESS')
    })
    it('Do login then check if redirect to clients', function () {
      cy.get('input#email').type('antoine@kafudigital.com')
      cy.get('input#password').type('UpTradeSA-2018')
      cy.get('.option-buttons > button').click()
      cy.url().should('include', '/clients')
    })
    it('Do logout then check if redirect to user login again', function () {
      cy.get('button.nav_bar_button').click({ multiple: true })
      cy.get('#logout').click()
      cy.url().should('include', '/user/login')
    })
  })
})
