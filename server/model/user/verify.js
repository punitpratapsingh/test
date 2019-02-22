import {
	ResponseUtility,
	PropsValidationUtility,
} from 'appknit-backend-bundle';
import UserModel from '../../schemas/user';

/**
 * @description This service modal is for verification of
 * of user account.
 * @author punit
 * @since 12 Feb 2019
 */

const validProps = ['id', 'emailToken'];
export default ({
	id,
	emailToken,

}) => new Promise(async (resolve, reject) => {
	try {
		// props validation
		const { code, message } = await PropsValidationUtility({
			validProps,
			sourceDocument: { id, emailToken },
		});
		if (code !== 100) {
			return reject(ResponseUtility.MISSING_PROPS({ message }));
		}

		const user = await UserModel.findOne({ _id: id, emailToken });

		if (!user) {
			return reject(ResponseUtility.INVALID_ACCESS_TOKEN());
		}
		if (user.isVerified) {
			return reject(ResponseUtility.GENERIC_ERR({ message: 'User is already verified.' }));
		}
		// updating to true and removing few fields
		// eslint-disable-next-line max-len
		const updateQuery = { $set: { isVerified: true }, $unset: { emailToken: 1, emailTokenDate: 1 } };
		await UserModel.update({ _id: id }, updateQuery);
		return resolve('<h1 style="text-align: center">Your account has been verified. You can now use adeq app.</h1>');
	} catch (err) {
		return reject(ResponseUtility.GENERIC_ERR({ message: 'There was some error in verification.', error: 'err' }));
	}
});
