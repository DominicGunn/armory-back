module.exports = (sequelize, DataTypes) => {
  const Gw2Guild = sequelize.define('Gw2Guild', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    favor: {
      type: DataTypes.INTEGER,
    },
    resonance: {
      type: DataTypes.INTEGER,
    },
    aetherium: {
      type: DataTypes.INTEGER,
    },
    influence: {
      type: DataTypes.INTEGER,
    },
    level: {
      type: DataTypes.INTEGER,
    },
    motd: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(1000),
      collate: 'utf8_general_ci',
      charset: 'utf8',
    },
    apiTokenId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      onDelete: 'SET NULL',
      references: {
        model: 'Gw2ApiTokens',
        key: 'id',
      },
    },
    privacy: DataTypes.STRING,
  }, {
    classMethods: {
      associate (models) {
        Gw2Guild.belongsTo(models.Gw2ApiToken, {
          onDelete: 'SET NULL',
          foreignKey: {
            name: 'apiTokenId',
            allowNull: false,
          },
        });
      },
    },
  });

  return Gw2Guild;
};
