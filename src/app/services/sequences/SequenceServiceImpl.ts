import { MongoClient } from 'mongodb';
import { Sequence } from '../../../../../git-analyzer-types';
import { config } from '../../../config/impl/Config';
import { errorLogger } from '../../../logger/Logger';
import SequenceService from './SequenceService';

const COLLECTION = 'collection_ids';
const CODE_REVIEW_ID = 'codeReview';

const SequenceService: SequenceService = {

	getCodeReviewId: () => {
		const query: Sequence = {
			collection: CODE_REVIEW_ID
		};

		MongoClient.connect(config.db.host)
			.then(async (client: MongoClient) => {
				var result;
				const db = client.db();
				await db.collection(COLLECTION)
					.findOne(query)
					.then((seq: Sequence) => {
						if (seq !== null) {
							let id = seq.id;
							++id!;
							db.collection(COLLECTION).updateOne({ collection: CODE_REVIEW_ID, id: seq.id },
								{ $set: { collection: CODE_REVIEW_ID, id: id } } as Sequence);
							return result = id;
						} else {
							db.collection(COLLECTION).insert({ collection: CODE_REVIEW_ID, id: 0 } as Sequence);
							return result = 0;
						}
					})
					.catch((err: Error) => {
						errorLogger("Cannot find sequence", err);
					});
				return [result, db];
			})
			.then((tuple: Array<any>) => {
				const db = tuple[1];
				const id = tuple[0];
				db.close();
				return id;
			})
			.catch((err: Error) => {
				errorLogger("Cannot get next id for collection", err);
				console.log(err);
			});
		return 0;
	},
};

export default SequenceService;