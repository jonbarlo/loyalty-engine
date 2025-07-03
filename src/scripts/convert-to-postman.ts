import * as fs from 'fs';
import * as path from 'path';

// Safeguard: abort if the collection file already exists
const collectionPath = path.resolve('loyalty-engine-postman-collection.json');
if (fs.existsSync(collectionPath)) {
  console.error('❌ Postman collection already exists at', collectionPath);
  console.error('Aborting to prevent accidental overwrite. Delete the file if you want to regenerate it.');
  process.exit(1);
}

interface OpenAPISpec {
  info: {
    title?: string;
    description?: string;
  };
  paths: Record<string, Record<string, any>>;
  components: {
    schemas: Record<string, any>;
  };
}

interface PostmanHeader {
  key: string;
  value: string;
  type: string;
}

interface PostmanUrl {
  raw: string;
  host: string[];
  path: string[];
}

interface PostmanBody {
  mode: string;
  raw: string;
  options: {
    raw: {
      language: string;
    };
  };
}

interface PostmanEvent {
  listen: string;
  script: {
    type: string;
    exec: string[];
  };
}

interface PostmanRequest {
  method: string;
  header: PostmanHeader[];
  url: PostmanUrl;
  body?: PostmanBody;
  event?: PostmanEvent[];
}

interface PostmanItem {
  name: string;
  request: PostmanRequest;
}

interface PostmanVariable {
  key: string;
  value: string;
  type: string;
}

interface PostmanCollection {
  info: {
    name: string;
    description: string;
    schema: string;
  };
  item: PostmanItem[];
  variable: PostmanVariable[];
}

// Function to generate sample data from schema
function generateSampleFromSchema(schema: any, schemas: Record<string, any>): any {
  if (!schema) return {};

  // Handle $ref
  if (schema.$ref) {
    const refName = schema.$ref.replace('#/components/schemas/', '');
    const refSchema = schemas[refName];
    if (refSchema) {
      return generateSampleFromSchema(refSchema, schemas);
    }
    return {};
  }

  // Handle different types
  switch (schema.type) {
    case 'object':
      const obj: any = {};
      if (schema.properties) {
        Object.entries(schema.properties).forEach(([key, propSchema]: [string, any]) => {
          obj[key] = generateSampleFromSchema(propSchema, schemas);
        });
      }
      return obj;
    
    case 'array':
      if (schema.items) {
        return [generateSampleFromSchema(schema.items, schemas)];
      }
      return [];
    
    case 'string':
      if (schema.enum) {
        return schema.enum[0] || '';
      }
      return 'sample_string';
    
    case 'integer':
      return 1;
    
    case 'number':
      return 1.0;
    
    case 'boolean':
      return true;
    
    default:
      return {};
  }
}

// Function to extract request body schema
function extractRequestBodySchema(operation: any, schemas: Record<string, any>): any {
  if (!operation.requestBody) return null;

  const content = operation.requestBody.content;
  if (!content || !content['application/json']) return null;

  const schema = content['application/json'].schema;
  if (!schema) return null;

  return generateSampleFromSchema(schema, schemas);
}

// Read the OpenAPI spec
const openapiSpec: OpenAPISpec = JSON.parse(fs.readFileSync('openapi.json', 'utf8'));

// Create Postman collection structure
const postmanCollection: PostmanCollection = {
  info: {
    name: openapiSpec.info.title || 'Loyalty Engine API',
    description: openapiSpec.info.description || 'API for loyalty and rewards management',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  },
  item: [],
  variable: []
};

// Convert paths to Postman items
Object.entries(openapiSpec.paths).forEach(([path, methods]) => {
  Object.entries(methods).forEach(([method, operation]) => {
    const item: PostmanItem = {
      name: operation.summary || `${method.toUpperCase()} ${path}`,
      request: {
        method: method.toUpperCase(),
        header: [],
        url: {
          raw: `{{baseUrl}}${path}`,
          host: ['{{baseUrl}}'],
          path: path.split('/').filter(Boolean)
        }
      }
    };

    // Add Authorization header for protected endpoints (all except login/register)
    if (!path.includes('/auth/login') && !path.includes('/auth/register')) {
      item.request.header.push({
        key: 'Authorization',
        value: 'Bearer {{bearer_token}}',
        type: 'text'
      });
    }

    // Add Content-Type header for requests with body
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && operation.requestBody) {
      item.request.header.push({
        key: 'Content-Type',
        value: 'application/json',
        type: 'text'
      });
    }

    // Add request body if present
    if (operation.requestBody && operation.requestBody.content && operation.requestBody.content['application/json']) {
      const schema = operation.requestBody.content['application/json'].schema;
      if (schema) {
        const sampleBody = generateSampleFromSchema(schema, openapiSpec.components.schemas);
        item.request.body = {
          mode: 'raw',
          raw: JSON.stringify(sampleBody, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        };
      }
    }

    // Add post-response script for login endpoint to automatically extract token
    if (path.includes('/auth/login')) {
      item.request.event = [{
        listen: 'test',
        script: {
          type: 'text/javascript',
          exec: [
            'pm.test("Login successful", function () {',
            '    var jsonData = pm.response.json();',
            '    pm.environment.set("bearer_token", jsonData.token);',
            '    console.log("Login successful, bearer_token saved and cached already into the environment variable bearer_token");',
            '    pm.expect(jsonData.token).to.not.be.undefined;',
            '});'
          ]
        }
      }];
    }

    postmanCollection.item.push(item);
  });
});

// Add variables
postmanCollection.variable = [
  {
    key: 'baseUrl',
    value: 'http://localhost:3031',
    type: 'string'
  },
  {
    key: 'bearer_token',
    value: '',
    type: 'string'
  }
];

// Write the Postman collection
fs.writeFileSync('loyalty-engine-postman-collection.json', JSON.stringify(postmanCollection, null, 2));

console.log('✅ Postman collection created: loyalty-engine-postman-collection.json');
console.log('📝 Import this file into Postman to test your API endpoints');
console.log('🔑 Remember to set your JWT token in the collection variables');
console.log('📋 Request bodies now include sample data from OpenAPI schemas!'); 