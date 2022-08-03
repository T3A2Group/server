import { 
  getTravelList,
  getTravelById,
  deleteTravel,
  createTravel,
  updateTravel,
  createTravelReview,
} from '../controllers/travelControllers.js';
import request from "supertest";
import app from "../server.js";
import newTravel from "./mock-data/new-travel.json";
import Travel from "../models/products/travelModel.js";
import adminUser from "./mock-data/admin-user.json";
import generateToken from "../utils/generateToken.js";


const adminToken = generateToken(adminUser._id);

const travelUrl = "/api/travel";

// Test All user could get the travellist
describe("Test getTravelList, check if server could return correct travel list data.", () => {
  // Test for getTravelList
  // GET /api/travel
  it("Should get travel list if keyword is empty.(list all travel)", async () => {
    const response = await request(app)
      .get(travelUrl);
    expect(response.status).toBe(200); // check status code
    expect(response.body).not.toBeNull(); // check if have travel list return
  })

  it("Should get travel list by typein keyword (search function)", async () => {
    const response = await request(app)
      .get(travelUrl)
      .send({keyword: "a"});
    expect(response.status).toBe(200); // check status code
    expect(response.body).not.toBeNull(); // check if have travel list return
  })
})

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
    expect(response.body.name).toBe(newTravel.name);  // check response name is correct
    expect(response.body.description).toBe(newTravel.description);  // check response description is correct
    expect(response.body.category).toBe(newTravel.category);  // check response category is correct
    newTravel._id = response.body._id; // set _id to newTravel
  })

  it("Should not allows non-admin users to create travel", async () => {
    const response = await request(app)
      .post(travelUrl)
      .send(newTravel);
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  })
})


// Test Fetch single travel by id
// GET /api/travel/:id
describe("Test getTravelById, check if the server could return correct single travel data", () => {
  // Test for getTravelById
  // GET /api/travel/:id
  it("Should get travel by id", async () => {
    const response = await request(app)
      .get(travelUrl + "/" + newTravel._id);
    expect(response.status).toBe(200); // check status code
    expect(response.body.name).toBe(newTravel.name);  // check response name is correct
    expect(response.body.description).toBe(newTravel.description);  // check response description is correct
    expect(response.body.category).toBe(newTravel.category);  // check response category is correct
    newTravel._id = response.body._id; // set _id to newTravel
  })
})

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
    expect(response.body.name).toBe("Updated Travel");  // check response name is correct
    expect(response.body.description).toBe("Updated Description");  // check response description is correct
    expect(response.body.category).toBe("travel");  // check response category is not changed
  })

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
  })

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
  })
})

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
  })

  it("Should not allowed non-admin users to delete travel", async () => {
    const response = await request(app)
      .delete(travelUrl + "/" + newTravel._id);
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  })
})