describe('The Github Search App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Can search by user', () => {
    cy.intercept('POST', 'https://api.github.com/graphql', (req) => {
      if (req.body.operationName === 'getRepositories') {
        console.log('SUCCESS');
        req.reply({ statusCode: 200, fixture: 'success.json' });
      }
    }).as('GithubAPI');

    cy.get('input').type('user:syndio{enter}');

    cy.get('[data-testid="data-card"]').should('exist');
  });

  it('Can search by stargazer count', () => {
    cy.intercept('POST', 'https://api.github.com/graphql', (req) => {
      if (req.body.operationName === 'getRepositories') {
        console.log('SUCCESS');
        req.reply({ statusCode: 200, fixture: 'success.json' });
      }
    }).as('GithubAPI');

    cy.get('input').type('stars:0..10{enter}');

    cy.get('[data-testid="data-card"]').should('exist');
  });

  it('Displays an error when using the wrong stars syntax', () => {
    cy.get('input').type('stars:0-10{enter}');

    cy.get('[data-testid="syntax-error"]').should(
      'have.text',
      'To search by stargazers use "stars:<number> or "<number>..<number>" for a range.',
    );
  });

  it('Displays an error when the query fails tests', () => {
    cy.get('input').type('username:bob stars:0..100{enter}');

    cy.get('[data-testid="syntax-error"]').should(
      'have.text',
      'Please use the "user:<username>" and/or "stars:<number>..<number>" search format.',
    );
  });
});
