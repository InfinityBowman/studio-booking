module.exports = {
  apps: [
    {
      name: 'studio-booking',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
      time: true,
    },
  ],
};
