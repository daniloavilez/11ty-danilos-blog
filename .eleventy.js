const { DateTime } = require('luxon');
const util = require('util');

const {
  fortawesomeFreeRegularPlugin,
} = require('@vidhill/fortawesome-free-regular-11ty-shortcode');

const readingTime = require('eleventy-plugin-reading-time');

const readerBar = require('eleventy-plugin-reader-bar');

const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItHighlightJS = require('markdown-it-highlightjs');

const pluginTOC = require('eleventy-plugin-toc');

const mdOptions = {
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
}
const mdAnchorOpts = {
  permalink: true,
  permalinkClass: 'anchor-link',
  permalinkSymbol: '#',
  level: [1, 2, 3, 4]
}

module.exports = function (eleventyConfig) {

  // Customized by Danilo Avilez
  eleventyConfig.setLibrary(
    'md',
    markdownIt(mdOptions)
      .use(markdownItAnchor, mdAnchorOpts)
      .use(markdownItHighlightJS)
  );

  eleventyConfig.addPlugin(pluginTOC);

  eleventyConfig.addPlugin(fortawesomeFreeRegularPlugin);
  eleventyConfig.addPlugin(readingTime);

  eleventyConfig.addPlugin(readerBar);

  // Layout aliases for convenience
  eleventyConfig.addLayoutAlias('default', 'layouts/base.njk');
  eleventyConfig.addLayoutAlias('conf', 'layouts/conf.njk');

  // a debug utility
  eleventyConfig.addFilter('dump', obj => {
    return util.inspect(obj)
  });

  // Date helpers
  eleventyConfig.addFilter('readableDate', dateObj => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat('LLLL d, y');
  });
  eleventyConfig.addFilter('htmlDate', dateObj => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat('y-MM-dd');
  });

  // Grab excerpts and sections from a file
  eleventyConfig.addFilter("section", require("./src/utils/section.js"));

  // compress and combine js files
  eleventyConfig.addFilter("jsmin", require("./src/utils/minify-js.js"));

  // minify the html output when running in prod
  if (process.env.NODE_ENV == "production") {
    eleventyConfig.addTransform("htmlmin", require("./src/utils/minify-html.js"));
  }

  // Static assets to pass through
  eleventyConfig.addPassthroughCopy("./src/site/fonts");
  eleventyConfig.addPassthroughCopy("./src/site/images");
  eleventyConfig.addPassthroughCopy("./src/site/css");

  return {
    dir: {
      input: "src/site",
      includes: "_includes",
      output: "dist"
    },
    passthroughFileCopy: true,
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };

};
