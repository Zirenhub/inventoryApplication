const Category = require('../models/category');
const Item = require('../models/item');
const { body, validationResult } = require('express-validator');

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

exports.create_get = (req, res) => {
  res.render('create_category_form', {
    title: 'Create Category',
  });
};

exports.create_post = [
  body('cName', 'Category name required').trim().isLength({ min: 3 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({ name: req.body.cName });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('create_category_form', {
        title: 'Create Category',
        category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      Category.findOne({ name: req.body.name }).exec((err, found_category) => {
        if (err) {
          return next(err);
        }

        if (found_category) {
          // Category exists, redirect to its detail page.
          res.redirect(found_category.url);
        } else {
          category.save((err) => {
            if (err) {
              return next(err);
            }
            // Category saved. Redirect to category detail page.
            res.redirect(category.url);
          });
        }
      });
    }
  },
];

exports.delete_get = (req, res, next) => {
  Category.findById(req.params.id).exec((err, results) => {
    if (err) {
      return next(err);
    } else {
      res.render('delete_category_form', {
        title: 'Delete Category',
        category: results.name,
      });
    }
  });
};

exports.delete_post = async (req, res, next) => {
  try {
    await Item.deleteMany({ category: req.params.id });
    await Category.deleteOne({ _id: req.params.id });

    res.redirect('/');
  } catch (error) {
    next(error);
  }
};

exports.category_detail = (req, res, next) => {
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
          cID: req.params.id,
        });
      }
    });
};
