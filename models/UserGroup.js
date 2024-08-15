import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import User from './UserModel.js';
import Group from './Group.js';

const { DataTypes } = Sequelize;

const UserGroup = db.define('user_groups', {
  userid: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  groupid: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: 'id'
    }
  }
}, {
  freezeTableName: true,
  timestamps: false,
  schema: 'public',
});

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

User.hasMany(UserGroup, { foreignKey: 'userid' });
UserGroup.belongsTo(Group, { foreignKey: 'groupid' });


(async () => {
  await db.sync();
})();

export default UserGroup;