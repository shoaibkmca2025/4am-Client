// PM2 process manager config — keeps the Node server alive, restarts on
// crash, and starts it again after a server reboot.
//
//   pm2 start deploy/ecosystem.config.cjs
//   pm2 save && pm2 startup   (prints a command to run once, enables boot start)
//
module.exports = {
  apps: [
    {
      name: '4am',
      // tsx runs the TypeScript server directly (tsx is a runtime dependency).
      script: 'npm',
      args: 'start',
      cwd: __dirname + '/..',
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      // Bind to localhost only — nginx is the public entry point (TLS).
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: '8080',
      },
      max_memory_restart: '400M',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      merge_logs: true,
      time: true,
    },
  ],
};
