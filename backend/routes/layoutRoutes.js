const { savelayout, loadLayout } = require("../controllers/layoutController");
const { Login, SignUp } = require("../controllers/userControllers");
const express=require("express");

const router = express.Router();

router.route('/save-layout').post(savelayout)
router.route('/load-layout').get(loadLayout)

module.exports = router;