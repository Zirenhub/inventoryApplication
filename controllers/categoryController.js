const Category = require('../models/category');
const Item = require('../models/item');

exports.index = (req, res) => {
  Category.find({}, 'name')
    .sort({ name: 1 })
    .exec((err, results) => {
      if (err) {
        return next(err);
      } else {
        let categoriesCount = 0;
        // convert first letter of category to uppercase
        results.forEach((x) => {
          x.name = x.name.charAt(0).toUpperCase() + x.name.slice(1);
          categoriesCount += 1;
        });
        res.render('index', {
          title: 'Inventory Manager',
          categories: results,
          count: categoriesCount,
        });
      }
    });
};

exports.category_detail = (req, res) => {
  Item.find({ category: req.params.id })
    .sort({ name: 1 })
    .exec(async (err, results) => {
      if (err) {
        return next(err);
      } else {
        let itemCount = 0;
        results.forEach((item) => {
          itemCount += 1;
        });
        let currentCategory = await Category.findById(req.params.id).exec();
        currentCategory.name =
          currentCategory.name.charAt(0).toUpperCase() +
          currentCategory.name.slice(1);

        res.render('category_detail', {
          title: currentCategory.name,
          items: results,
          count: itemCount,
        });
      }
    });
};
