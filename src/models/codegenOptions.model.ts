import { OpenAPIV3 } from 'openapi-types';

export interface CodegenOptions {
  /**
   * the path of the open api specification
   */
  inputSpec: string;

  /**
   * where to write the generated files (defaults to current directory)
   */
  outputFolder: string;

  /**
   * where to locate handlebars templates
   */
  templatesFolder: string;

  /**
   * path to handlebars extensions file
   */
  handlebarsExtensions: string;

  /**
   * if set to true will not generate the sdk and will instead
   * output the formatted spec that gets passed to the handlebars templates
   */
  debug: boolean;
}
