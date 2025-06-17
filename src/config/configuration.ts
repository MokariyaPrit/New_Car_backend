export default () => {
  // Log after env variables are loaded
  console.log('ENV loaded:', {
    DB_HOST: process.env.DB_HOST,
    JWT_SECRET: process.env.JWT_SECRET,
  });

  return {
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
      name: process.env.DB_NAME!,
    },
    jwt: { 
      secret: process.env.JWT_SECRET!,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      refreshSecret: process.env.REFRESH_SECRET!,
      refreshExpiresIn: process.env.REFRESH_EXPIRES_IN || '7d',
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
      apiKey: process.env.CLOUDINARY_API_KEY!,
      apiSecret: process.env.CLOUDINARY_API_SECRET!,
    },
  };
};

