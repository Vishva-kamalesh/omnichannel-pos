const Store = require("./store.model");
const ApiError = require("../../utils/ApiError");

const createStore = async (data) => {
  const existing = await Store.findOne({ name: data.name });
  if (existing) {
    throw new ApiError(400, "Store with this name already exists");
  }
  return Store.create(data);
};

const getStores = async (query) => {
  const { page = 1, limit = 10, search, isActive } = query;
  const filter = {};
  if (typeof isActive !== "undefined") filter.isActive = isActive === "true";
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [stores, total] = await Promise.all([
    Store.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
    Store.countDocuments(filter),
  ]);

  return {
    stores,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  };
};

const getStoreById = async (id) => {
  const store = await Store.findById(id);
  if (!store) throw new ApiError(404, "Store not found");
  return store;
};

const updateStore = async (id, data) => {
  const store = await Store.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!store) throw new ApiError(404, "Store not found");
  return store;
};

const deactivateStore = async (id) => {
  const store = await Store.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!store) throw new ApiError(404, "Store not found");
  return store;
};

module.exports = {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deactivateStore,
};
