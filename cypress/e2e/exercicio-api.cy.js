/// <reference types="cypress" />

describe('Testes de Funcionalidade Usuários', () => {
  
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
    }).then((usuario) => {
      expect(usuario).to.have.property('_id')
      expect(usuario).to.have.property('message', 'Cadastro realizado com sucesso')
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

  it('Deve editar um usuário previamente cadastrado e validar alteração', () => {
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
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq('Registro alterado com sucesso')
      })

     
      cy.buscarUsuario(usuario._id).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.include({
          nome: 'Usuário Editado',
          administrador: 'false'
        })
        expect(response.body.email).to.contain('editado')
      })
    })
  })

  it('Deve deletar um usuário previamente cadastrado e validar exclusão', () => {
    cy.criarUsuario({
      nome: 'Usuário Deletar',
      email: `deletar${Date.now()}@qa.com`,
      password: '123456',
      administrador: 'true'
    }).then((usuario) => {
      cy.deletarUsuario(usuario._id).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq('Registro excluído com sucesso')
      })

      
      cy.buscarUsuario(usuario._id, false).then((response) => {
        expect([400, 404]).to.include(response.status)
      })
    })
  })

})
