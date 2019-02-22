/**
* This is the basic-crud constant file
* @author punit
* @since 12 Feb 2019
*/

export const {
	NODE_ENV = 'development',
	S3_BUCKET = '',
	// atlas configurations
	ATLAS_USER,
	ATLAS_PASSWORD,
	SECRET_STRING,
	// admin
	ADMIN_USER,
	ADMIN_PASSWORD,
	PAGINATION_LIMIT = 30,
} = process.env;

const db = process.env.MONGO_DB || 'adeq-development';

// export const mongoConnectionString = `mongodb://${host}:${port}/${db}`;
export const mongoConnectionString = `mongodb+srv://${ATLAS_USER}:${ATLAS_PASSWORD}@cluster0-al20c.mongodb.net/${db}?retryWrites=true`;
// this string is unique for each project construction
export const secretString = SECRET_STRING;

export const SUCCESS_CODE = 100;

export const MB = 1024 * 1024;
