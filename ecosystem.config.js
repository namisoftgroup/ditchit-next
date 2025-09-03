module.exports = {
  apps: [{
    name: 'nextjs-app',
    script: 'node_modules/.bin/next',
    args: 'start -p 3000',
    cwd: './',  // Or your app directory if in subfolder
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }],
};
