# Working Days API (AWS CDK + TypeScript)

Este proyecto implementa una API en AWS utilizando **API Gateway** y **AWS Lambda** (en TypeScript).  
La API calcula fechas y horas laborales, devolviendo siempre los resultados en **UTC ISO 8601**.

## 🚀 Tecnologías utilizadas
- [AWS CDK v2](https://docs.aws.amazon.com/cdk/v2/guide/home.html) (TypeScript)
- [API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)
- [AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) (Node.js 18 + TypeScript)
- [Luxon](https://moment.github.io/luxon/#/) para manejo de fechas y zonas horarias
- [Jest](https://jestjs.io/) para pruebas unitarias

---

## 📂 Estructura del proyecto

working-days-api-capta/
├── bin/
│ └── working-days-api-capta.ts # Punto de entrada del CDK
├── lib/
│ └── working-days-api-capta-stack.ts # Definición de recursos (API Gateway + Lambda)
├── lambda/
│ └── index.ts # Código principal de la Lambda
├── test/
│ └── lambda.test.ts # Pruebas con Jest
├── package.json
├── tsconfig.json
└── README.md


---

## ⚙️ Configuración inicial

1. Instala dependencias globales si no lo tienes:

   npm install -g aws-cdk

2. Inicializa el proyecto en tu máquina:

    git clone <repo-url>
    cd working-days-api-capta
    npm install

3. Compila el proyecto TypeScript:

    npm run build

🔑 Variables de entorno requeridas

4. El CDK necesita tus credenciales de AWS:

    AWS_ACCESS_KEY_ID "TU_ACCESS_KEY"
    AWS_SECRET_ACCESS_KEY "TU_SECRET_KEY"
    AWS_REGION "us-east-1"
    (O usa aws configure con el AWS CLI).

5. Comandos principales CDK

    - Bootstrap (una sola vez por cuenta/region):
    - cdk bootstrap
    - Synth (verifica que el stack se genere bien):
    - cdk synth
    - cdk deploy(desplegar el stack)

6. Pruebas unitarias
    npm test
---
## 📝 Licencia
Este proyecto está bajo la Licencia MIT.