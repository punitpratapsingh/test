/**
 * This schema is used for follow and followers of user
 * @author punit
 * @since 12 Feb 2019
 */

import { Schema } from 'mongoose';
import database from '../db';

const Like = new Schema({
	ref: { type: String },
	likes: { type: Number },
	liked: { type: Number },
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
	usePushEach: true,
});

Like.virtual('user', {
	localField: 'ref',
	foreignField: '_id',
	ref: 'user',
	justOne: true,
});

export default database.model('Follow', Like);
