const withImages = require("next-images");

module.exports = {
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SECRET: process.env.NEXT_PUBLIC_SECRET,
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
