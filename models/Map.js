const Moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  var GooglesPlaces = sequelize.define('GooglesPlaces',{
      name: DataTypes.STRING,
      latitude:DataTypes.STRING,
      longtitude:DataTypes.STRING
  });
  
  return GooglesPlaces;
};