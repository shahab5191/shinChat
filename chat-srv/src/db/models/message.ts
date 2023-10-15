import { Model, DataTypes } from "sequelize";
import { sequelize } from "../connect";
import { Conversation } from "./conversation";
import { User } from "./user";

export class Message extends Model {
  declare id: string;
  declare senderId: string;
  declare body: string;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    senderId: { type: DataTypes.UUID },
    body: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "Message",
  }
);
Message.belongsTo(Conversation, { foreignKey: "conversationId" });
Message.belongsTo(User, { foreignKey: "userId" });
