import modelFormatter from './modelFormatter';
import operationFormatter from './operationFormatter';
import resourceFormatter from './resourceFormatter';
import { OpenAPIV3 } from 'openapi-types';
import { FormattedSpec } from '../models/formattedSpec.model';

class SpecFormatter {
  public formatSpec(spec: OpenAPIV3.Document): FormattedSpec {
    // format spec into something that's a little easier to work with
    const models = modelFormatter.formatModels(spec.components.schemas);
    const operations = operationFormatter.formatOperations(spec.paths);
    const resources = resourceFormatter.formatResources(spec.tags);
    const resourcesWithOperations = resourceFormatter.formatResourcesWithOperations(
      resources,
      operations
    );

    return {
      info: {
        apiVersion: spec.info.version,
        apiUrl: spec.servers[0].url,
        authUrl: (spec.components.securitySchemes
          .OAuth2 as OpenAPIV3.OAuth2SecurityScheme).flows.password.tokenUrl,
      },
      models,
      operations,
      resources,
      resourcesWithOperations,
    };
  }
}

export default new SpecFormatter();
