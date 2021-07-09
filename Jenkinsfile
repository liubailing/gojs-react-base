pipeline {
  agent any
  stages {
    stage('测试') {
      steps {
        sh '''node -v 
pwd'''
        sh 'echo \'这是一个测试文档\''
      }
    }

  }
  environment {
    sss = '中文'
  }
}