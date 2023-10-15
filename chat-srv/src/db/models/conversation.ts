import { Model, DataTypes } from "sequelize";
import { sequelize } from "../connect";
import { Message } from "./message";
import { User } from "./user";

export class Conversation extends Model {
  declare id: string;
  declare name: string;
  declare getMessages: () => Promise<Message[]>;
  declare addMessage: (message: Message) => Promise<void>;
}

Conversation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Conversation",
  }
);
Conversation.belongsToMany(User, {
  through: "User_Conversation",
});
