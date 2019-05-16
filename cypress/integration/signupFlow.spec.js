const site_url = 'https://demo.uptrade.co'

describe('Signup flow (happy case)', function() {
  before(function() {
    cy.request('POST', `${site_url}/graphql`, { query: 'query {\n  clearTestData\n}' })
  })

  it('should go to login page >> click signup link >> go to sign up page', function() {
    cy.visit(`${site_url}/user/login`)
    cy.get('.additional-info > a:nth-child(1)').click()
    cy.url().should('include', '/user/signup')
  })
  it('Fill info of signup user', function() {
    cy.get('#companyUptradeID').type('DEMOCO')
    cy.get('#firstName').type('Duy')
    cy.get('#lastName').type('Bui')
    cy.get('#email').type('duybui@mt2015.com')
    cy.get('#password').type('123456')
    cy.get('.option-buttons > button').click({ multiple: true })
    cy.url().should('include', '/home')
  })
  it('Should check user receive new email', function() {
    cy.visit('http://www.mytrashmail.com/')
    cy.get('#ctl00_ContentPlaceHolder2_txtAccount').type('duybui')
    cy.get('#ctl00_ContentPlaceHolder2_cmdGetMail').click()
    cy.get('#Table1 > tbody > tr:nth-child(2)').contains('Welcome to Uptrade')
  })
})
