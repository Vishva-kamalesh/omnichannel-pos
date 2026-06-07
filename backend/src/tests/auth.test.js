const jwt = require("jsonwebtoken");

const { registerSchema, loginSchema } = require("../modules/auth/auth.validation");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// generateToken reads process.env.JWT_SECRET at call time, so set it before requiring.
process.env.JWT_SECRET = "test_secret";
process.env.JWT_EXPIRES_IN = "1h";
const generateToken = require("../utils/generateToken");

describe("auth.validation - registerSchema", () => {
  const validUser = {
    name: "Jane Doe",
    email: "jane@example.com",
    password: "supersecret",
    role: "cashier",
  };

  it("accepts a valid registration payload", () => {
    const { error, value } = registerSchema.validate(validUser);
    expect(error).toBeUndefined();
    expect(value.email).toBe("jane@example.com");
  });

  it("rejects an invalid email", () => {
    const { error } = registerSchema.validate({ ...validUser, email: "not-an-email" });
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/valid email/i);
  });

  it("rejects a password shorter than 8 characters", () => {
    const { error } = registerSchema.validate({ ...validUser, password: "short" });
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/at least 8 characters/i);
  });

  it("rejects a name shorter than 2 characters", () => {
    const { error } = registerSchema.validate({ ...validUser, name: "J" });
    expect(error).toBeDefined();
  });

  it("rejects an unknown role", () => {
    const { error } = registerSchema.validate({ ...validUser, role: "superuser" });
    expect(error).toBeDefined();
  });

  it("requires name, email and password", () => {
    const { error } = registerSchema.validate({});
    expect(error).toBeDefined();
  });
});

describe("auth.validation - loginSchema", () => {
  it("accepts a valid login payload", () => {
    const { error } = loginSchema.validate({ email: "jane@example.com", password: "anything" });
    expect(error).toBeUndefined();
  });

  it("rejects a missing password", () => {
    const { error } = loginSchema.validate({ email: "jane@example.com" });
    expect(error).toBeDefined();
  });

  it("rejects an invalid email", () => {
    const { error } = loginSchema.validate({ email: "bad", password: "anything" });
    expect(error).toBeDefined();
  });
});

describe("utils/generateToken", () => {
  it("signs a JWT that decodes back to the given id", () => {
    const token = generateToken("507f1f77bcf86cd799439011");
    expect(typeof token).toBe("string");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe("507f1f77bcf86cd799439011");
    expect(decoded.exp).toBeGreaterThan(decoded.iat);
  });
});

describe("utils/ApiError", () => {
  it("captures status code and message", () => {
    const err = new ApiError(404, "Not found");
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Not found");
    expect(err.success).toBe(false);
    expect(err.isOperational).toBe(true);
  });
});

describe("utils/asyncHandler", () => {
  it("forwards rejected promises to next()", async () => {
    const boom = new Error("boom");
    const handler = asyncHandler(async () => {
      throw boom;
    });
    const next = jest.fn();

    await handler({}, {}, next);

    expect(next).toHaveBeenCalledWith(boom);
  });

  it("does not call next() on success", async () => {
    const handler = asyncHandler(async (req, res) => {
      res.ok = true;
    });
    const res = {};
    const next = jest.fn();

    await handler({}, res, next);

    expect(res.ok).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });
});
