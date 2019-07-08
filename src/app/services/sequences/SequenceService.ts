/**
 * Defines an interface for the sequences service
 */
export default interface SequenceService {

	/**
	 * Returns a callback containing an unique code review id
	 */
	getCodeReviewId(): any;

}