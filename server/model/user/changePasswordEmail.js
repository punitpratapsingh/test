/**
 * File for sending token to change/update password for the app
 * @author punit
 * @since 12 Feb 2019
 */

import {
	ResponseUtility,
	PropsValidationUtility,
	RandomCodeUtility,
	EmailServices,
} from 'appknit-backend-bundle';

import UserModel from '../../schemas/user';

const validProps = ['email'];
export default ({ email }) => new Promise(async (resolve, reject) => {
	const { code, message } = await PropsValidationUtility({
		validProps,
		sourceDocument: { email },
	});
	if (code !== 100) {
		return reject(ResponseUtility.MISSING_PROPS({ message }));
	}
	// check given email id user database to send email for token
	const query = { email };
	const registered = await UserModel.findOne(query);
	if (!registered) {
		return reject(ResponseUtility.GENERIC_ERR({ message: 'Requested email id is not registered on the platform.' }));
	}
	// generation of verification token
	let verificationToken = RandomCodeUtility(6);
	if (verificationToken.toString().length === 5) {
		verificationToken = Number(verificationToken.toString() + 0);
	}
	const updateQuery = {
		changePassToken: verificationToken,
		changePassTokenTimestamp: Date.now(),
	};

	/**
	 * send the email with the token
	 */
	try {
		await EmailServices({ to: email, text: `The change password verification code is ${verificationToken}`, subject: 'Change Password Token' });
	} catch (err) {
		return reject(ResponseUtility.GENERIC_ERR({ message: 'Error sending email', error: err }));
	}

	/**
	 * Update the user schema with the verificationToken and timestamp
	 */
	await UserModel.findOneAndUpdate(query, updateQuery);
	return resolve(ResponseUtility.SUCCESS());
});
