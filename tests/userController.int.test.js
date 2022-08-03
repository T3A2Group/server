import {   
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUserById,} from "../controllers/userControllers";
import request from "supertest";
import app from "../server.js";
import newUser from "./mock-data/new-user.json";
import User from "../models/userModel.js";
import adminUser from "./mock-data/admin-user.json";
import generateToken from "../utils/generateToken.js";

const adminToken = generateToken(adminUser._id);

const userUrl = "/api/users";

describe("Test registerUser, Check if the user could create their account", () => {
  // Test for registerUser
  // POST /api/users
  it("Should register new user and the account data is same with putin", async () => {
    const response = await request(app)
      .post(userUrl)
      .send(newUser);
    expect(response.status).toBe(201);  // check status code
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.name).toBe(newUser.name);  // check response name is correct
    expect(response.body.email).toBe(newUser.email);  // check response email is correct
    expect(response.body.token).toBeDefined();  // check response token is defined
    newUser._id =response.body._id; // set _id to newUser
    newUser.token = response.body.token; // save token to newUser
  })

  it("should return a 400 error if the user already exists", async () => {
    const response = await request(app)
      .post(userUrl)
      .send(newUser);
    expect(response.status).toBe(400); // check status code 
    expect(response.body.message).toBe("User already exists,please check your email address"); // check response message
  })
})

// Test login method
// POST /api/users/login
describe("Test authUser, check if the user could login with email and password", () => {
  it("Should login normally, when the email and password are valid", async () => {
    const response = await request(app)
      .post(userUrl + "/login")
      .send({ email: newUser.email, password: newUser.password });
    expect(response.status).toBe(200); // check status code 
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.name).toBe(newUser.name);  // check response name is correct
    expect(response.body.email).toBe(newUser.email);  // check response email is correct
    expect(response.body.token).toBeDefined();  // check response token is 
    newUser._id =response.body._id; // set _id to newUser
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
})

// Test Get user profile when Logged in
// GET /api/users/profile (with token)
describe("Test getUserProfile, check if the logged-in user could get their profile", () => {
  it("Should return a user profile, when login(with token)", async () => {
    const response = await request(app)
      .get(userUrl + "/profile")
      .set("Authorization", `Bearer ${newUser.token}`);
    expect(response.status).toBe(200); // check status code 
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.name).toBe(newUser.name);  // check response name is correct
    expect(response.body.email).toBe(newUser.email);  // check response email is correct
    newUser._id =response.body._id; // set _id to newUser
  }); 

  it("Should return a 401 error if the user is not logged in", async () => {
    const response = await request(app)
      .get(userUrl + "/profile");
    expect(response.status).toBe(401); // check status code 
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  }); 
})

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
    expect(response.body.name).toBe("new name");  // check response name is correct
    expect(response.body.email).toBe(newUser.email);  // check response email is correct
    expect(response.body.token).toBeDefined();  // check response token is defined
    newUser._id =response.body._id; // set _id to newUser
    newUser.token = response.body.token; // save token to newUser
  }); 

  it("Should return a 401 error if the user is not logged in", async () => {
    const response = await request(app)
      .put(userUrl + "/profile")
      .send({ name: "new name" });
    expect(response.status).toBe(401); // check status code 
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  }); 
})

// Test Get user by id
// GET /api/users/:id
describe("Test getUserById, check if the Admin could get user's profile by use id", () => {
  it("Should return a user profile, when login admin acount (admin token)", async () => {
    const response = await request(app)
      .get(userUrl + "/" + newUser._id)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(200); // check status code 
    expect(response.body).toHaveProperty("_id"); // check if response has _id
    expect(response.body.email).toBe(newUser.email);  // check response email is correct
  })

  it("Should return a 401 error if the user is not logged in", async () => {
    const response = await request(app)
      .get(userUrl + "/" + newUser._id);
    expect(response.status).toBe(401); // check status code 
    expect(response.body.message).toBe("Not authorized, no token"); // check response message
  })

  it("Should return a 401 error if the user is not admin", async () => {
    const response = await request(app)
      .get(userUrl + "/" + newUser._id)
      .set("Authorization", `Bearer ${newUser.token}`);
    expect(response.status).toBe(401); // check status code 
    expect(response.body.message).toBe("Not authorized as an admin"); // check response message
  })

  it("Should return a 404 error if the user is not found", async () => {
    const response = await request(app)
      .get(userUrl + "/" + "62e1cf22d3b326caf90071fe")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(404); // check status code 
    expect(response.body.message).toBe("User not found"); // check response message
  })

  it("Should return a 500 error if the user id is not valid", async () => {
    const response = await request(app)
      .get(userUrl + "/" + "78787878sfsfsfsfs")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(500); // check status code 
  })
})



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
  })
  
  it("Should not allowed update a user select, when logged in is not admin", async () => {
    const response = await request(app)
    .put(userUrl + "/" + newUser._id)
    .set("Authorization", `Bearer ${newUser.token}`)
    .send({ name: "ID user" });
    expect(response.status).toBe(401); // check status code
    expect(response.body.message).toBe("Not authorized as an admin"); // check response message
  })
  
    it("Should not allowed update a selected user profile, when user not logged in", async () => {
      const response = await request(app)
        .put(userUrl + "/" + newUser._id)
        .send({ name: "ID user" });
      expect(response.status).toBe(401); // check status code
      expect(response.body.message).toBe("Not authorized, no token"); // check response message
    })
  

  it("Should return a 404 error if the user is not found", async () => {
    const response = await request(app)
      .put(userUrl + "/" + "62e1cf22d3b326caf90071fe")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "ID user" });
    expect(response.status).toBe(404); // check status code
    expect(response.body.message).toBe("User not found"); // check response message
  })

  it("Should return a 500 error if the user id is not valid", async () => {
    const response = await request(app)
      .put(userUrl + "/" + "78787878sfsfsfsfs")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "ID user" });
    expect(response.status).toBe(500); // check status code
  })
})

// test Delete user profile when logged in
// DELETE /api/users/profile (with token)
describe("Test deleteUser, Only admin is allowed to delete user account", () => { 
  it("Should not allowed delete a user, when user not logged in", async () => {
    const response = await request(app)
    .delete(userUrl + "/" + newUser._id)
    expect(response.status).toBe(401); // check status code
    let deletedUser = await User.findById(newUser._id);
    expect(deletedUser).not.toBeNull(); // check if user is still in the database
  })

  it("Should not allowed delete a user, when logged in is not admin", async () => {
    const response = await request(app)
      .delete(userUrl + "/" + newUser._id)
      .set("Authorization", `Bearer ${newUser.token}`);
    expect(response.status).toBe(401); // check status code
    let deletedUser = await User.findById(newUser._id);
    expect(deletedUser).not.toBeNull(); // check if user is still in the database
  })

  it("Should delete a user, when logged in is admin", async () => {
    const response = await request(app)
      .delete(userUrl + "/" + newUser._id)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(200); // check status code
    let deletedUser = await User.findById(newUser._id);
    expect(deletedUser).toBeNull(); // check if user is deleted
  })
})
