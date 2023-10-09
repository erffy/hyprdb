export type DataRecord<D> = {
  [K in keyof D]: D[K];
};

export default DataRecord;