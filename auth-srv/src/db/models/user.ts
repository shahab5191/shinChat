import { Model, DataTypes } from "sequelize";
import { sequelize } from "../connect";

export class User extends Model {
  declare id: string;
  declare email: string;
  declare firstName: string;
  declare userName: string;
  declare salt: string;
  declare password: string;
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
    email: { type: DataTypes.STRING },
    firstName: { type: DataTypes.STRING },
    userName: { type: DataTypes.STRING },
    salt: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
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
User.addScope("withNoPass", { attributes: { exclude: ["password", "salt"] } });
