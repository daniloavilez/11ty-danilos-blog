const environment = process.env.ELEVENTY_ENV;
const PROD_ENV = 'production';
const isProd = environment === PROD_ENV;

const tracking = {
  gtag: 'G-FFHG60G3R3'
}

module.exports = {
  environment,
  isProd,
  tracking
};