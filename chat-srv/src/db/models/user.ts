import { Model, DataTypes } from "sequelize";
import { sequelize } from "../connect";

export class User extends Model {
  declare id: string;
  declare bannedList: Array<string>;
  declare username: string
  declare addFriend: (friend: User) => Promise<void>;
  declare getFriends: () => Promise<User[]>;
}
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: { type: DataTypes.STRING },
    bannedList: { type: DataTypes.ARRAY(DataTypes.UUID), defaultValue: [] },
  },
  {
    sequelize,
    modelName: "User",
  }
);
User.belongsToMany(User, {
  as: "Friends",
  through: "Friendship",
  foreignKey: "userId",
  otherKey: "friendId",
});
