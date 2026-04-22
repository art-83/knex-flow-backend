/**
 * Generic repository provider interface for entities of type T.
 *
 * This interface defines the core CRUD operations that a repository must implement
 * to interact with a database for a specific entity.
 */
interface IRepositoryProvider<T> {
  /**
   * Creates a new entity.
   *
   * @param data The data of the entity to be created.
   * @returns A promise that resolves to the created entity.
   */
  create(data: Partial<T>): Promise<T>;

  /**
   * Finds entities that match the provided options.
   * These options are usually a DTO that extends or partializes the entity.
   *
   * @param options The criteria used to filter and search for entities.
   * @returns A promise that resolves to an array of found entities.
   */
  find(options: Partial<T>): Promise<T[]>;

  /**
   * Updates an existing entity by its identifier.
   *
   * @param id The identifier of the entity to be updated.
   * @param data The new data for the entity.
   * @returns A promise that resolves to the updated entity.
   */
  update(id: string, data: T): Promise<T>;

  /**
   * Deletes an entity from the database by its identifier.
   *
   * @param id The identifier of the entity to be deleted.
   * @returns A promise that resolves to the number of affected rows.
   */
  delete(id: string): Promise<number>;
}

export default IRepositoryProvider;
