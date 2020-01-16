export interface ColumnsModel {
  key: string;
  title: string;
  link?: boolean;
  sortable?: boolean;
  filter?: boolean;
  isTag?: boolean;
  tooltip?: boolean;
  defaultValue?: string;
}
