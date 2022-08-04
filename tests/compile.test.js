import newFood from "./mock-data/new-food.json";
import adminUser from "./mock-data/admin-user.json";
import mockOrder from "./mock-data/mock-order.json";
import Order from "../models/orderModel.js";
import Food from "../models/products/foodModel.js";
import mongoose from "mongoose";
import newSpecialty from "./mock-data/new-specialty.json";
import Specialty from "../models/products/specialtyModel.js";
import newTravel from "./mock-data/new-travel.json";
import Travel from "../models/products/travelModel.js";
import newUser from "./mock-data/new-user.json";
import User from "../models/userModel.js";
import request from "supertest";
import app from "../server.js";
import newVilla from "./mock-data/new-villa.json";
import Villa from "../models/products/villaModel.js";
import generateToken from "../utils/generateToken.js";
const adminToken = generateToken(adminUser._id);

const foodUrl = "/api/food";

// Test All user could get the foodlist
describe("Test getFoodList, check if server could return correct food list data.", () => {
  // Test for getFoodList
  // GET /api/food
  it("Should get food list if keyword is empty.(list all food)", async () => {
    const response = await request(app).get(foodUrl);
    expect(response.status).toBe(200); // check status code
    expect(response.body).not.toBeNull(); // check if have food list return
  });

  it("Should get food list by typein keyword (search function)", async () => {
    const response = await request(app).get(foodUrl).send({ keyword: "a" });
    expect(response.status).toBe(200); // check status code
    expect(response.body).not.toBeNull(); // check if have food list return
  });
});

// test Create food
// POST /api/food
// Need to be admin
describe("Test createFood, check if admin could create new food, and non-admin can not.", () => {
  // Test for createFood
  // POST /api/food
  it("Should create a new food and check each element is correct, if user is admin", async () => {
    const response = await request(app)
      .post(foodUrl)
      .set("Authorization", "Bearer " + adminToken)
      .send(newFood);
    expect(response.status).toBe(201); // check status code
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.name).toBe(newFood.name); // check response name is correct
    expect(response.body.description).toBe(newFood.description); // check response description is correct
    expect(response.body.category).toBe(newFood.category); // check response category is correct
    newFood._id = response.body._id; // set _id to newFood
  });

  it("Should not allows non-admin users to create food", async () => {
    const response = await request(app).post(foodUrl).send(newFood);
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  });
});

// Test Fetch single food by id
// GET /api/food/:id
describe("Test getFoodById, check if the server could return correct single food data", () => {
  // Test for getFoodById
  // GET /api/food/:id
  it("Should get food by id", async () => {
    const response = await request(app).get(foodUrl + "/" + newFood._id);
    expect(response.status).toBe(200); // check status code
    expect(response.body.name).toBe(newFood.name); // check response name is correct
    expect(response.body.description).toBe(newFood.description); // check response description is correct
    expect(response.body.category).toBe(newFood.category); // check response category is correct
    newFood._id = response.body._id; // set _id to newFood
  });
});

// Test update food
// PUT /api/food/:id
describe("Test updateFood, check if admin could maintained food data and non-admin can not.", () => {
  // Test for updateFood
  // PUT /api/food/:id
  it("Should correctly update food if user is admin", async () => {
    const response = await request(app)
      .put(foodUrl + "/" + newFood._id)
      .set("Authorization", "Bearer " + adminToken)
      .send({
        ...newFood,
        name: "Updated Food",
        description: "Updated Description",
        category: "Updated Category",
      });
    expect(response.status).toBe(200); // check status code
    expect(response.body.name).toBe("Updated Food"); // check response name is correct
    expect(response.body.description).toBe("Updated Description"); // check response description is correct
    expect(response.body.category).toBe("food"); // check response category is not changed
  });

  it("Should not allows non-admin users to update food", async () => {
    const response = await request(app)
      .put(foodUrl + "/" + newFood._id)
      .send({
        ...newFood,
        name: "Updated Food",
        description: "Updated Description",
        category: "Updated Category",
      });
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  });

  it("Should return 404 if food not found", async () => {
    const response = await request(app)
      .put(foodUrl + "/" + "5e9f8f8f8f8f8f8f8f8f8f")
      .set("Authorization", "Bearer " + adminToken)
      .send({
        name: "Updated Food",
        description: "Updated Description",
        category: "Updated Category",
      });
    expect(response.status).toBe(500); // check status code
  });
});

