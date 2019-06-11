
export default interface ISyncService<T> {

	/**
	 * Performs the sync operation of a given schema
	 * @param type 
	 */
	sync(type: T): void;
}