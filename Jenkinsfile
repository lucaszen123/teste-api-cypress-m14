pipeline {
    agent any

    stages {
        stage('Clonar repositorio') {
            steps {
                git branch: 'main', url:'https://github.com/lucaszen123/teste-api-cypress-m14.git'
            }
        }
        stage('Instalar Dependencias') {
            steps {
                sh 'npm install'
            }
        }
        stage('Executar testes') {
            steps {
                sh 'NO_COLOR=1 npx cypress run'
            }
        }
    }
}