// Test delete food
// DELETE /api/food/:id
describe("Test deleteFood, check if admin could correctly delete food, and non-admin can not.", () => {
  // Test for deleteFood
  // DELETE /api/food/:id
  it("Should correctly delete food if user is admin", async () => {
    const response = await request(app)
      .delete(foodUrl + "/" + newFood._id)
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(200); // check status code
    let deletedFood = await Food.findById(newFood._id);
    expect(deletedFood).toBeFalsy(); // make sure food is deleted
  });

  it("Should not allowed non-admin users to delete food", async () => {
    const response = await request(app).delete(foodUrl + "/" + newFood._id);
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  });
});

const userToken = generateToken("62e070fbf31480865f2aa644");

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
      "62e070fbf31480865f2aa649"
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
      "62e070fbf31480865f2aa649"
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

const specialtyUrl = "/api/specialty";

// Test All user could get the specialtylist
describe("Test getSpecialtyList, check if server could return correct specialty list data.", () => {
  // Test for getSpecialtyList
  // GET /api/specialty
  it("Should get specialty list if keyword is empty.(list all specialty)", async () => {
    const response = await request(app).get(specialtyUrl);
    expect(response.status).toBe(200); // check status code
    expect(response.body).not.toBeNull(); // check if have specialty list return
  });

  it("Should get specialty list by typein keyword (search function)", async () => {
    const response = await request(app)
      .get(specialtyUrl)
      .send({ keyword: "a" });
    expect(response.status).toBe(200); // check status code
    expect(response.body).not.toBeNull(); // check if have specialty list return
  });
});

// test Create specialty
// POST /api/specialty
// Need to be admin
describe("Test createSpecialty, check if admin could create new Specialty, and non-admin can not.", () => {
  // Test for createSpecialty
  // POST /api/specialty
  it("Should create a new specialty and check each element is correct, if user is admin", async () => {
    const response = await request(app)
      .post(specialtyUrl)
      .set("Authorization", "Bearer " + adminToken)
      .send(newSpecialty);
    expect(response.status).toBe(201); // check status code
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.name).toBe(newSpecialty.name); // check response name is correct
    expect(response.body.description).toBe(newSpecialty.description); // check response description is correct
    expect(response.body.category).toBe(newSpecialty.category); // check response category is correct
    newSpecialty._id = response.body._id; // set _id to newSpecialty
  });

  it("Should not allows non-admin users to create Specialty", async () => {
    const response = await request(app).post(specialtyUrl).send(newSpecialty);
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  });
});

// Test Fetch single specialty by id
// GET /api/specialty/:id
describe("Test getSpecialtyById, check if the server could return correct single specialty data", () => {
  // Test for getSpecialtyById
  // GET /api/specialty/:id
  it("Should get specialty by id", async () => {
    const response = await request(app).get(
      specialtyUrl + "/" + newSpecialty._id
    );
    expect(response.status).toBe(200); // check status code
    expect(response.body.name).toBe(newSpecialty.name); // check response name is correct
    expect(response.body.description).toBe(newSpecialty.description); // check response description is correct
    expect(response.body.category).toBe(newSpecialty.category); // check response category is correct
    newSpecialty._id = response.body._id; // set _id to newSpecialty
  });
});

// Test update specialty
// PUT /api/specialty/:id
describe("Test updateSpecialty, check if admin could maintained specialty data and non-admin can not.", () => {
  // Test for updateSpecialty
  // PUT /api/specialty/:id
  it("Should correctly update specialty if user is admin", async () => {
    const response = await request(app)
      .put(specialtyUrl + "/" + newSpecialty._id)
      .set("Authorization", "Bearer " + adminToken)
      .send({
        ...newSpecialty,
        name: "Updated Specialty",
        description: "Updated Description",
        category: "Updated Category",
      });
    expect(response.status).toBe(200); // check status code
    expect(response.body.name).toBe("Updated Specialty"); // check response name is correct
    expect(response.body.description).toBe("Updated Description"); // check response description is correct
    expect(response.body.category).toBe("specialty"); // check response category is not changed
  });

  it("Should not allows non-admin users to update specialty", async () => {
    const response = await request(app)
      .put(specialtyUrl + "/" + newSpecialty._id)
      .send({
        ...newSpecialty,
        name: "Updated Specialty",
        description: "Updated Description",
        category: "Updated Category",
      });
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  });

  it("Should return 404 if specialty not found", async () => {
    const response = await request(app)
      .put(specialtyUrl + "/" + "5e9f8f8f8f8f8f8f8f8f8f")
      .set("Authorization", "Bearer " + adminToken)
      .send({
        name: "Updated Specialty",
        description: "Updated Description",
        category: "Updated Category",
      });
    expect(response.status).toBe(500); // check status code
  });
});

