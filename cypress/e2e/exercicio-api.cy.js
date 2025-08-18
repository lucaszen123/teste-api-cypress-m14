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
    cy.request('POST', '/usuarios', {
      nome: 'Usuário Teste',
      email: `teste${Date.now()}@qa.com`,
      password: '123456',
      administrador: 'true'
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.message).to.eq('Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id')
    })
  })

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: '/usuarios',
      failOnStatusCode: false, // para capturar o erro sem quebrar
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
    cy.request('POST', '/usuarios', {
      nome: 'Usuário Editar',
      email: `editar${Date.now()}@qa.com`,
      password: '123456',
      administrador: 'true'
    }).then((res) => {
      const userId = res.body._id

      cy.request('PUT', `/usuarios/${userId}`, {
        nome: 'Usuário Editado',
        email: `editado${Date.now()}@qa.com`,
        password: '654321',
        administrador: 'false'
      }).then((respPut) => {
        expect(respPut.status).to.eq(200)
        expect(respPut.body.message).to.eq('Registro alterado com sucesso')
      })
    })
  })

  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.request('POST', '/usuarios', {
      nome: 'Usuário Deletar',
      email: `deletar${Date.now()}@qa.com`,
      password: '123456',
      administrador: 'true'
    }).then((res) => {
      const userId = res.body._id

      cy.request('DELETE', `/usuarios/${userId}`).then((respDel) => {
        expect(respDel.status).to.eq(200)
        expect(respDel.body.message).to.eq('Registro excluído com sucesso')
      })
    })
  })

})
