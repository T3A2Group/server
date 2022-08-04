import request from "supertest";
import app from "../server.js";
import adminUser from "./mock-data/admin-user.json";
import generateToken from "../utils/generateToken.js";
import mockOrder from "./mock-data/mock-order.json";
import Order from "../models/orderModel.js";
import Food from "../models/products/foodModel.js";
import mongoose from "mongoose";

const adminToken = generateToken(adminUser._id);
const userToken = generateToken("62e1cf22d3b326caf90071de");

const orderUrl = "/api/orders";

// Test create order
// POST /api/orders
describe("Test createOrder, check if admin could create new order, and non-admin can not.", () => {
  // Test for createOrder
  // POST /api/orders
  it("Should create a new order and check each order is correct when login(have toten)", async () => {
    const response = await request(app)
      .post(orderUrl)
      .set("Authorization", "Bearer " + adminToken)
      .send(mockOrder);
    expect(response.status).toBe(201); // check status code
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.orderItems[0].product).toBe(
      "62e1cf22d3b326caf90071e3"
    ); // check response item id is correct
    mockOrder._id = response.body._id; // set _id to mockOrder
  });

  it("Should not allows non-login users to create order", async () => {
    const response = await request(app).post(orderUrl).send(mockOrder);
    expect(response.status).toBe(401); // check status code
  });

  it("Should return 400 when orderitem is empty", async () => {
    const response = await request(app)
      .post(orderUrl)
      .set("Authorization", "Bearer " + adminToken)
      .send({
        ...mockOrder,
        orderItems: [],
      });
    expect(response.status).toBe(400); // check status code
    expect(response.body.message).toBe("No order items"); // check message
  });
});

// Test get order by id
// GET /api/orders/:id
describe("Test getOrderById, check if Login user could get order by id, and non-login user can not.", () => {
  // Test for getOrderById
  // GET /api/orders/:id
  it("Should get order by id and check each order is correct when login(have toten)", async () => {
    const response = await request(app)
      .get(orderUrl + "/" + mockOrder._id)
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(200); // check status code
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.orderItems[0].product).toBe(
      "62e1cf22d3b326caf90071e3"
    ); // check response item id is correct
  });

  it("Should not allows non-login users to get order by id", async () => {
    const response = await request(app).get(orderUrl + "/" + mockOrder._id);
    expect(response.status).toBe(401); // check status code
  });

  it("Should return 404 when order is not found", async () => {
    const response = await request(app)
      .get(orderUrl + "/" + "62ea4820e159ff0fdf2270af")
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(404); // check status code
    expect(response.body.message).toBe("Order Not Found"); // check message
  });

  it("Should return 500 when order id is not valid", async () => {
    const response = await request(app)
      .get(orderUrl + "/" + "5e8f8f8f8f8f8f8f8f8f8f")
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(500); // check status code
    expect(response.body.message).toBe(
      'Cast to ObjectId failed for value "5e8f8f8f8f8f8f8f8f8f8f" (type string) at path "_id" for model "Order"'
    ); // check message
  });
});

