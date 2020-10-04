module.exports = {
  plugins: [
    require('postcss-cssnext'), // 包含了autoprefixer
    // require('autoprefixer')({
    //   "overrideBrowserslist": [
    //     '>1%', 'last 2 versions' // 指定兼容的浏览器目标，市场占有率大于1%
    //   ]
    // })
  ],
};
