import { Operation } from './operation.model';
import { Resource } from './resource.model';
import { ResourceWithOperations } from './resourceWithOperations.model';
import { Model } from './model.model';
import { Info } from './info.model';

export interface FormattedSpec {
  info: Info;
  models: Model[];
  operations: Operation[];
  resources: Resource[];
  resourcesWithOperations: ResourceWithOperations[];
  model?: Model; // only on model files
  resource?: ResourceWithOperations; // only on resource files
  operation?: Operation; // only on operation files
}
