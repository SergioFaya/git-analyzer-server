import { Sequence } from 'git-analyzer-types';
import { MongoClient } from 'mongodb';
import { config } from '../../../../config/impl/Config';
import { errorLogger } from '../../../../logger/Logger';
import SequenceService from '../SequenceService';

const COLLECTION = 'collection_ids';
const CODE_REVIEW_ID = 'codeReview';

let dbClient: any;

const SequenceService: SequenceService = {

	getCodeReviewId: () => {
		const query: Sequence = {
			collection: CODE_REVIEW_ID
		};

		return MongoClient.connect(config.db.host)
			.then(async (client: MongoClient) => {
				dbClient = client;
				const db = client.db();
				return [db, await db.collection(COLLECTION)
					.findOne(query)
					.then(async (seq: Sequence) => {
						if (seq !== null) {
							let id = seq.id;
							++id!;
							return await db.collection(COLLECTION).updateOne({ collection: CODE_REVIEW_ID, id: seq.id },
								{ $set: { collection: CODE_REVIEW_ID, id: id } } as Sequence)
								.then(() => {
									return id;
								});

						} else {
							return await db.collection(COLLECTION).insert({ collection: CODE_REVIEW_ID, id: 0 } as Sequence).then(() => {
								return 0;
							});
						}
					})
					.catch((err: Error) => {
						errorLogger("Cannot find sequence", err);
					})];
			})
			.then((tuple: any) => {
				dbClient.close();
				return tuple[1];

			})
			.catch((err: Error) => {
				errorLogger("Cannot get next id for collection", err);
				console.log(err);
			});

	},
};

export default SequenceService;