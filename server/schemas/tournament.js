/**
 * This schema represents tournament
 * @author punit
 * @since 12 feb 2019
 */
import { Schema } from 'mongoose';
import database from '../db';

const Tournament = new Schema({
	ref: { type: String, required: true }, // refrence for who creating tournament
	noOfGames: { type: Number, default: 1 },
	competitionLevel: { type: Number },
	sports: { type: Number },
	genderOfSports: { type: Number },
	ageGroup: { type: Number },
	add: {
		state: { type: String, default: '' },
		city: { type: String, default: '' },
		country: { type: String, default: '' },
		location: { type: String, default: '' },
		type: { type: String, default: 'Point' },
		coordinates: [Number, Number],
	},
	webAddress: { type: String },
	picture: { type: String, default: '' },
	description: { type: String },
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
	usePushEach: true,
});
Tournament.virtual('user', {
	localField: 'ref',
	foreignField: '_id',
	ref: 'user',
	justOne: true,
});

export default database.model('Tournament', Tournament);
