describe('Retirement budget planner - End to End test', () => {
  beforeEach(() => cy.visit('/'));

  it('should return 200 when root url accessed ', () => {
    cy.request({
      url: '/',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
