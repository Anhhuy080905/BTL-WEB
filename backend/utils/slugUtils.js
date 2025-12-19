const slugify = require('slugify');

function generateBaseSlug(title, options = {}) {
  return slugify(title, {
    lower: true,
    strict: true,
    locale: 'vi',
    trim: true,
    remove: /[*+~.()'"!:@]/g,
    ...options
  });
}

function isValidSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 80;
}

module.exports = { generateBaseSlug, isValidSlug };