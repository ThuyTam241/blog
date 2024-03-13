const moment = require('moment');

module.exports = {
  formatDate: (date) => {
    return moment(date).format('DD/MM/YYYY');
  },
  formatDateTime: (date) => {
    return moment(date).format('DD/MM/YYYY HH:mm');
  },
  compareIds: (id1, id2, options) => {
    if (id1.toString() == id2.toString()) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
};
