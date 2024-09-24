import { DataTypes, Model, Sequelize } from 'sequelize';

interface QuickBookAttributes {
  quickBookId:number;
  userId: string;
  access_token: string;
  refresh_token: string;
  realmeId: string;
  access_token_expiry: Date;
  refresh_token_expiry: Date;
}

export interface QuickBookInstance extends Model<QuickBookAttributes>, QuickBookAttributes { }

const QuickBook = (sequelize: Sequelize) => {
  const attributes = {
    quickBookId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    realmeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    access_token_expiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    refresh_token_expiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  };

  const QuickBookModel = sequelize.define<QuickBookInstance>('quickbook', attributes);

  return QuickBookModel;
};

export default QuickBook;
