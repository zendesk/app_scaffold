var unboundSlice = Array.prototype.slice,
    slice        = Function.prototype.call.bind(unboundSlice);

function fmt(str, formats) {
  var cachedFormats = formats;

  if (!_.isArray(cachedFormats) || arguments.length > 2) {
    cachedFormats = new Array(arguments.length - 1);

    for (var i = 1, l = arguments.length; i < l; i++) {
      cachedFormats[i - 1] = arguments[i];
    }
  }

  // first, replace any ORDERED replacements.
  var idx = 0; // the current index for non-numerical replacements
  return str.replace(/%@([0-9]+)?/g, function(s, argIndex) {
    argIndex = (argIndex) ? parseInt(argIndex, 10) - 1 : idx++;
    s = cachedFormats[argIndex];
    if (s === null) return '(null)';
    if (s === undefined) return '';
    if (_.isFunction(s.toString)) return s.toString();
    return s;
  });
}

module.exports = {
  fmt: function(str) {
    return fmt.call(null, str, slice(arguments, 1));
  },

  safeString: function(str) {
    return new Handlebars.SafeString(str);
  }
};
