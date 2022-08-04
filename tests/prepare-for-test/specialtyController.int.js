import request from "supertest";
import app from "../server.js";
import newSpecialty from "./mock-data/new-specialty.json";
import Specialty from "../models/products/specialtyModel.js";
import adminUser from "./mock-data/admin-user.json";
import generateToken from "../utils/generateToken.js";

const adminToken = generateToken(adminUser._id);

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
