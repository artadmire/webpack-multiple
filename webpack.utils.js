const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const addEntries = (wpConf, entries) => {
  const { pages = [] } = entries;
  pages.forEach((page) => {
    const entry = page.entry.substring(0, page.entry.length - 5);
    wpConf.entry[entry] = page.src;
    wpConf.plugins.push(new HtmlWebpackPlugin({
      inject: true,
      minify: {
        collapseWhitespace: true,
      },
      filename: page.entry,
      chunks: [entry, 'common'],
      env: process.env.NODE_ENV,
      title: page.title,
      template: path.join(__dirname, './src/index.html'),
      entry,
    }));
  });
  return wpConf;
};

const addAlias = (wpConf, mapper) => {
  const { resolve: { alias = {} } } = wpConf;
  wpConf.resolve.alias = {
    ...alias,
    ...mapper,
  };
};
const BasicUrl = ''; // 这里一般是静态资源存放的地址，例如:cdn上面的地址
module.exports = {
  addEntries,
  addAlias,
  BasicUrl,
};
