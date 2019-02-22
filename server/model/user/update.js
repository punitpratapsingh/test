
import {
	ResponseUtility,
	SchemaMapperUtility,
	S3Services,

} from 'appknit-backend-bundle';

import { S3_BUCKET, NODE_ENV } from '../../constants';


import UserModel from '../../schemas/user';

/**
 * @description service model function to handle the updation of profile
 * This is a common function that could be used to
 * update the existing user.
 * @author punit
 * @since 12  Feb 2019
 *
 */
export default ({
	id,
	name,
	email,
	image,
}) => new Promise(async (resolve, reject) => {
	try {
		if (!id || !(name || email || image)) {
			return reject(ResponseUtility.MISSING_PROPS({ message: 'Required atleast one of name, email or image.' }));
		}

		if (name || email) {
			const lookupQuery = name ? { name } : { email };
			const exists = await UserModel.findOne(lookupQuery);
			if (exists) {
				return reject(ResponseUtility.GENERIC_ERR({ message: 'name/Email is already taken.' }));
			}
		}

		const pictureName = image ? `${id}_${Date.now()}` : undefined;
		const lookupQuery = { _id: id };
		if (image) {
			const Bucket = `${S3_BUCKET}/${NODE_ENV}/profile`;
			const Key = pictureName;
			try {
				// remove old picture before inserting new one
				const { _doc: { picture } } = await UserModel.findOne(lookupQuery);
				if (picture) {
					await S3Services.removeFile({ Bucket, Key: picture });
				}
				await S3Services.uploadToBucket({ Bucket, data: image, Key });
			} catch (err) {
				console.log(err);
				return reject(ResponseUtility.GENERIC_ERR({ message: 'Error while uploading image.', error: err }));
			}
		}

		let updateQuery;
		try {
			updateQuery = await SchemaMapperUtility({
				name,
				email,
				picture: pictureName,
			});
		} catch (err) {
			return reject(ResponseUtility.MISSING_PROPS({ message: 'Required field is not defined.' }));
		}
		await UserModel.findByIdAndUpdate(
			lookupQuery,
			updateQuery,
			{ new: true },
			(err, doc) => {
				if (err) {
					return reject(ResponseUtility.GENERIC_ERR({ message: 'there was some error in updating user profile', error: err }));
				}
				return resolve(ResponseUtility.SUCCESS({
					message: 'success updating profile',
					data: Object.assign({}, { ...doc._doc }),
				}));
			},
		);
	} catch (err) {
		return reject(ResponseUtility.GENERIC_ERR({ message: 'There was some error', error: err }));
	}
});
