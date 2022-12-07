const Category = require('../models/category');
const Item = require('../models/item');
const { body, validationResult } = require('express-validator');

exports.item_detail = (req, res, next) => {
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
        itemID: req.params.id,
      });
    }
  });
};

exports.item_create = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      res.render('item_create', {
        title: 'Create Item',
        category: category.name,
      });
    } else {
      res.status(404).send("Page doesn't exist");
    }
  } catch (error) {
    next(error);
  }
};

exports.item_post = [
  body('itemName', 'Item name required').trim().isLength({ min: 3 }).escape(),
  body('description').trim().escape(),
  body('price', 'Price requirted').trim().isNumeric().escape(),
  body('numberInStock', 'Number in stock requirted')
    .trim()
    .isNumeric()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const name = req.body.itemName;
    const description = req.body.description;
    const price = req.body.price;
    const numberInStock = req.body.numberInStock;

    const category = req.params.id;

    const item = new Item({
      name: name,
      description: description,
      price: price,
      numberInStock: numberInStock,
      category: category,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('item_create', {
        title: 'Create Category',
        item,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Item with same name already exists.
      Item.findOne({ name: name }).exec((err, found_item) => {
        if (err) {
          return next(err);
        }

        if (found_item) {
          // Item exists, redirect to its detail page.
          res.redirect(found_item.url);
        } else {
          item.save((err) => {
            if (err) {
              return next(err);
            }
          });
          // Item saved. Redirect to item detail page.
          res.redirect(item.url);
        }
      });
    }
  },
];

exports.item_delete = async (req, res, next) => {
  try {
    await Item.deleteOne({ _id: req.params.id });

    res.redirect('/');
  } catch (error) {
    next(error);
  }
};
