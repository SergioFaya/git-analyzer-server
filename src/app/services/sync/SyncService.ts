/**
 * Defines a syncronization service
 */
export default interface SyncService<T> {

	/**
	 * Performs the sync operation of a given schema
	 * @param type 
	 */
	sync(type: T): void;
}