// Test delete specialty
// DELETE /api/specialty/:id
describe("Test deleteSpecialty, check if admin could correctly delete specialty, and non-admin can not.", () => {
  // Test for deleteSpecialty
  // DELETE /api/specialty/:id
  it("Should correctly delete specialty if user is admin", async () => {
    const response = await request(app)
      .delete(specialtyUrl + "/" + newSpecialty._id)
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(200); // check status code
    let deletedSpecialty = await Specialty.findById(newSpecialty._id);
    expect(deletedSpecialty).toBeFalsy(); // make sure specialty is deleted
  });

  it("Should not allowed non-admin users to delete specialty", async () => {
    const response = await request(app).delete(
      specialtyUrl + "/" + newSpecialty._id
    );
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  });
});

const travelUrl = "/api/travel";

// Test All user could get the travellist
describe("Test getTravelList, check if server could return correct travel list data.", () => {
  // Test for getTravelList
  // GET /api/travel
  it("Should get travel list if keyword is empty.(list all travel)", async () => {
    const response = await request(app).get(travelUrl);
    expect(response.status).toBe(200); // check status code
    expect(response.body).not.toBeNull(); // check if have travel list return
  });

  it("Should get travel list by typein keyword (search function)", async () => {
    const response = await request(app).get(travelUrl).send({ keyword: "a" });
    expect(response.status).toBe(200); // check status code
    expect(response.body).not.toBeNull(); // check if have travel list return
  });
});

// test Create travel
// POST /api/travel
// Need to be admin
describe("Test createTravel, check if admin could create new travel, and non-admin can not.", () => {
  // Test for createTravel
  // POST /api/travel
  it("Should create a new travel and check each element is correct, if user is admin", async () => {
    const response = await request(app)
      .post(travelUrl)
      .set("Authorization", "Bearer " + adminToken)
      .send(newTravel);
    expect(response.status).toBe(201); // check status code
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.name).toBe(newTravel.name); // check response name is correct
    expect(response.body.description).toBe(newTravel.description); // check response description is correct
    expect(response.body.category).toBe(newTravel.category); // check response category is correct
    newTravel._id = response.body._id; // set _id to newTravel
  });

  it("Should not allows non-admin users to create travel", async () => {
    const response = await request(app).post(travelUrl).send(newTravel);
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  });
});

// Test Fetch single travel by id
// GET /api/travel/:id
describe("Test getTravelById, check if the server could return correct single travel data", () => {
  // Test for getTravelById
  // GET /api/travel/:id
  it("Should get travel by id", async () => {
    const response = await request(app).get(travelUrl + "/" + newTravel._id);
    expect(response.status).toBe(200); // check status code
    expect(response.body.name).toBe(newTravel.name); // check response name is correct
    expect(response.body.description).toBe(newTravel.description); // check response description is correct
    expect(response.body.category).toBe(newTravel.category); // check response category is correct
    newTravel._id = response.body._id; // set _id to newTravel
  });
});

// Test update travel
// PUT /api/travel/:id
describe("Test updateTravel, check if admin could maintained travel data and non-admin can not.", () => {
  // Test for updateTravel
  // PUT /api/travel/:id
  it("Should correctly update travel if user is admin", async () => {
    const response = await request(app)
      .put(travelUrl + "/" + newTravel._id)
      .set("Authorization", "Bearer " + adminToken)
      .send({
        ...newTravel,
        name: "Updated Travel",
        description: "Updated Description",
        category: "Updated Category",
      });
    expect(response.status).toBe(200); // check status code
    expect(response.body.name).toBe("Updated Travel"); // check response name is correct
    expect(response.body.description).toBe("Updated Description"); // check response description is correct
    expect(response.body.category).toBe("travel"); // check response category is not changed
  });

  it("Should not allows non-admin users to update travel", async () => {
    const response = await request(app)
      .put(travelUrl + "/" + newTravel._id)
      .send({
        ...newTravel,
        name: "Updated Travel",
        description: "Updated Description",
        category: "Updated Category",
      });
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  });

  it("Should return 404 if travel not found", async () => {
    const response = await request(app)
      .put(travelUrl + "/" + "5e9f8f8f8f8f8f8f8f8f8f")
      .set("Authorization", "Bearer " + adminToken)
      .send({
        name: "Updated Travel",
        description: "Updated Description",
        category: "Updated Category",
      });
    expect(response.status).toBe(500); // check status code
  });
});

