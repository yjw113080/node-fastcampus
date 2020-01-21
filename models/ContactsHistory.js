const moment = require('moment');
module.exports = function(sequelize, DataTypes) {
    const ContactsHistory = sequelize.define('ContactsHistory', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.TEXT,
            validate: {
                len: [0, 500]
            }
        }
    }, {
        tableName: 'ContactsHistory'
    });

    ContactsHistory.prototype.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD // h:mm')
    );
    
    return ContactsHistory;
}