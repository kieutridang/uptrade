const site_url = 'https://demo.uptrade.co'

describe('Client flow testing', function() {
  before(function() {
    cy.request('POST', `${site_url}/graphql`, {
      query: 'query {\n  clearTestData\n}'
    });
    cy.visit(`${site_url}/super-admin/login`);
    cy.contains('ADMIN ACCESS');
    cy.get('input#email').type('antoine@kafudigital.com');
    cy.get('input#password').type('UpTradeSA-2018');
    cy.get('.option-buttons > button').click();
    cy.url().should('include', '/clients');
  });
  beforeEach(function() {
    window.localStorage.setItem('role', 'superAdmin')
  })

  after(function() {
    cy.request('POST', `${site_url}/graphql`, {
      query: 'query {\n  clearTestData\n}'
    });
  })

  describe('Create client', function() {
    it('Create client detail', function() {
      cy.get('[data-cy=add-client]').click();
      cy.get('[data-cy=status]').click();
      cy.contains('Active').click();
      cy.get('[data-cy=registration]').click();
      cy.contains('Manual').click();
      cy.get('input#usersLimit')
        .clear()
        .type(`${Math.floor(Math.random() * 1000)}`);
      cy.get('input#uptradeID')
        .clear()
        .type(`NewID`);
      cy.get('input#name')
        .clear()
        .type('New Name');
      cy.get('input#fullName')
        .clear()
        .type('New Full Name');
      cy.get('[data-cy=save-button]').click();
    });
    it('Get client detail', function() {
      cy.visit(`${site_url}/clients`)
      cy.contains('NewID').click()
    })
  });

  describe('Edit client detail', function() {
    it('Edit company info', function() {
      cy.contains('Company')
        .get('[data-cy=edit]')
        .click();
      cy.get('input#usersLimit')
        .clear()
        .type(`${Math.floor(Math.random() * 1000)}`);
      cy.get('input#uptradeID')
        .clear()
        .type('NewEditID');
      cy.get('input#name')
        .clear()
        .type('New Name');
      cy.get('input#fullName')
        .clear()
        .type('New Full Name');
      cy.get('[data-cy=submit]').click();
    });
    describe('Create and Update admin', function() {
      it('Create admin', function() {
        cy.get('button#add-button')
          .first()
          .click();
        cy.get('input#email').type(
          `testemail@yopmail.com`
        );
        cy.get('input#firstName').type('John');
        cy.get('input#lastName').type('Kai');
        cy.get('[data-cy=accountType]').click();
        cy.contains('ADMIN').click();
        cy.get('[data-cy=save-button]').click();
      });
      it('Edit admin', function() {
        cy.wait(500)
        cy.get('button[data-cy=edit-user-card]')
          .first()
          .click();
        cy.contains('User Profile')
          .get('[data-cy=edit-user]')
          .click();
        cy.get('input#email')
          .clear()
          .type(`testemailedited@yopmail.com`);
        cy.get('input#firstName')
          .clear()
          .type('John');
        cy.get('input#lastName')
          .clear()
          .type('Kai');
        cy.get('[data-cy=accountType]').click();
        cy.contains('ADMIN').click();
        cy.get('button[data-cy=save-user]').click();
      });
    })
    describe('Create and Update user', function() {
      it('Create user', function() {
        cy.get('button#add-button')
          .eq(1)
          .click();
        cy.get('input#email').type(
          `testemailuser@yopmail.com`
        );
        cy.get('input#firstName').type('John');
        cy.get('input#lastName').type('Kai');
        cy.get('[data-cy=accountType]').click();
        cy.contains('INTERN').click();
        cy.get('[data-cy=save-button]').click();
      });
      it('Edit user', function() {
        cy.wait(500)
        cy.get('button[data-cy=edit-user-card]')
          .eq(1)
          .click();
        cy.contains('User Profile')
          .get('[data-cy=edit-user]')
          .click();
        cy.get('input#email')
          .clear()
          .type(`testemailuseredited@yopmail.com`);
        cy.get('input#firstName')
          .clear()
          .type('John');
        cy.get('input#lastName')
          .clear()
          .type('Kai');
        cy.get('[data-cy=accountType]').click();
        cy.contains('INTERN').click();
        cy.get('button[data-cy=save-user]').click();
      });
    })
  });
});
