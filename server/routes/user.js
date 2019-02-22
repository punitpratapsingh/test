/**
 * @description
 * This is the route handler for the instructors
 * @author punit
 * @since 12 Feb Jan 2019
 */
import {
	MultipartService,
} from 'appknit-backend-bundle';

import {
	AuthenticationControllers,
	UserControllers,
} from '../controllers';

const prefix = '/api/user/';


export default (app) => {
	app.post(`${prefix}create`, MultipartService, UserControllers.create);
	app.post(`${prefix}social`, UserControllers.social);
	// app.post(`${prefix}details`, AuthenticationControllers.authenticateUser, UserControllers.details);
	app.post(`${prefix}update`, MultipartService, UserControllers.update);
	app.post(`${prefix}changePasswordEmail`, UserControllers.changePasswordEmail);
	app.post(`${prefix}resetPassword`, UserControllers.resetPassword);
	app.get(`${prefix}verify`, UserControllers.verify);
};
