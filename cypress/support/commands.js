Cypress.Commands.add('criarUsuario', (usuario) => {
  return cy.request('POST', '/usuarios', usuario).then((response) => {
    expect(response.status).to.eq(201)
    expect(response.body.message).to.eq('Cadastro realizado com sucesso')
    return response.body // retorna os dados do usuário criado
  })
})

Cypress.Commands.add('editarUsuario', (userId, usuario) => {
  return cy.request('PUT', `/usuarios/${userId}`, usuario).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body.message).to.eq('Registro alterado com sucesso')
    return response.body
  })
})

Cypress.Commands.add('deletarUsuario', (userId) => {
  return cy.request('DELETE', `/usuarios/${userId}`).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body.message).to.eq('Registro excluído com sucesso')
    return response.body
  })
})
