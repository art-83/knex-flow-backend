interface IRepositoryProvider<T> {
  /**
   * @param data is the object of type T that will be created
   *
   * @returns a promise that resolves to the created object of type T
   */

  create(data: T): Promise<T>;

  /**
   * @param options is the object of type T that will be used to find the objects,
   * in most of cases is a DTO that extends the entity T
   *
   * @returns a promise that resolves to an array of objects of type T
   */

  find(options: Partial<T>): Promise<T[]>;

  /**
   * @param id is the id of the object that will be updated
   * @param data is the object of type T that will be used to update the object
   *
   * @returns a promise that resolves to the updated object of type T
   */

  update(id: string, data: T): Promise<T>;

  /**
   * @param id is the id of the object that will be deleted
   *
   * @returns a promise that resolves to the number of objects deleted
   */

  delete(id: string): Promise<number>;
}

export default IRepositoryProvider;
