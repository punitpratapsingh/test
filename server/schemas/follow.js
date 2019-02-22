/**
 * This schema is used for follow and followers of user
 * @author punit
 * @since 12 Feb 2019
 */

import { Schema } from 'mongoose';
import database from '../db';

const Follow = new Schema({
	ref: { type: String },
	follows: [String],
	followers: [String],
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
	usePushEach: true,
});

Follow.virtual('user', {
	localField: 'ref',
	foreignField: '_id',
	ref: 'user',
	justOne: true,
});

export default database.model('Follow', Follow);
