/* eslint-disable prettier/prettier */
export default () => ({
  database: {
    connectionString: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  environment: {
    dev: process.env.NODE_ENV === 'development',
    production: process.env.NODE_ENV === 'production',
  },
});
