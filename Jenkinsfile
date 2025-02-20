pipeline {
    agent any

    environment {
        NODEJS_HOME = tool 'NodeJS 18'  // Adjust this based on your Node.js setup in Jenkins
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                 sh 'cp /var/www/client/.env ./'
                sh 'npm run build'
            }
        }

        stage('Deploy (Optional)') {
            steps {
                sh 'cp -r dist/* /home/turkish-kebab-pizza-house/public_html/'  // Change based on your deployment method
            }
        }
    }
}