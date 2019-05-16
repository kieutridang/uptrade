import moment from 'moment'
const site_url = 'https://demo.uptrade.co'

describe('Events', function() {
  before(function() {
    cy.request('POST', `${site_url}/graphql`, { query: 'query {\n  clearTestData\n}' })
    cy.visit(site_url, { timeout: 180000 })
    cy.get('input#email').type('janthiftle0@last.fm')
    cy.get('input#password').type('123456')
    cy.get('.option-buttons > button').click()
    cy.url().should('include', '/home')
  })
  it('Visit Event list page then do create new event', function() {
    cy.visit(`${site_url}/events/index`)
    describe('Create new event', function() {
      cy.get('#add-button').click()
      cy.url().should('include', '/events/new')
      cy.get('#create-event-form #name').type('Tivi Show DummyData')
      cy.get('#create-event-form #startDate').type(moment().format('YYYY-MM-DD'))
      cy.get('#create-event-form #endDate').type(moment().format('YYYY-MM-DD'))
      cy.get('#create-event-form #save-button').click()
      cy.url().should('include', '/events/parameters/')
      cy.visit(`${site_url}/events/index`)
      cy.get('.row').children().its('length').should('be.gt', 0)
    })

    describe('Edit the event settings', function() {
      cy.get('#events-list > div > div:last-child a.to-parameters-link').click({ force: true })
      cy.url().should('include', '/events/parameters')
      cy.get('#edit-event-settings-form > div > div.box-header > ul > li > button').click({ force: true })
      cy.get('#edit-event-settings-form #name').clear()
      cy.get('#edit-event-settings-form #name').type('Music Show DummyData')
      cy.get('#edit-event-settings-form #startDate').type(moment().format('YYYY-MM-DD'))
      cy.get('#edit-event-settings-form #endDate').type(moment().format('YYYY-MM-DD'))
      cy.get('#edit-event-settings-form > div > div.box-header > ul > li > div > button').click({ force: true })
      cy.reload(true)
      cy.get('#edit-event-settings-form #name').should('have.value', 'Music Show DummyData')
    })

    describe('Edit the event participants', function() {
      cy.get('#edit-event-participants-form > div.box.box-default > div.box-header > ul > li:nth-child(1) > button').click()
      cy.get('#participant-item-container_0 .toogle-expaned-button').click()
      cy.get('#participant-item-container_0 .defaultMarginField input').clear()
      cy.get('#participant-item-container_0 .defaultMarginField input').type(70)
      cy.get('#participant-item-container_0 .checklabel:nth-child(1) input').uncheck()
      cy.get('#participant-item-container_0 .checklabel:nth-child(1) input').check()
      cy.get('#edit-event-participants-form > div.box.box-default > div.box-header > ul > li:nth-child(1) > div > button').click({ force: true })
      cy.reload(true)
      cy.get('#participant-item-container_0 .defaultMarginField input').should('have.value', '70')
      cy.get('#participant-item-container_0 .checklabel:nth-child(1) input').should('be.checked')
    })

    describe('Create the event product', function() {
      cy.get('#event-product-list-button').click()
      cy.url().should('include', '/products')
      cy.get('.add-button').click()
      cy.url().should('include', '/products/new')
      cy.get('#create-event-product-form #category').prev().click({})
      cy.get('#menu-Category').contains('Electronics').click();
      cy.get('#create-event-product-form #itemName').type('ProductAlt DummyData')
      cy.get('#create-event-product-form #essentialsItemNumber').type('100')
      cy.get('#create-event-product-form #sampleCost').type('1000')
      cy.get('#create-event-product-button').click()
      cy.url().should('include', '/products/')
      // cy.location(loc => {
      //   const pathname = loc.pathname
      //   const pathnameArray = pathname.split('/')
      //   const eventProductId = pathnameArray[2]
      //   cy.visit(`/events/${eventProductId}/products`)
      //   cy.get('#event-product-list').children().its('length').should('be.gt', 0)
      // })
    })
  })
})
