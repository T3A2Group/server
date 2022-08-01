import  { registerUser } from "../../controllers/userControllers.js"

describe('registerUser', () => {
  it("Should have a registerUser function", () => {
    expect(typeof registerUser).toBe('function')
  })
})