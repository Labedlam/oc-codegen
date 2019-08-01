import { Param } from './param.model';

export interface Model {
  name: string;
  type: string;
  example: any;
  properties: Param[];
  fileImports: string[];
}
