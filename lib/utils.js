function camelize(text) {
  const a = text.toLowerCase()
    .replaceAll(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
  return a.slice(0, 1).toLowerCase() + a.slice(1);
}


class GetterSetter {

  makeGetterSetter(varname) {
    return function(value) {
      const key = '_' + varname;
      if (value) {
        this[key] = value;
        return this;
      }
      return this[key];
    }.bind(this);
  }

  getCleanNameFromNotation(str) {
    str = str.replace(/([[\]<>]+)/g, '').replace('...', '');
    return camelize(str);
  }

}


/**
 *
 * @param {String} option
 */
const getDashedOption = function getDashedOption(option) {
  if (option.length === 1) {
    return '-' + option;
  }
  return '--' + option;
};

/**
 *
 * @param {Object} obj
 */
const isPromise = function isPromise(obj) {
  return obj && typeof obj.then === 'function';
};

export { GetterSetter, getDashedOption, isPromise };
