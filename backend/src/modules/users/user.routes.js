const express = require("express");
const userController = require("./user.controller");
const userValidation = require("./user.validation");
const validate = require("../../middlewares/validate.middleware");
const { protect } = require("../auth/auth.middleware");
const { authorize } = require("../../middlewares/role.middleware");

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Staff and account management
 */

router
  .route("/")
  .get(authorize("admin", "manager"), userController.getUsers)
  .post(
    authorize("admin"),
    validate(userValidation.createUserSchema),
    userController.createUser
  );

router
  .route("/:id")
  .get(authorize("admin", "manager"), userController.getUserById)
  .put(
    authorize("admin"),
    validate(userValidation.updateUserSchema),
    userController.updateUser
  )
  .delete(authorize("admin"), userController.deactivateUser);

router.patch(
  "/:id/password",
  authorize("admin"),
  validate(userValidation.changePasswordSchema),
  userController.changePassword
);

module.exports = router;
