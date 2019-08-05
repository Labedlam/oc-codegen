import * as _ from 'lodash';
import { Operation } from '../models/operation.model';
import utility from '../utility';
import { OpenAPIV3 } from 'openapi-types';
import { Param } from '../models/param.model';

/**
 * @ignore
 * not part of public api, don't include in generated docs
 */
class OperationService {
  public formatOperations(paths: OpenAPIV3.PathsObject): Operation[] {
    return _.flatten(
      _.values(
        _.mapValues(paths, (operations, path) =>
          _.values(
            _.mapValues(operations, (o, verb) =>
              this.formatOperation(o, path, verb)
            )
          )
        )
      )
    );
  }

  private formatOperation(operation, path: string, verb: string): Operation {
    let allParams: Param[] = (operation.parameters || []).map(p =>
      this.formatParam(p)
    );
    const bodyParam = this.getBodyParam(operation.requestBody);
    if (bodyParam) {
      allParams = [...allParams, bodyParam];
    }
    const returnType = this.getReturnType(operation.responses);
    const fileImports = _.uniq(
      _.compact([bodyParam && bodyParam.type, returnType])
    );
    const queryParams = allParams.filter(p => p.isQueryParam);
    const pathParams = allParams.filter(p => p.isPathParam);

    return {
      id: operation.operationId,
      name: operation.operationId.split('.')[1],
      path,
      verb,
      fileImports,
      resourceName: operation.tags[0],
      resourceID: utility.makePascalCase(operation.tags[0]),
      allParams,
      queryParams,
      pathParams,
      hasParams: allParams.length > 0,
      hasQueryParams: queryParams.length > 0,
      hasPathParams: pathParams.length > 0,
      hasBodyParam: Boolean(bodyParam),
      hasReturnType: Boolean(returnType),
      hasFilters: Boolean(allParams.filter(p => p.name === 'filters').length),
      bodyParam,
      returnType,
    };
  }

  private getBodyParam(requestBody): Param | null {
    let type;
    let requiredFields;
    const schema = _.get(requestBody, 'content["application/json"].schema');
    if (schema) {
      if (schema.$ref) {
        type = utility.getType(schema.$ref);
        requiredFields = [];
      } else if (schema.allOf) {
        type = utility.getType(schema.allOf[0].$ref);
        requiredFields = schema.allOf.required;
      }
      return {
        name: utility.makeCamelCase(type),
        description: requestBody.description || '',
        type,
        isArray: false,
        isPrimitive: false,
        isComplexType: true,
        isCustomType: true,
        isReadOnly: false,
        isEnum: false,
        isRequired: true,
        isQueryParam: false,
        isPathParam: false,
        isBodyParam: true,
        enum: [],
        requiredFields,
        format: '',
        maxLength: null,
        minLength: null,
        minimum: null,
        maximum: null,
        default: null,
      };
    }
    return null;
  }

  private getReturnType(responses): string | null {
    const responsesArray = _.values(responses);
    const [firstResponse] = responsesArray;
    const responseRef = _.get(
      firstResponse,
      'content["application/json"].schema.$ref'
    );
    if (responseRef) {
      return utility.getType(responseRef);
    }
    return null;
  }

  private formatParam(prop): Param {
    let commonProps = {
      name: prop.name,
      description: prop.description,
      isReadOnly: Boolean(prop.schema.readOnly),
      isEnum: Boolean(prop.schema.enum),
      isRequired: Boolean(prop.schema.required),
      isQueryParam: prop.in === 'query',
      isPathParam: prop.in === 'path',
      isBodyParam: false,
      requiredFields: [],
      enum: prop.schema.enum || [],
      format: prop.schema.format || '',
      maxLength: prop.schema.maxLength || null,
      minLength: prop.schema.minLength || null,
      minimum: prop.schema.minimum || null,
      maximum: prop.schema.maximum || null,
      default: prop.schema.default || null,
    };

    if (prop.schema.type === 'array') {
      return {
        ...commonProps,
        type: prop.schema.items.type,
        isArray: true,
        isPrimitive: false, // arrays are always complex type
        isComplexType: true, // arrays are always complex type
        isCustomType: utility.isCustomType(prop.schema.items.type),
      };
    }
    return {
      ...commonProps,
      type: prop.schema.type,
      isArray: false,
      isPrimitive: utility.isPrimitive(prop.schema.type),
      isComplexType: utility.isComplexType(prop.schema.type),
      isCustomType: utility.isCustomType(prop.schema.type),
    };
  }
}

export default new OperationService();
