pipeline {
    agent any

    stages {

        stage('Check Disk Space') {
            steps {
                sh '''
                    DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
                    echo "Current disk usage: $DISK_USAGE%"
                    if [ "$DISK_USAGE" -gt 85 ]; then
                        echo "Disk usage is high. Cleaning up..."
                        docker system prune -af --volumes
                        docker builder prune -af
                        docker image prune -af
                        docker volume prune -f
                        echo "Cleanup completed"
                    fi
                '''
            }
        }
        
        stage('Preparing'){
            steps {
                sh 'echo "Jenkins Pipeline Starting"'
            }
        }

        stage('Clean Up'){
            steps {
                sh '''
                    docker-compose down --rmi all --volumes --remove-orphans
                    docker image prune -f
                    docker volume prune -f
                '''
            }
        }

        stage('Starting Jenkins Pipeline') {
            steps {
                sh 'echo "Jenkinsfile Pipeline Starting"'
            }
        }

        stage('Build Stage') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Deploy Stage') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        failure {
            sh '''
                echo "Pipeline failed, performing emergency cleanup..."
                docker system prune -af --volumes
                docker builder prune -af
                echo "Emergency cleanup completed"
            '''
        }
    }
}