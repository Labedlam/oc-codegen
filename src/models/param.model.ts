export interface Param {
  name: string;
  description: string;
  type: string;
  isArray: boolean;
  isPrimitive: boolean;
  isComplexType: boolean;
  isCustomType: boolean;
  isReadOnly: boolean;
  isEnum: boolean;
  isRequired: boolean;
  isQueryParam: boolean;
  isPathParam: boolean;
  isBodyParam: boolean;
  requiredFields: string[];
  enum: string[];
  format: string;
  maxLength: number;
  minLength: number;
  minimum: number;
  maximum: number;
  default: any;
}