// Test delete travel
// DELETE /api/travel/:id
describe("Test deleteTravel, check if admin could correctly delete travel, and non-admin can not.", () => {
  // Test for deleteTravel
  // DELETE /api/travel/:id
  it("Should correctly delete travel if user is admin", async () => {
    const response = await request(app)
      .delete(travelUrl + "/" + newTravel._id)
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(200); // check status code
    let deletedTravel = await Travel.findById(newTravel._id);
    expect(deletedTravel).toBeFalsy(); // make sure travel is deleted
  });

  it("Should not allowed non-admin users to delete travel", async () => {
    const response = await request(app).delete(travelUrl + "/" + newTravel._id);
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  });
});

const userUrl = "/api/users";

describe("Test registerUser, Check if the user could create their account", () => {
  // Test for registerUser
  // POST /api/users
  it("Should register new user and the account data is same with putin", async () => {
    const response = await request(app).post(userUrl).send(newUser);
    expect(response.status).toBe(201); // check status code
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.name).toBe(newUser.name); // check response name is correct
    expect(response.body.email).toBe(newUser.email); // check response email is correct
    expect(response.body.token).toBeDefined(); // check response token is defined
    newUser._id = response.body._id; // set _id to newUser
    newUser.token = response.body.token; // save token to newUser
  });

  it("should return a 400 error if the user already exists", async () => {
    const response = await request(app).post(userUrl).send(newUser);
    expect(response.status).toBe(400); // check status code
    expect(response.body.message).toBe(
      "User already exists,please check your email address"
    ); // check response message
  });
});

// Test login method
// POST /api/users/login
describe("Test authUser, check if the user could login with email and password", () => {
  it("Should login normally, when the email and password are valid", async () => {
    const response = await request(app)
      .post(userUrl + "/login")
      .send({ email: newUser.email, password: newUser.password });
    expect(response.status).toBe(200); // check status code
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.name).toBe(newUser.name); // check response name is correct
    expect(response.body.email).toBe(newUser.email); // check response email is correct
    expect(response.body.token).toBeDefined(); // check response token is
    newUser._id = response.body._id; // set _id to newUser
    newUser.token = response.body.token; // save token to newUser
  });

  it("Should return a 400 error if the user put wrong password", async () => {
    const response = await request(app)
      .post(userUrl + "/login")
      .send({ email: newUser.email, password: "" });
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Invalid email or password"); // check response message
  });

  it("Should return a 400 error if user put wrong email", async () => {
    const response = await request(app)
      .post(userUrl + "/login")
      .send({ email: "", password: newUser.password });
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Invalid email or password"); // check response message
  });
});

// Test Get user profile when Logged in
// GET /api/users/profile (with token)
describe("Test getUserProfile, check if the logged-in user could get their profile", () => {
  it("Should return a user profile, when login(with token)", async () => {
    const response = await request(app)
      .get(userUrl + "/profile")
      .set("Authorization", `Bearer ${newUser.token}`);
    expect(response.status).toBe(200); // check status code
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.name).toBe(newUser.name); // check response name is correct
    expect(response.body.email).toBe(newUser.email); // check response email is correct
    newUser._id = response.body._id; // set _id to newUser
  });

  it("Should return a 401 error if the user is not logged in", async () => {
    const response = await request(app).get(userUrl + "/profile");
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  });
});

