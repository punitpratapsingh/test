/**
 * This schema is used for share the event or tournament
 * @author punit
 * @since 12 Feb 2019
 */

import { Schema } from 'mongoose';
import database from '../db';

const Share = new Schema({
	ref: String, // the post reference
	by: String, // id of the user sharing the post
	platform: String, 	// the sharing on platform
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
	usePushEach: true,
});

Share.virtual('post', {
	localField: 'ref',
	foreignField: '_id',
	ref: 'post',
	justOne: true,
});

Share.virtual('user', {
	localField: 'by',
	foreignField: '_id',
	ref: 'user',
	justOne: true,
});

export default database.model('Share', Share);
