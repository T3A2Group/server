import bcrypt from "bcryptjs"; //=> for user password bcrypt

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Lance",
    email: "lance@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "test",
    email: "test@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
