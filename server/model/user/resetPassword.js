/*
* @description
* service model function is used to reset user password
* param requied for this user email, verificationToken, user password
* @author punit
* @since 12 Feb 2019
 *
*/
import {
	ResponseUtility,
	PropsValidationUtility,
	HashUtility,
} from 'appknit-backend-bundle';

import UserModel from '../../schemas/user';

const validProps = ['email', 'verificationToken', 'password'];

export default ({
	email,
	verificationToken,
	password,
}) => new Promise(async (resolve, reject) => {
	const { code, message } = await PropsValidationUtility({
		validProps,
		sourceDocument: { email, verificationToken, password },
	});
	if (code !== 100) {
		return reject(ResponseUtility.MISSING_PROPS({ message }));
	}
	const query = { email, changePassToken: verificationToken };
	const user = await UserModel.findOne(query);
	if (!user) {
		return reject(ResponseUtility.GENERIC_ERR({ message: 'User and token does not match.' }));
	}
	// update password with using hash utility
	const updateQuery = {
		password: await HashUtility.generate({ text: password }),
		$unset: { changePassToken: 1, changePassTokenTimestamp: 1 },
	};

	await UserModel.update(query, updateQuery);
	return resolve(ResponseUtility.SUCCESS());
});
