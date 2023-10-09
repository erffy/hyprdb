import DataMap from 'interfaces/DataMap';

export type DataSignature<S extends DataMap> = {
  [K in keyof S]: any;
};;

export default DataSignature;