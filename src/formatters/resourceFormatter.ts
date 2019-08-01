import { Operation } from '../models/operation.model';
import { Resource } from '../models/resource.model';
import * as _ from 'lodash';
import { ResourceWithOperations } from '../models/resourceWithOperations.model';
import { OpenAPIV3 } from 'openapi-types';
import utility from '../utility';

class ResourceService {
  public formatResources(tags: OpenAPIV3.TagObject[]): Resource[] {
    return tags
      .filter(tag => this.isResource(tag))
      .map(tag => {
        return {
          name: tag.name,
          id: utility.makePascalCase(tag.name),
          description: tag.description,
        };
      });
  }

  public formatResourcesWithOperations(
    resources: Resource[],
    operations: Operation[]
  ): ResourceWithOperations[] {
    const operationsByResource = _.groupBy(operations, o => o.resourceID);
    return resources.map(resource => {
      const resourceOperations = operationsByResource[resource.id];
      const fileImports = _.uniq(
        _.flatten(resourceOperations.map(o => o.fileImports))
      );
      return {
        ...resource,
        operations: resourceOperations,
        fileImports,
      };
    });
  }

  private isResource(tag: OpenAPIV3.TagObject): boolean {
    return Boolean(tag['x-section-id']);
  }
}

export default new ResourceService();
