describe('tools-index-e2e', () => {
  beforeEach(() => cy.visit('http://localhost:4396/en/sdlt'));

  it('should display welcome message', () => {
    expect(true).to.equal(true); //blank test
  });
});
