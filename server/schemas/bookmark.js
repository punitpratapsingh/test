/**
 * This schema is used for bookmark
 * @author punit
 * @since 12 Feb 2019
 */

import { Schema } from 'mongoose';
import database from '../db';

const Bookmark = new Schema({
	ref: { type: String }, // refrence for user who bookmarked
	item: [String], // refrence for bookmarked posts
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
	usePushEach: true,
});

Bookmark.virtual('user', {
	localField: 'ref',
	foreignField: '_id',
	ref: 'user',
	justOne: true,
});

Bookmark.virtual('post', {
	localField: 'item',
	foreignField: '_id',
	ref: 'post',
	justOne: true,
});

export default database.model('Bookmark', Bookmark);