// test Update user profile when logged in
// PUT /api/users/profile (with token)
describe("Test updateUserProfile, when user is logged in", () => {
  it("Should update a user profile when logged in(with token)", async () => {
    const response = await request(app)
      .put(userUrl + "/profile")
      .set("Authorization", `Bearer ${newUser.token}`)
      .send({ name: "new name" });
    expect(response.status).toBe(200); // check status code
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.name).toBe("new name"); // check response name is correct
    expect(response.body.email).toBe(newUser.email); // check response email is correct
    expect(response.body.token).toBeDefined(); // check response token is defined
    newUser._id = response.body._id; // set _id to newUser
    newUser.token = response.body.token; // save token to newUser
  });

  it("Should return a 401 error if the user is not logged in", async () => {
    const response = await request(app)
      .put(userUrl + "/profile")
      .send({ name: "new name" });
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  });
});

// Test Get user by id
// GET /api/users/:id
describe("Test getUserById, check if the Admin could get user's profile by use id", () => {
  it("Should return a user profile, when login admin acount (admin token)", async () => {
    const response = await request(app)
      .get(userUrl + "/" + newUser._id)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(200); // check status code
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.email).toBe(newUser.email); // check response email is correct
  });

  it("Should return a 401 error if the user is not logged in", async () => {
    const response = await request(app).get(userUrl + "/" + newUser._id);
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  });

  it("Should return a 401 error if the user is not admin", async () => {
    const response = await request(app)
      .get(userUrl + "/" + newUser._id)
      .set("Authorization", `Bearer ${newUser.token}`);
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized as an admin"); // check response message
  });

  it("Should return a 404 error if the user is not found", async () => {
    const response = await request(app)
      .get(userUrl + "/" + "62e1cf22d3b326caf90071fe")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(404); // check status code
    expect(response.body.message).toBe("User not found"); // check response message
  });

  it("Should return a 500 error if the user id is not valid", async () => {
    const response = await request(app)
      .get(userUrl + "/" + "78787878sfsfsfsfs")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(500); // check status code
  });
});

// Test Update select user profile
// PUT /api/users/:id
describe("Test updateSelectUser, Only admin is allowed to update user by select(use user id)", () => {
  it("Should update a user select, when logged in is admin", async () => {
    const response = await request(app)
      .put(userUrl + "/" + newUser._id)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "ID user" });
    expect(response.status).toBe(200); // check status code
    let updatedUser = await User.findById(newUser._id);
    expect(updatedUser.name).toBe("ID user"); // check name is updated or not
  });

  it("Should not allowed update a user select, when logged in is not admin", async () => {
    const response = await request(app)
      .put(userUrl + "/" + newUser._id)
      .set("Authorization", `Bearer ${newUser.token}`)
      .send({ name: "ID user" });
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized as an admin"); // check response message
  });

  it("Should not allowed update a selected user profile, when user not logged in", async () => {
    const response = await request(app)
      .put(userUrl + "/" + newUser._id)
      .send({ name: "ID user" });
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  });

  it("Should return a 404 error if the user is not found", async () => {
    const response = await request(app)
      .put(userUrl + "/" + "62e1cf22d3b326caf90071fe")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "ID user" });
    expect(response.status).toBe(404); // check status code
    expect(response.body.message).toBe("User not found"); // check response message
  });

  it("Should return a 500 error if the user id is not valid", async () => {
    const response = await request(app)
      .put(userUrl + "/" + "78787878sfsfsfsfs")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "ID user" });
    expect(response.status).toBe(500); // check status code
  });
});

// test Delete user profile when logged in
// DELETE /api/users/profile (with token)
describe("Test deleteUser, Only admin is allowed to delete user account", () => {
  it("Should not allowed delete a user, when user not logged in", async () => {
    const response = await request(app).delete(userUrl + "/" + newUser._id);
    expect(response.status).toBe(401); // check status code
    let deletedUser = await User.findById(newUser._id);
    expect(deletedUser).not.toBeNull(); // check if user is still in the database
  });

  it("Should not allowed delete a user, when logged in is not admin", async () => {
    const response = await request(app)
      .delete(userUrl + "/" + newUser._id)
      .set("Authorization", `Bearer ${newUser.token}`);
    expect(response.status).toBe(401); // check status code
    let deletedUser = await User.findById(newUser._id);
    expect(deletedUser).not.toBeNull(); // check if user is still in the database
  });

  it("Should delete a user, when logged in is admin", async () => {
    const response = await request(app)
      .delete(userUrl + "/" + newUser._id)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(200); // check status code
    let deletedUser = await User.findById(newUser._id);
    expect(deletedUser).toBeNull(); // check if user is deleted
  });
});

