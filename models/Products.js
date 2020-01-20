const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
    let Products = sequelize.define('Products', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: { type: DataTypes.STRING },
        thumbnail : { type: DataTypes.STRING },
        price: { type: DataTypes.INTEGER },
        description: { type: DataTypes.TEXT }
    });

    Products.associate = (models) => {
        // 메모 모델에 외부키를 건다
        // onDelete 옵션 이용해서 제품이 삭제될 때 이에 속하는 메모들도 한꺼번에 일괄적으로 삭제한다.
        Products.hasMany(models.ProductsMemo, {
            as: 'Memo',
            foreignKey: 'product_id',
            sourceKey: 'id',
            onDelete: 'CASCADE'
        })
    }

    Products.prototype.dateFormat = (date) => (moment(date).format('YYYY-MM-DD'));
        
    return Products;
  }

