const { prisma } = require("../prismaClient");
const { v4: uuidv4 } = require("uuid");

const createShareLink = async (req, res) => {
  const { folderId } = req.params;

  try {
    // 1️⃣ Check folder ownership
    const folder = await prisma.folder.findUnique({
      where: { id: Number(folderId) }
    });

    if (!folder || folder.userId !== req.user.id) {
      return res.send("Unauthorized");
    }

    // 2️⃣ Generate UUID
    const uuid = uuidv4();

    // 3️⃣ Set expiry (example: 1 day)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    // 4️⃣ Save in DB
    await prisma.shareLink.create({
      data: {
        uuid,
        expiresAt,
        folderId: Number(folderId)
      }
    });

    // 5️⃣ Send link
    const baseUrl =
      process.env.BASE_URL || "http://localhost:3000";

    const link =
      `${baseUrl}/share/${uuid}`;

      res.render("shareSuccess", {
        link,
        expiresAt,
      });

  } catch (error) {
    console.error(error);
    res.send("Error creating share link");
  }
};

const viewSharedFolder = async (req, res) => {
  const { uuid } = req.params;

  try {
    const share = await prisma.shareLink.findUnique({
      where: { uuid },
      include: {
        folder: {
          include: {
            files: true
          }
        }
      }
    });

    // 1️⃣ Check exists
    if (!share) {
      return res.send("Invalid link");
    }

    // 2️⃣ Check expiry
    if (new Date() > share.expiresAt) {
      return res.send("Link expired");
    }

    // 3️⃣ Render view
    res.render("sharedFolder", {
      folder: share.folder
    });

  } catch (error) {
    console.error(error);
    res.send("Error accessing shared folder");
  }
};

module.exports = { createShareLink, viewSharedFolder };