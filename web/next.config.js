const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
const nextConfig = (phase, { defaultConfig }) => {
  const globalConfig = {
    ...defaultConfig,
    webpack5: true,
  };
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...globalConfig,
      /* development only config options here */
    };
  }

  return {
    ...globalConfig,
    /* development only config options here */
    /* config options for all phases except development here */
  };
};

module.exports = nextConfig;
