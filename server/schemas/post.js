/**
 * This schema represents the post schema
 * @author punit
 * @since 12 Feb 2019
 */
import { Schema } from 'mongoose';
import database from '../db';
import momentTimezone from 'moment-timezone';

const Post = new Schema({
	ref: { type: String, reqired: true }, // ref for user creating post
	caption: {
		type: String,
		required: [true, 'caption is required'],
	},
	picture: { type: String, default: '' },
	likes: { type: String, default: 0 },
	comment: { type: String, default: 0 },
	shares: { type: String, default: 0 },
	date: { type: Date, default: new Date() },
	timezone: { type: String, default: momentTimezone.tz.guess() },
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
	usePushEach: true,
});

Post.virtual('user', {
	localField: 'ref',
	foreignField: '_id',
	ref: 'user',
	justOne: true,
});
export default database.model('Post', Post);
