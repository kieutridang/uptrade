const site_url = 'https://demo.uptradecloud.com'
const backend_url = 'https://demo.uptradecloud.com'

const logisticsRow = [
  'unit',
  'packaged',
  'innerCarton',
  'exportCarton',
]

const logisticsCol = [
  'units',
  'l',
  'w',
  'h',
  'netWeight',
  'grossWeight',
  'volume',
  'barCode',
  'pack'
]

describe('Products', function() {
  before(function () {
    cy.request('POST', `${backend_url}/graphql`, { query: 'query {\n  clearTestData\n}' })
  })

  beforeEach(function () {
    cy.visit(`${site_url}`);
    cy.get('input#email').type('janthiftle0@last.fm');
    cy.get('input#password').type('123456');
    cy.get('.option-buttons > button').click();
    cy.url().should('include', '/home');
  })

  it('Get list of products', function() {
    cy.visit(`${site_url}/products/index`)
  })

  it('Create new product', function() {
    describe('Go new product page and fill in required fields', function() {
      cy.visit(`${site_url}/products/index`)
      cy.get('#add-button').click()
      cy.url().should('include', '/products/new')
      cy.get('#create-product-form #product-essentials-form #itemStatus').prev().click()
      cy.contains('Sourcing Product').click()
      cy.get('#create-product-form #product-essentials-form #category').prev().click()
      cy.get('#menu-Category').contains('Agriculture').click()
      cy.get('#create-product-form #product-essentials-form #essentialsItemNumber').type('dummy item #')
      cy.get('#create-product-form #product-essentials-form #itemName').type('dummy item name')
      cy.get('#create-product-form #product-essentials-form #sampleCost').type('1')
      cy.get('#create-product-form #create-button').click()
      cy.url().should('include', '/products/detail/')
      cy.visit(`${site_url}/products/index`)
      cy.get('tr').children().its('length').should('be.gt', 0)
      cy.contains('dummy item #')
    })
  })

  it('Get detail of a product', function () {
    describe('Go to detail page of a product', function () {
      cy.visit(`${site_url}/products/index`)
      cy.contains('dummy item #').click()
      cy.url().should('include', '/products/detail/')
    })
  })

  it('Edit a product', function () {
    describe('Go to detail page of a product', function () {
      cy.visit(`${site_url}/products/index`)
      cy.contains('dummy item #').click()
      cy.url().should('include', '/products/detail/')
    })

    describe('Test editing essentials form', function() {
      cy.get('#product-detail-essentials-form #toggle-edit-save-button').click()
      cy.get('#product-detail-essentials-form #itemNumber').clear().type('edited dummy item #')
      cy.get('#product-detail-essentials-form #itemName').clear().type('edited dummy item name')
      cy.get('#product-detail-essentials-form #sampleCost').clear().type('2')
      cy.get('#product-detail-essentials-form #toggle-edit-save-button').click()
      cy.reload()
      cy.get('#product-detail-essentials-form #itemNumber').should('have.value', 'edited dummy item #')
      cy.get('#product-detail-essentials-form #itemName').should('have.value', 'edited dummy item name')
      cy.get('#product-detail-essentials-form #sampleCost').should('have.value', '2')

    })

    // describe('Test editing suppliers form', function () {
    //   cy.get('#product-detail-supplier-form #toggle-edit-save-add-inline #edit-save-button').click()
    //   cy.get('#supplier\\[0\\]itemNumber').clear().type('edited dummy supplier item #')
    //   cy.get('#product-detail-supplier-form #toggle-edit-save-add-inline #edit-save-button').click()
    //   cy.reload()
    //   cy.get('#product-detail-supplier-form #supplier\\[0\\]itemNumber').should('have.value', 'edited dummy supplier item #')
    // })
    
    // test editing descriptions form
    describe('Test editing descriptions form', function() {
      cy.get('#product-detail-descriptions-form #toggle-edit-save-button').click()
      cy.get('#product-detail-descriptions-form #color').clear().type('edited dummy color')
      cy.get('#product-detail-descriptions-form #customerItemNumber').clear().type('edited dummy customer item number')
      cy.get('#product-detail-descriptions-form #exclusivity').clear().type('edited dummy exclusivity')
      cy.get('#product-detail-descriptions-form #shortDescription').clear().type('edited dummy short description')
      cy.get('#product-detail-descriptions-form #composition').clear().type('edited dummy composition')
      cy.get('#product-detail-descriptions-form #internalRemark').clear().type('edited dummy internal remark')
      cy.get('#product-detail-descriptions-form #longDescription').clear().type('edited dummy long description')
      cy.get('#product-detail-descriptions-form #marketPlaceDescription').clear().type('edited dummy market place description')
      cy.get('#product-detail-descriptions-form #toggle-edit-save-button').click()
      cy.reload()
      cy.get('#product-detail-descriptions-form #color').should('have.value', 'edited dummy color')
      cy.get('#product-detail-descriptions-form #customerItemNumber').should('have.value', 'edited dummy customer item number')
      cy.get('#product-detail-descriptions-form #exclusivity').should('have.value', 'edited dummy exclusivity')
      cy.get('#product-detail-descriptions-form #shortDescription').should('have.value', 'edited dummy short description')
      cy.get('#product-detail-descriptions-form #composition').should('have.value', 'edited dummy composition')
      cy.get('#product-detail-descriptions-form #internalRemark').should('have.value', 'edited dummy internal remark')
      cy.get('#product-detail-descriptions-form #longDescription').should('have.value', 'edited dummy long description')
      cy.get('#product-detail-descriptions-form #marketPlaceDescription').should('have.value', 'edited dummy market place description')
      cy.get('#product-detail-descriptions-form #toggle-edit-save-button').click()

    })
      
    // test editing logistics form
    describe('Test editing logistics form', function() {
      cy.get('#product-detail-logistics-form #toggle-edit-save-button').click()
      cy.get('#product-detail-logistics-form #hsCode').clear().type('edited dummy hsCode')
      logisticsRow.forEach(row => {
        logisticsCol.forEach(col => {
          cy.get(`#product-detail-logistics-form #${row}\\.${col}`).clear().type(1)
        })
      })
      cy.get('#product-detail-logistics-form #toggle-edit-save-button').click()
      cy.reload()
      cy.get('#product-detail-logistics-form #hsCode').should('have.value', 'edited dummy hsCode')
      logisticsRow.forEach(row => {
        logisticsCol.forEach(col => {
          cy.get(`#product-detail-logistics-form #${row}\\.${col}`).should('have.value', '1')
        })
      })
    })
  })

  after(function () {
    cy.request('POST', `${backend_url}/graphql`, { query: 'query {\n  clearTestData\n}' })
  })
})
