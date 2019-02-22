/**
 * This schema represents the notification schema
 * @author punit
 * @since 12 Feb 2019
 */

import { Schema } from 'mongoose';
import database from '../db';

const Notifications = new Schema({
	ref: { type: String, required: true }, // refrence for post
	text: { type: String, required: true },
	date: { type: Date, required: true },
	user: { type: String, default: '' },
	notificationFor: { type: String, default: '' }, // the user who will see notification
},
{
	toJSON: { virtuals: true },
	toObject: { virtual: true },
	usePushEach: true,
});

Notifications.virtual('post', {
	localField: 'ref',
	foreignField: '_id',
	ref: 'post',
	justOne: true,
});

Notifications.virtual('user', {
	localField: 'user',
	foreignField: '_id',
	ref: 'user',
	justOne: true,
});

export default database.model('Notifications', Notifications);
