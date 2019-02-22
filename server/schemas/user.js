/**
 * This schema represents the users schema
 * @author punit
 * @since 12 Feb 2019
 */
import { Schema } from 'mongoose';
import database from '../db';

const User = new Schema({
	userType: {
		type: Boolean,
		default: false,
	},
	name: {
		type: String,
	},
	email: {
		type: String,
	},
	password: {
		type: String,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	emailToken: {
		type: Number,
	},
	emailTokenDate: {
		type: Date,
	},
	favSport: [String],
	biography: {
		type: String,
	},
	location: {
		type: String,
	},
	picture: {
		type: String,
		default: '',
	},

	createdOn: {
		type: Date,
		default: Date.now,
	},

	lastUpdated: {
		type: Date,
		default: Date.now(),
	},
	follows: [String], // follows other
	followers: [String], // follower of user
	likes: { type: Number }, // post user has like
	liked: { type: Number }, // likes on user posts
	commented: { type: Number }, // comments by user
	comment: { type: Number }, // comments on user posts
	changePassToken: { type: Number },
	changePassTokenTimestamp: { type: Date },
	socialType: { type: Number }, // socialType i.e. facebook,google etc.
	socialId: { type: String },
	socialToken: { type: String },


});

export default database.model('User', User);
