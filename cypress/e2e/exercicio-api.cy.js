/// <reference types="cypress" />

describe('Testes da Funcionalidade Usuários', () => {
  
  it('Deve validar contrato de usuários', () => {
    cy.request('/usuarios').then((response) => {
      expect(response.status).to.eq(200)

      expect(response.body).to.have.property('quantidade')
      expect(response.body).to.have.property('usuarios')

      response.body.usuarios.forEach((usuario) => {
        expect(usuario).to.include.keys('_id', 'nome', 'email', 'administrador')
        if (usuario.password) {
          expect(usuario.password).to.be.a('string')
        }
      })
    })
  })

  it('Deve listar usuários cadastrados', () => {
    cy.request('/usuarios').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.usuarios).to.be.an('array')
      expect(response.body.usuarios.length).to.be.greaterThan(0)
    })
  })

 it('Deve cadastrar um usuário com sucesso', () => {
  cy.criarUsuario({
    nome: 'Usuário Teste',
    email: `teste${Date.now()}@qa.com`,
    password: '123456',
    administrador: 'true'
  })
})

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: '/usuarios',
      failOnStatusCode: false, 
      body: {
        nome: 'Usuário Inválido',
        email: 'email_invalido',
        password: '123456',
        administrador: 'true'
      }
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('email')
      expect(response.body.email).to.eq('email deve ser um email válido')
    })
  })

  it('Deve editar um usuário previamente cadastrado', () => {
  cy.criarUsuario({
    nome: 'Usuário Editar',
    email: `editar${Date.now()}@qa.com`,
    password: '123456',
    administrador: 'true'
  }).then((usuario) => {
    cy.editarUsuario(usuario._id, {
      nome: 'Usuário Editado',
      email: `editado${Date.now()}@qa.com`,
      password: '654321',
      administrador: 'false'
    })
  })
})

 it('Deve deletar um usuário previamente cadastrado', () => {
  cy.criarUsuario({
    nome: 'Usuário Deletar',
    email: `deletar${Date.now()}@qa.com`,
    password: '123456',
    administrador: 'true'
  }).then((usuario) => {
    cy.deletarUsuario(usuario._id)
  })
})

})
