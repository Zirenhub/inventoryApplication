const Category = require('../models/category');
const Item = require('../models/item');

exports.item_detail = (req, res) => {
  Item.findById(req.params.id).exec(async (err, results) => {
    if (err) {
      return next(err);
    } else {
      let currentCategory = await Category.findById(results.category).exec();
      currentCategory.name =
        currentCategory.name.charAt(0).toUpperCase() +
        currentCategory.name.slice(1);

      res.render('item_detail', {
        title: results.name,
        description: results.description,
        price: results.price,
        stock: results.numberInStock,
        category: currentCategory,
      });
    }
  });
};
