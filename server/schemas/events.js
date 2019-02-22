/**
 * This events schema is for diffrent events
 * @author punit
 * @since 12 Feb 2019
 */
import { Schema } from 'mongoose';
import database from '../db';

const Event = new Schema({
	ref: { type: String, required: true }, // refrence for tournament
	name: { type: String, required: true },
	teamHome: { type: String, required: true },
	teamAway: { type: String, required: true },
	homeScore: { type: Number },
	awayScore: { type: Number },
	date: { type: Date, required: true },
	competitionLevel: { type: Number },
	genderOfSport: { type: Number },
	ageGroup: {
		
},
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

Event.virtual('tournament', {
	localField: 'ref',
	foreignField: '_id',
	ref: 'tournament',
	justOne: true,
});

export default database.model('Event', Event);
