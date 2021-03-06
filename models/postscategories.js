const PostsCategories = (sequelize, DataTypes) => {
  const PostsCategory = sequelize.define('PostsCategories', {
    postId: { type: DataTypes.INTEGER, primaryKey: true },
    categoryId: { type: DataTypes.INTEGER, primaryKey: true },
  }, {
    timestamps: false,
  });

  return PostsCategory;
};

module.exports = PostsCategories;
