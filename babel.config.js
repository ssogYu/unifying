module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          ie: 11,
        },
      },
    ],
  ],
  plugins: ["@babel/plugin-transform-runtime"],
  ignore: [
    "node_modules/**"
  ]
};
