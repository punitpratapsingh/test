/* eslint-disable import/named */
/**
 * @description controllers  for user
 * @author punit
 * @since 05 Jan 2019
 */
import { UserModel } from '../model';
import { ModelResolver } from './resolvers';

export default {
	create: (req, res) => ModelResolver(req, res, UserModel.UserCreateService),
	social: (req, res) => ModelResolver(req, res, UserModel.UserSocialService),
	update: (req, res) => ModelResolver(req, res, UserModel.UserUpdateService),
	details: (req, res) => ModelResolver(req, res, UserModel.UserDetailsService),
	verify: (req, res) => {
		const { query: { id, emailToken } } = req;
		UserModel.UserVerifyService({ id, emailToken })
			.then(sucess => res.send(sucess))
			.catch(err => res.send(err));
	},
  changePasswordEmail: (req, res) => ModelResolver(req, res, UserModel.UserChangePasswordEmailService),
  resetPassword: (req, res) => ModelResolver(req, res, UserModel.UserResetPasswordService),
};
