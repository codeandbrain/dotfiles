const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: isGitHubActions ? '/dotfile' : '',
  assetPrefix: isGitHubActions ? '/dotfile/' : undefined,
};

module.exports = nextConfig;
