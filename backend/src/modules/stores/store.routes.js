const express = require("express");
const storeController = require("./store.controller");
const storeValidation = require("./store.validation");
const validate = require("../../middlewares/validate.middleware");
const { protect } = require("../auth/auth.middleware");
const { authorize } = require("../../middlewares/role.middleware");

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Store locations
 */

router
  .route("/")
  .get(storeController.getStores)
  .post(
    authorize("admin"),
    validate(storeValidation.createStoreSchema),
    storeController.createStore
  );

router
  .route("/:id")
  .get(storeController.getStoreById)
  .put(
    authorize("admin", "manager"),
    validate(storeValidation.updateStoreSchema),
    storeController.updateStore
  )
  .delete(authorize("admin"), storeController.deactivateStore);

module.exports = router;
