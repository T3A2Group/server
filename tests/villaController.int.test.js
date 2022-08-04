import request from "supertest";
import app from "../server.js";
import newVilla from "./mock-data/new-villa.json";
import Villa from "../models/products/villaModel.js";
import adminUser from "./mock-data/admin-user.json";
import generateToken from "../utils/generateToken.js";

const adminToken = generateToken(adminUser._id);

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
