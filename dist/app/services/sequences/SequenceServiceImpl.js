"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const Config_1 = require("../../../config/impl/Config");
const Logger_1 = require("../../../logger/Logger");
const COLLECTION = 'collection_ids';
const CODE_REVIEW_ID = 'codeReview';
const SequenceService = {
    getCodeReviewId: () => {
        const query = {
            collection: CODE_REVIEW_ID
        };
        mongodb_1.MongoClient.connect(Config_1.config.db.host)
            .then((client) => __awaiter(this, void 0, void 0, function* () {
            var result;
            const db = client.db();
            yield db.collection(COLLECTION)
                .findOne(query)
                .then((seq) => {
                if (seq !== null) {
                    let id = seq.id;
                    ++id;
                    db.collection(COLLECTION).updateOne({ collection: CODE_REVIEW_ID, id: seq.id }, { $set: { collection: CODE_REVIEW_ID, id: id } });
                    return result = id;
                }
                else {
                    db.collection(COLLECTION).insert({ collection: CODE_REVIEW_ID, id: 0 });
                    return result = 0;
                }
            })
                .catch((err) => {
                Logger_1.errorLogger("Cannot find sequence", err);
            });
            return [result, db];
        }))
            .then((tuple) => {
            const db = tuple[1];
            const id = tuple[0];
            db.close();
            return id;
        })
            .catch((err) => {
            Logger_1.errorLogger("Cannot get next id for collection", err);
            console.log(err);
        });
        return 0;
    },
};
exports.default = SequenceService;
//# sourceMappingURL=SequenceServiceImpl.js.map