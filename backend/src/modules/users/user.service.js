const User = require("./user.model");
const ApiError = require("../../utils/ApiError");

const createUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new ApiError(400, "User with this email already exists");
  }
  const user = await User.create(data);
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

const getUsers = async (query) => {
  const { page = 1, limit = 10, role, search, storeId, isActive } = query;
  const filter = {};
  if (role) filter.role = role;
  if (storeId) filter.storeId = storeId;
  if (typeof isActive !== "undefined") filter.isActive = isActive === "true";
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(filter)
      .populate("storeId", "name location")
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  };
};

const getUserById = async (id) => {
  const user = await User.findById(id).populate("storeId", "name location");
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const updateUser = async (id, data) => {
  // Never allow direct password updates through this endpoint — separate flow handles that.
  delete data.password;
  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const changePassword = async (id, newPassword) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");
  user.password = newPassword;
  await user.save();
  return { success: true };
};

const deactivateUser = async (id) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  changePassword,
  deactivateUser,
};
