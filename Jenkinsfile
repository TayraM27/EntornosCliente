pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {
        stage('Install') {
            steps {
                dir('cyber-escape') {
                    bat 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                dir('cyber-escape') {
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                dir('cyber-escape') {
                    bat 'firebase deploy --token %FIREBASE_TOKEN%'
                }
            }
        }
    }
}
