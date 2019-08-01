import { Param } from './param.model';
export interface Operation {
  id: string;
  name: string;
  path: string;
  verb: string;
  fileImports: string[];
  resourceName: string;
  resourceID: string;
  allParams: Param[];
  queryParams: Param[];
  pathParams: Param[];
  bodyParam?: Param;
  returnType?: string;
  hasParams: boolean;
  hasQueryParams: boolean;
  hasPathParams: boolean;
  hasBodyParam: boolean;
  hasReturnType: boolean;
  hasFilters: boolean;
}
