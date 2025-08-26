
Cypress.Commands.add('criarUsuario', (usuario) => {
  return cy.request('POST', '/usuarios', usuario).then((response) => {
    expect(response.status).to.eq(201)
    expect(response.body.message).to.eq('Cadastro realizado com sucesso')
    return response.body 
  })
})


Cypress.Commands.add('editarUsuario', (userId, usuario) => {
  return cy.request('PUT', `/usuarios/${userId}`, usuario)
})


Cypress.Commands.add('deletarUsuario', (userId) => {
  return cy.request('DELETE', `/usuarios/${userId}`)
})


Cypress.Commands.add('buscarUsuario', (userId, failOnStatusCode = true) => {
  return cy.request({
    method: 'GET',
    url: `/usuarios/${userId}`,
    failOnStatusCode 
  })
})
