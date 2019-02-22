import request from 'request';
import { ResponseUtility } from 'appknit-backend-bundle';

const Request = request.defaults({ encoding: null });
/**
 * The fetch utility to fetch resources that required http callback
 * @author punit
 * @since 12 Feb 2019
 */
export default url => new Promise((resolve, reject) => {
	if (!url) {
		return reject(ResponseUtility.ERROR({ message: 'Missing url property.' }));
	}

	Request(url, (err, res, buffer) => {
		if (err) {
			return reject(ResponseUtility.ERROR({ message: 'Some error while fetching the resource', error: err }));
		}
		return resolve(buffer);
	});
});
