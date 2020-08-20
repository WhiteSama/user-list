export const fillTemplate = (template, data) => {
  const regex = /\${(.*?)\}/g;
  let result = template;
  let m;

  while ((m = regex.exec(template)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    m.forEach((match, groupIndex) => {
      if (groupIndex && data[match] !== undefined) {
        result = result.replace(m[0], data[match].toString() || '');
      }
    });
  }

  return new DOMParser().parseFromString(result, 'text/html');
};
