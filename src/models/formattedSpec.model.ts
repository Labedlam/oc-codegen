import { Operation } from './operation.model';
import { Resource } from './resource.model';
import { ResourceWithOperations } from './resourceWithOperations.model';
import { Model } from './model.model';
import { Info } from './info.model';

export interface FormattedSpec {
  /**
   * meta information about the api
   */
  info: Info;

  /**
   * array of all models in the API
   * ie Order, LineItem, etc.
   */
  models: Model[];

  /**
   * array of all operations in the API (not grouped)
   * ie List Orders, Create LineItem etc.
   */
  operations: Operation[];

  /**
   * array of all api resources
   * ie Orders, CreditCards, etc.
   */
  resources: Resource[];

  /**
   * array of resources with a sub-array of operations for that resource
   */
  resourcesWithOperations: ResourceWithOperations[];

  /**
   * only present on contextual **model** templates
   */
  model?: Model; // only on model files

  /**
   * only present on contextual **resource** templates
   */
  resource?: ResourceWithOperations; // only on resource files

  /**
   * only present on contextual **operation** templates
   */
  operation?: Operation;
}
