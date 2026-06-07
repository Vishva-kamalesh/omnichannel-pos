const { createOrderSchema, refundOrderSchema } = require("../modules/orders/order.validation");

const OBJECT_ID = "507f1f77bcf86cd799439011";

describe("order.validation - createOrderSchema", () => {
  const validOrder = {
    storeId: OBJECT_ID,
    items: [{ productId: OBJECT_ID, quantity: 2 }],
    paymentMethod: "cash",
  };

  it("accepts a valid order and applies tax/discount defaults", () => {
    const { error, value } = createOrderSchema.validate(validOrder);
    expect(error).toBeUndefined();
    expect(value.tax).toBe(0);
    expect(value.discount).toBe(0);
  });

  it("rejects a non-ObjectId storeId", () => {
    const { error } = createOrderSchema.validate({ ...validOrder, storeId: "123" });
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/valid MongoDB ObjectId/i);
  });

  it("rejects an empty items array", () => {
    const { error } = createOrderSchema.validate({ ...validOrder, items: [] });
    expect(error).toBeDefined();
  });

  it("rejects a quantity below 1", () => {
    const { error } = createOrderSchema.validate({
      ...validOrder,
      items: [{ productId: OBJECT_ID, quantity: 0 }],
    });
    expect(error).toBeDefined();
  });

  it("rejects an unknown payment method", () => {
    const { error } = createOrderSchema.validate({ ...validOrder, paymentMethod: "bitcoin" });
    expect(error).toBeDefined();
  });

  it("accepts each supported payment method", () => {
    for (const paymentMethod of ["cash", "card", "upi", "credit"]) {
      const { error } = createOrderSchema.validate({ ...validOrder, paymentMethod });
      expect(error).toBeUndefined();
    }
  });

  it("rejects a negative discount", () => {
    const { error } = createOrderSchema.validate({ ...validOrder, discount: -5 });
    expect(error).toBeDefined();
  });
});

describe("order.validation - refundOrderSchema", () => {
  it("accepts a refund with a reason", () => {
    const { error } = refundOrderSchema.validate({ reason: "Customer changed mind" });
    expect(error).toBeUndefined();
  });

  it("rejects a refund without a reason", () => {
    const { error } = refundOrderSchema.validate({});
    expect(error).toBeDefined();
  });
});