const villaUrl = "/api/villa";

// Test All user could get the villalist
describe("Test getVillaList, check if server could return correct villa list data.", () => {
  // Test for getVillaList
  // GET /api/villa
  it("Should get villa list if keyword is empty.(list all villa)", async () => {
    const response = await request(app).get(villaUrl);
    expect(response.status).toBe(200); // check status code
    expect(response.body).not.toBeNull(); // check if have villa list return
  });

  it("Should get villa list by typein keyword (search function)", async () => {
    const response = await request(app).get(villaUrl).send({ keyword: "a" });
    expect(response.status).toBe(200); // check status code
    expect(response.body).not.toBeNull(); // check if have villa list return
  });
});

// test Create villa
// POST /api/villa
// Need to be admin
describe("Test createVilla, check if admin could create new villa, and non-admin can not.", () => {
  // Test for createVilla
  // POST /api/villa
  it("Should create a new villa and check each element is correct, if user is admin", async () => {
    const response = await request(app)
      .post(villaUrl)
      .set("Authorization", "Bearer " + adminToken)
      .send(newVilla);
    expect(response.status).toBe(201); // check status code
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.name).toBe(newVilla.name); // check response name is correct
    expect(response.body.description).toBe(newVilla.description); // check response description is correct
    expect(response.body.category).toBe(newVilla.category); // check response category is correct
    newVilla._id = response.body._id; // set _id to newVilla
  });

  it("Should not allows non-admin users to create villa", async () => {
    const response = await request(app).post(villaUrl).send(newVilla);
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  });
});

// Test Fetch single villa by id
// GET /api/villa/:id
describe("Test getVillaById, check if the server could return correct single villa data", () => {
  // Test for getVillaById
  // GET /api/villa/:id
  it("Should get villa by id", async () => {
    const response = await request(app).get(villaUrl + "/" + newVilla._id);
    expect(response.status).toBe(200); // check status code
    expect(response.body.name).toBe(newVilla.name); // check response name is correct
    expect(response.body.description).toBe(newVilla.description); // check response description is correct
    expect(response.body.category).toBe(newVilla.category); // check response category is correct
    newVilla._id = response.body._id; // set _id to newVilla
  });
});

// Test update villa
// PUT /api/villa/:id
describe("Test updateVilla, check if admin could maintained villa data and non-admin can not.", () => {
  // Test for updateVilla
  // PUT /api/villa/:id
  it("Should correctly update villa if user is admin", async () => {
    const response = await request(app)
      .put(villaUrl + "/" + newVilla._id)
      .set("Authorization", "Bearer " + adminToken)
      .send({
        ...newVilla,
        name: "Updated Villa",
        description: "Updated Description",
        category: "Updated Category",
      });
    expect(response.status).toBe(200); // check status code
    expect(response.body.name).toBe("Updated Villa"); // check response name is correct
    expect(response.body.description).toBe("Updated Description"); // check response description is correct
    expect(response.body.category).toBe("villa"); // check response category is not changed
  });

  it("Should not allows non-admin users to update villa", async () => {
    const response = await request(app)
      .put(villaUrl + "/" + newVilla._id)
      .send({
        ...newVilla,
        name: "Updated Villa",
        description: "Updated Description",
        category: "Updated Category",
      });
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  });

  it("Should return 404 if villa not found", async () => {
    const response = await request(app)
      .put(villaUrl + "/" + "5e9f8f8f8f8f8f8f8f8f8f")
      .set("Authorization", "Bearer " + adminToken)
      .send({
        name: "Updated Villa",
        description: "Updated Description",
        category: "Updated Category",
      });
    expect(response.status).toBe(500); // check status code
  });
});

// Test delete villa
// DELETE /api/villa/:id
describe("Test deleteVilla, check if admin could correctly delete villa, and non-admin can not.", () => {
  // Test for deleteVilla
  // DELETE /api/villa/:id
  it("Should correctly delete villa if user is admin", async () => {
    const response = await request(app)
      .delete(villaUrl + "/" + newVilla._id)
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(200); // check status code
    let deletedVilla = await Villa.findById(newVilla._id);
    expect(deletedVilla).toBeFalsy(); // make sure villa is deleted
  });

  it("Should not allowed non-admin users to delete villa", async () => {
    const response = await request(app).delete(villaUrl + "/" + newVilla._id);
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  });
});
