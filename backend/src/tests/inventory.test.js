const inventoryValidation = require("../modules/inventory/inventory.validation");

const OBJECT_ID_A = "507f1f77bcf86cd799439011";
const OBJECT_ID_B = "507f1f77bcf86cd799439012";

describe("inventory.validation - updateStock", () => {
  const valid = { productId: OBJECT_ID_A, storeId: OBJECT_ID_B, quantity: 5 };

  it("accepts a valid stock update", () => {
    const { error } = inventoryValidation.updateStock.validate(valid);
    expect(error).toBeUndefined();
  });

  it("rejects a missing productId", () => {
    const { error } = inventoryValidation.updateStock.validate({ ...valid, productId: undefined });
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/Product ID is required/i);
  });

  it("rejects a quantity below 1", () => {
    const { error } = inventoryValidation.updateStock.validate({ ...valid, quantity: 0 });
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/at least 1/i);
  });
});

describe("inventory.validation - transferStock", () => {
  const valid = {
    productId: OBJECT_ID_A,
    fromStoreId: OBJECT_ID_A,
    toStoreId: OBJECT_ID_B,
    quantity: 3,
  };

  it("accepts a valid transfer", () => {
    const { error } = inventoryValidation.transferStock.validate(valid);
    expect(error).toBeUndefined();
  });

  it("rejects a missing destination store", () => {
    const { error } = inventoryValidation.transferStock.validate({ ...valid, toStoreId: undefined });
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/Destination Store ID is required/i);
  });

  it("rejects a non-ObjectId source store", () => {
    const { error } = inventoryValidation.transferStock.validate({ ...valid, fromStoreId: "abc" });
    expect(error).toBeDefined();
  });
});

describe("inventory.validation - adjustStock", () => {
  const valid = {
    productId: OBJECT_ID_A,
    storeId: OBJECT_ID_B,
    quantity: -2,
    remarks: "Damaged goods",
  };

  it("accepts a valid adjustment (negative quantity allowed)", () => {
    const { error } = inventoryValidation.adjustStock.validate(valid);
    expect(error).toBeUndefined();
  });

  it("requires remarks for an adjustment", () => {
    const { error } = inventoryValidation.adjustStock.validate({ ...valid, remarks: undefined });
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/Remarks are required/i);
  });
});

describe("inventory.validation - getLowStock", () => {
  it("accepts an empty query (storeId optional)", () => {
    const { error } = inventoryValidation.getLowStock.validate({});
    expect(error).toBeUndefined();
  });

  it("rejects an invalid storeId", () => {
    const { error } = inventoryValidation.getLowStock.validate({ storeId: "nope" });
    expect(error).toBeDefined();
  });
});
