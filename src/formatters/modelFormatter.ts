import * as _ from 'lodash';
import { Model } from '../models/model.model';
import utility from '../utility';
import { OpenAPIV3 } from 'openapi-types';
import { Dictionary } from 'lodash';
import { Param } from '../models/param.model';

class ModelService {
  public formatModels(
    schemas: Dictionary<
      | OpenAPIV3.ReferenceObject
      | OpenAPIV3.ArraySchemaObject
      | OpenAPIV3.NonArraySchemaObject
    >
  ): Model[] {
    return _.values(
      _.mapValues(schemas, (model, modelName) =>
        this.formatModel(model, modelName)
      )
    );
  }

  private formatModel(model, modelName: string): Model {
    const formatted = {
      name: modelName,
      type: model.type,
      example: model.example,
      properties: _.values(
        _.mapValues(model.properties, (property, propertyName) =>
          this.formatProperty(property, propertyName)
        )
      ),
      fileImports: [],
    };
    formatted.fileImports = _.uniq(
      formatted.properties.filter(p => p.isCustomType).map(p => p.type)
    );
    return formatted;
  }

  private formatProperty(property, propertyName: string): Param {
    let allParamProps = {
      name: propertyName,
      isReadOnly: property.readOnly,
      isEnum: Boolean(property.enum),
      isRequired: Boolean(property.required),
      isQueryParam: false,
      isPathParam: false,
      isBodyParam: false,
      enum: property.enum || [],
      requiredFields: [],
      description: property.description || '',
      format: property.format,
      maxLength: property.maxLength,
      minLength: property.minLength,
      minimum: property.minimum,
      maximum: property.maximum,
      default: property.default,
    };

    if (property.type === 'array') {
      const type = property.items.type || utility.getType(property.items.$ref);
      return {
        ...allParamProps,
        type,
        isArray: true,
        isPrimitive: false, // arrays are always complex type
        isComplexType: true, // arrays are always complex type
        isCustomType: utility.isCustomType(type),
      };
    } else {
      let type;
      if (property.allOf) {
        type = utility.getType(property.allOf[0].$ref);
      } else {
        type = property.type || utility.getType(property.$ref);
      }

      return {
        ...allParamProps,
        type,
        isArray: false,
        isPrimitive: utility.isPrimitive(type),
        isComplexType: utility.isPrimitive(type),
        isCustomType: utility.isCustomType(type),
      };
    }
  }
}

export default new ModelService();
