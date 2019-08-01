import { Resource } from './resource.model';
import { Operation } from './operation.model';

export interface ResourceWithOperations extends Resource {
  operations: Operation[];
  fileImports: string[];
}
