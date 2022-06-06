const withImages = require("next-images");
require("dotenv").config();
module.exports = {
  env: {
    BACKEND_API_URL: process.env.ENVIROMENT_VAR,
  },
  publicRuntimeConfig: {
    BACKEND_API_URL: process.env.ENVIROMENT_VAR,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config, options) => {
    config.module.rules.push(
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 100000,
          },
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: "css-loader",
            options: {},
          },
          {
            loader: "resolve-url-loader",
            options: {
              removeCR: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sourceMapContents: false,
            },
          },
        ],
      }
    );

    return config;
  },

  ...withImages(),
  reactStrictMode: true,
  images: {
    disableStaticImages: true,
  },
  future: {
    webpack5: true,
  },
  experimental: { css: true },
};
