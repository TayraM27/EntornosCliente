pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {
        stage('Install') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                bat 'firebase deploy --token %FIREBASE_TOKEN%'
            }
        }
    }
}