// Test update order to paid
// PUT /api/orders/:id/pay
describe("Test updateOrderToPaid, check if Login user could update order to paid, and non-login user can not.", () => {
  // Test for updateOrderToPaid
  // PUT /api/orders/:id/pay
  it("Should update order to paid (isPaid to be true) when login(have toten)", async () => {
    const response = await request(app)
      .put(orderUrl + "/" + mockOrder._id + "/pay")
      .set("Authorization", "Bearer " + adminToken)
      .send({
        id: "test_id",
        status: 200,
        update_time: "test time",
        payer: {
          email_address: "test-eamil@eamil.com",
        },
      });
    expect(response.status).toBe(200); // check status code
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.isPaid).toBe(true); // check if isPaid is changed to true
  });

  it("Should not allows non-login users to update order to paid", async () => {
    const response = await request(app).put(
      orderUrl + "/" + mockOrder._id + "/pay"
    );
    expect(response.status).toBe(401); // check status code
  });

  it("Should correctly reduce stock when order is paid", async () => {
    const order = await Order.findById(mockOrder._id);
    const item0 = await Food.findById(order.orderItems[0].product);
    const stock = item0.countInStock;

    const response = await request(app)
      .put(orderUrl + "/" + mockOrder._id + "/pay")
      .set("Authorization", "Bearer " + adminToken)
      .send({
        id: "test_id",
        status: 200,
        update_time: "test time",
        payer: {
          email_address: "test-eamil@eamil.com",
        },
      });
    expect(response.status).toBe(200); // check status code
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.isPaid).toBe(true); // check if isPaid is changed to true
    expect(item0.countInStock).toBe(stock); // check if stock is reduced
  });

  it("Should return 404 when order is not found", async () => {
    const response = await request(app)
      .put(orderUrl + "/" + "62ea4820e159ff0fdf2270af" + "/pay")
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(404); // check status code
    expect(response.body.message).toBe("Order Not Found"); // check message
  });

  it("Should return 500 when order id is not valid", async () => {
    const response = await request(app)
      .put(orderUrl + "/" + "5e8f8f8f8f8f8f8f8f8f8f" + "/pay")
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(500); // check status code
    expect(response.body.message).toBe(
      'Cast to ObjectId failed for value "5e8f8f8f8f8f8f8f8f8f8f" (type string) at path "_id" for model "Order"'
    ); // check message
  });
});

// Test update order to dispatched
// PUT /api/orders/:id/dispatch
describe("Test updateOrderToDispatch, check if admin user could update order to dispatch, and non-admin user can not.", () => {
  // Test for updateOrderToDispatch
  // PUT /api/orders/:id/dispatch
  it("Should update order to dispatch (isDispatched to be true) when admin(have toten)", async () => {
    const response = await request(app)
      .put(orderUrl + "/" + mockOrder._id + "/dispatch")
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(200); // check status code
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.isDispatched).toBe(true); // check if isDispatched is changed to true
  });

  it("Should not allows non-admin users to update order to dispatch", async () => {
    const response = await request(app)
      .put(orderUrl + "/" + mockOrder._id + "/dispatch")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(401); // check status code
  });

  it("Should return 404 when order is not found", async () => {
    const response = await request(app)
      .put(orderUrl + "/" + "62ea4820e159ff0fdf2270af" + "/dispatch")
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(404); // check status code
    expect(response.body.message).toBe("Order Not Found"); // check message
  });

  it("Should return 500 when order id is not valid", async () => {
    const response = await request(app)
      .put(orderUrl + "/" + "5e8f8f8f8f8f8f8f8f8f8f" + "/dispatch")
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(500); // check status code
    expect(response.body.message).toBe(
      'Cast to ObjectId failed for value "5e8f8f8f8f8f8f8f8f8f8f" (type string) at path "_id" for model "Order"'
    ); // check message
  });
});

// Test get users orders
// GET /api/orders/myorders
describe("Test getUsersOrders, check if login user could get user's orders, and non-login user can not.", () => {
  // Test for getUsersOrders
  // GET /api/orders/myorders
  it("Should get user's orders when login(have toten)", async () => {
    const response = await request(app)
      .get(orderUrl + "/myorders")
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(200); // check status code
    expect(response.body.length).toBeGreaterThan(1); // check if response has at least 1 order
  });

  it("Should not allows non-login users to get user's orders", async () => {
    const response = await request(app).get(orderUrl + "/myorders");
    expect(response.status).toBe(401); // check status code
  });
});

// Test get all orders
// GET /api/orders
describe("Test getAllOrders, check if admin user could get all orders, and non-admin user can not.", () => {
  // Test for getAllOrders
  // GET /api/orders
  it("Should get all orders when admin(have toten)", async () => {
    const response = await request(app)
      .get(orderUrl)
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(200); // check status code
    expect(response.body.length).toBeGreaterThan(1); // check if response has at least 1 order
  });

  it("Should not allows non-admin users to get all orders", async () => {
    const response = await request(app)
      .get(orderUrl)
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(401); // check status code
  });

  it("Should not allows non-login users to get all orders", async () => {
    const response = await request(app).get(orderUrl);
    expect(response.status).toBe(401); // check status code
  });
});

beforeAll((done) => {
  done();
});
afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});
