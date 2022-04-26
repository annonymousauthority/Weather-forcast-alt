const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3'
});

class Location extends Sequelize.Model{}
Location.init(
    {
        longitude:{
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        latitude:{
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        slug:{
            type: Sequelize.STRING,
            allowNull: false,
            unique: false
        },
        min:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        max:{
            type:Sequelize.INTEGER,
            allowNull: false
        },
        createdAt:{
            type: Sequelize.DATEONLY,
            allowNull: false,
            unique: false
        }
    },
    {
        sequelize,
        modelName: 'Location'
      }
)

class Forcast extends Sequelize.Model{}
Forcast.init({
    min:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    max:{
        type:Sequelize.INTEGER,
        allowNull: false
    },
    LocationId:{
        type: Sequelize.INTEGER,
        references: {
          model: Location, 
          key: 'id',
       }
      }
}, {sequelize, modelName:'Forcast'})

Location.hasMany(Forcast)
Forcast.belongsTo(Location)
module.exports ={
    sequelize,
    Location,
    Forcast
}
