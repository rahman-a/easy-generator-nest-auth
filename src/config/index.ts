import { ForbiddenException } from '@nestjs/common';

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

export const origins =
  process.env.NODE_ENV === 'production'
    ? ['https://easy-generator-react-test-production.up.railway.app']
    : ['http://localhost:5173', 'http://127.0.0.1:5173'];

// console.log('env: ', process.env.NODE_ENV);

export const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    if (!origin || origins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new ForbiddenException('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};
