/**
 * This schema represents comment schema
 *  @author punit
 *  @since 12 Feb 2019
 */
import { Schema } from 'mongoose';
import database from '../db';
import momentTimezone from 'moment-timezone';


const Comment = new Schema({
	ref: { type: String, required: true }, // ref to post id
	by: { type: String }, // who is comment in post
	content: { type: String, required: true },
	date: { type: Date, default: new Date() },
	timezone: { type: String, default: momentTimezone.tz.guess() },
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
	usePushEach: true,
});

Comment.virtual('post', {
	localField: 'ref',
	foreignField: '_id',
	ref: 'post',
	justOne: true,
});

Comment.virtual('user', {
	localField: 'by',
	foreignField: '_id',
	ref: 'user',
	justOne: true,
});

export default database.model('Comment', Comment);
