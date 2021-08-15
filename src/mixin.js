export default {
  methods: {
    deepClone(objectToClone) {
      return JSON.parse(JSON.stringify(objectToClone));
    },
    sortByKey(array, key, isDate, descending) {
      const newArray = array.sort((a, b) => {
        const x = a[key];
        const y = b[key];
        if (isDate) return new Date(x).getTime() - new Date(y).getTime();
        if (typeof x === 'string' && typeof y === 'string')
          return x.localeCompare(y);
        return x < y ? -1 : x > y ? 1 : 0;
      });
      if (descending) newArray.reverse();
      return newArray;
    },
    validEmailFormat(email) {
      // eslint-disable-next-line no-useless-escape
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    },
  },
};
