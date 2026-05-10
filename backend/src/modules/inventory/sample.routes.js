const express = require("express");
const router = express.Router();
const { protect } = require("../auth/auth.middleware");
const authorize = require("../../middlewares/role.middleware");

/**
 * @swagger
 * /api/v1/inventory/admin-only-task:
 *   get:
 *     summary: Example protected route (Admin/Manager only)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       403:
 *         description: Not authorized for this role
 */
router.get(
  "/admin-only-task",
  protect,
  authorize("admin", "manager"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome, Admin/Manager! You have access to this enterprise feature.",
      data: {
        task: "Inventory Audit",
        authorizedUser: req.user.name,
      },
    });
  }
);

module.exports = router;
