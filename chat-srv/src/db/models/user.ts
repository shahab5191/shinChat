import { Model, DataTypes } from "sequelize";
import { sequelize } from "../connect";
import { Message } from "./message";
import { Conversation } from "./conversation";

export class User extends Model {
  declare id: string;
  declare bannedList: Array<string>;
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
