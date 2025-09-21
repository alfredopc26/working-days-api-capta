import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class WorkingDaysApiCaptaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Lambda function with optimized configuration
    const calculateDateHandler = new nodejs.NodejsFunction(this, 'CalculateDateHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'lambda/index.ts',
      handler: 'handler',
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      bundling: {
        minify: true,
        sourceMap: true,
        target: 'es2020',
        externalModules: ['aws-sdk'],
      },
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'WorkingDaysApi', {
      restApiName: 'Colombia Business Days API',
      description: 'API for calculating business days in Colombia',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
      deployOptions: {
        stageName: 'prod',
        tracingEnabled: true,
        metricsEnabled: true,
      },
    });

    // API resource and method
    const calculateResource = api.root.addResource('calculate-business-date');
    calculateResource.addMethod('GET', new apigateway.LambdaIntegration(calculateDateHandler), {
      requestParameters: {
        'method.request.querystring.days': false,
        'method.request.querystring.hours': false,
        'method.request.querystring.date': false,
      },
    });

    // example resource
    // const queue = new sqs.Queue(this, 'WorkingDaysApiCaptaQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
