'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      uuid:{
        type:Sequelize.UUID,
        allowNull: false,
        defaultValue:Sequelize.UUIDV4
      }, 
      from:{type: Sequelize.STRING,
        allowNull: false,},
      to: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('messages');
  }
};