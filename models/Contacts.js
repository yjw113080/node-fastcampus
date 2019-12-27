const moment = require('moment');

module.exports = function (sequelize, DataTypes) {

    let Contacts = sequelize.define('Contacts', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: { type: DataTypes.STRING },
        age: { type: DataTypes.INTEGER },
        description: { type: DataTypes.TEXT }
    });
    Contacts.prototype.dateFormat = (date) => (moment(date).format('YYYY-MM-DD'));
        
    return Contacts;
  }

