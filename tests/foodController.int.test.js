import request from "supertest";
import app from "../server.js";
import newFood from "./mock-data/new-food.json";
import Food from "../models/products/foodModel.js";
import adminUser from "./mock-data/admin-user.json";
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
