export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM(['admin', 'subscriber']),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'This email address has been taken.'
      },
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Please enter a valid email address. Example: your@gmail.com'
        }
      }
    },
  }, {});
  User.associate = (models) => {
    User.hasOne(models.Subscription, {
      foreignKey: 'userId',
      as: 'subscriber'
    });
    User.hasMany(models.Order, {
      foreignKey: 'userId',
      as: 'user'
    });
  };
  return User;
};
