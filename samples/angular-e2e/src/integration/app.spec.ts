describe('Renderer', () => {
  beforeEach(() => cy.visit('/'));

  it('should show two input nodes', () => {
    const node1 = cy.get('#node-1');
    const node2 = cy.get('#node-2');

    node1.should('exist');
    node2.should('exist');

    cy.get('#node-1 > .control > ng-component > input').should('have.value', 2);
    cy.get('#node-2 > .control > ng-component > input').should('have.value', 3);
  });

  it('should have one add node', () => {
    const add = cy.get('#node-3');
    add.should('exist');

    cy.get('#node-3 > .control > ng-component > input').should('have.value', 5);
  });

  it('should have two connections', () => {
    cy.get('.connection').its('length').should('eq', 2);
  });
});
