const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const {prisma} = require("../prismaClient");

const sessionMiddleware = session({
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  },
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new PrismaSessionStore(
    prisma,
    {
      checkPeriod: 2 * 60 * 1000, // remove expired sessions every 2 minutes
      dbRecordIdIsSessionId: true
    }
  )
});

module.exports = sessionMiddleware;