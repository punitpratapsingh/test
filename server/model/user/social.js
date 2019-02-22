import {
	PropsValidationUtility,
	S3Services,
	ResponseUtility,
	TokenUtility,
} from 'appknit-backend-bundle';

import UserModel  from '../../schemas/user';
import { FetchService } from '../../services';
import { S3_BUCKET, NODE_ENV } from '../../constants';

const validProps = ['socialType', 'socialId', 'socialToken', 'name'];
/**
 * @description the social login handler for adeq app
 * @author punit
 * @since 12 Feb 2019
 */
export default ({
	socialType,
	socialId,
	socialToken,
	name,
	email,
	picture,
}) => new Promise(async (resolve, reject) => {
	const { code, message } = await PropsValidationUtility({
		sourceDocument: {
			socialType,
			socialId,
			socialToken,
			name,
		},
		validProps,
	});

	if (code !== 100) {
		return reject(ResponseUtility.MISSING_PROPS({ message }));
	}
	// check if social user id already exist
	const lookupQuery = { socialId };
	const userExists = await UserModel.findOne({ lookupQuery });
	if (userExists) {
		const { _id } = userExists;
		// genrate Token
		return resolve(ResponseUtility.SUCCESS({ data: TokenUtility.generateToken({ id: _id.toString(), role: 'user' }) }));
	}

	// create new user
	let Key = picture ? `profile_${Date.now()}` : undefined;
	if (Key) {
		try {
			// fetch the image resource
			const imageBuffer = await FetchService(picture);
			// process uploading and save
			await S3Services.uploadToBucket({ Bucket: `${S3_BUCKET}/${NODE_ENV}/profile`, Key, data: imageBuffer });
		} catch (err) {
			// if any error then undefined the image value so it won't save in backend db
			console.log(err);
			Key = undefined;
		}
	}
	// new user object via social login save in user db
	const userObject = new UserModel({
		name: socialId,
		socialId,
		socialToken,
		socialType,
		email,
		picture: Key,
	});
	await userObject.save();
	return resolve(ResponseUtility.SUCCESS({ data: TokenUtility.generateToken({ id: userObject._id.toString(), role: 'user' }) }));
});

