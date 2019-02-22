import {
	ResponseUtility,
	PropsValidationUtility,
	HashUtility,
	RandomCodeUtility,
	EmailServices,
	TokenUtility,
	S3Services,
} from 'appknit-backend-bundle';
import { promises } from 'fs';

import { NODE_ENV, HOST, S3_BUCKET} from '../../constants';
import UserModel from '../../schemas/user';

/**
 * @description This service model function is used for creation
 * as well as login of existing user.
 * This will handling of profile completion also
 * @author punit
 * @since 12 Feb 2019
 */

const validProps = ['email', 'password'];

export default ({
	name,
	email,
	favSport,
	password,
	// picture,
	login = false,
}) => new Promise(async (resolve, reject) => {
	try {
		const { code, message } = await PropsValidationUtility({
			validProps,
			sourceDocument: { password, email },
		});
		if (code !== 100) {
			return reject(ResponseUtility.MISSING_PROPS({ message }));
		}
		// check name and email in db
		const checkUnique = await UserModel.findOne({ email });
		// login true
		if (login) {
			if (checkUnique) {
				if (!checkUnique.isVerified) {
					return reject(ResponseUtility.GENERIC_ERR({ message: 'Your email is not verified yet,first  verify it.' }));
				}
				const passwordMatch = await HashUtility.compare({
					text: password,
					hash: checkUnique.password,
				});
				const { _id } = checkUnique;
				if (passwordMatch) {
					// returm the auth token
					return resolve(ResponseUtility.SUCCESS({ data: TokenUtility.generateToken({ id: _id, role: 'user' }) }));
				}
				// return the password mismatch error
				return reject(ResponseUtility.LOGIN_AUTH_FAILED());
			}
			return reject(ResponseUtility.NO_USER());
		}
		const emailToken = RandomCodeUtility(10);

		if (!name) {
			return reject(ResponseUtility.MISSING_PROPS({ message: 'Missing required property name' }));
		}

		if (!favSport) {
			return reject(ResponseUtility.GENERIC_ERR({ message: 'You have to select fav sport' }));
		}
		if (checkUnique) {
			return reject(ResponseUtility.GENERIC_ERR({ message: 'Email already taken by others.' }));
		}
		// picture upload
	/*	const profilePic = picture ? `picture_${Date.now()}` : undefined;
		if (picture) {
			// upload image
			const Bucket = `${S3_BUCKET}/${NODE_ENV}/profile`;
			try {
				await S3Services.uploadToBucket({ Bucket, data: picture, Key: profilePic });
			} catch (err) {
				console.log(err);
				return reject(ResponseUtility.GENERIC_ERR({ message: 'Error uploading image', error: err }));
			}
		} */

		const userObject = new UserModel({
			name,
			email,
			favSport,
			// picture: profilePic,
			password: await HashUtility.generate({ text: password }),
			emailToken,
			emailTokenDate: new Date(),
		});
		// sending email to verify
		// await EmailServices({ to: email, text: `Click the URL to verify ${HOST}user/verify?id=${userObject._id.toString()}&emailToken=${emailToken}`, subject: 'Please verify your email' });
		// save user object and genration of token
		await userObject.save();
		// eslint-disable-next-line no-underscore-dangle
		return resolve(ResponseUtility.SUCCESS({ data: TokenUtility.generateToken({ id: userObject._id, email, role: 'user' }) }));
	} catch (err) {
		return reject(ResponseUtility.GENERIC_ERR({ message: 'There was some error', error: 'err' }));
	}
});
