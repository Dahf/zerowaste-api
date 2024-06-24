import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import User from './UserModel.js';
import Group from './Group.js';

const { DataTypes } = Sequelize;

const UserGroup = db.define('user_groups', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  groupId: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: 'id'
    }
  }
}, {
  freezeTableName: true
});

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

User.hasMany(UserGroup, { foreignKey: 'userId' });
UserGroup.belongsTo(Group, { foreignKey: 'groupId' });


(async () => {
  await db.sync();
})();

export default UserGroup;