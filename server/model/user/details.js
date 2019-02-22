/* eslint-disable no-underscore-dangle */
import { ResponseUtility } from 'appknit-backend-bundle';
import UserModel from '../../schemas/user';
/**
 * @description service model function to fetch the details of the user
 * @author punit
 * @since 12 Feb 2019
 */
export default ({
	id,
}) => new Promise(async (resolve, reject) => {
	try {
		const lookupQuery = { _id: id };
		const projection = {
			name: 1, email: 1, picture: 1,
		};
		const user = await UserModel.findOne(lookupQuery, projection);
		if (!user) {
			return reject(ResponseUtility.NO_USER({ message: 'Requested user not found' }));
		}
		return resolve(ResponseUtility.SUCCESS({
			data: Object.assign(
				{},
				{ ...user._doc },
				{
					isVerified: user._doc.verification && user._doc.verification.isVerified,
					verification: undefined,
				},
			),
		}));
	} catch (err) {
		return reject(ResponseUtility.GENERIC_ERR({ message: err.message, error: err.error }));
	}
});
