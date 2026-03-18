const { body, validationResult } = require("express-validator");
const {prisma} = require("../prismaClient");

const folderValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Folder Name Cannot be Empty")
];

const createFolder = [
  ...folderValidation,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("dashboard", {
        errors: errors.array(),
        user: req.user
      });
    }

    const { name } = req.body;

    try {
      await prisma.folder.create({
        data: {
          name,
          userId: req.user.id
        }
      });

      res.redirect("/dashboard");
    } catch (error) {
      console.error(error);
      res.send("Error Creating Folder");
    }
  }
];

// SHOW FOLDERS
const showFolders = async (req, res) => {
  try {
    const folders = await prisma.folder.findMany({
      where: {
        userId: req.user.id
      }
    });

    res.render("dashboard", {
        errors:[],
      user: req.user,
      folders
    });
  } catch (error) {
    console.error(error);
    res.send("Error fetching folders");
  }
};

// DELETE FOLDER
const deleteFolder = async (req, res) => {
  const { id } = req.body;

  try {
    await prisma.folder.delete({
      where: {
        id: Number(id)
      }
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.send("Error deleting folder");
  }
};


const renameFolder = [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Folder name cannot be empty"),
  
    async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.redirect("/dashboard"); // keep simple for now
      }
  
      const { id, name } = req.body;
  
      try {
        await prisma.folder.updateMany({
          where: {
            id: Number(id),
            userId: req.user.id
          },
          data: {
            name
          }
        });
  
        res.redirect("/dashboard");
  
      } catch (error) {
        console.error(error);
        res.send("Error renaming folder");
      }
    }
  ];


  const getFolderById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const folder = await prisma.folder.findFirst({
        where: {
          id: Number(id),
          userId: req.user.id
        },
        include: {
          files: true
        }
      });
  
      if (!folder) {
        return res.send("Folder not found or unauthorized");
      }
  
      res.render("folder", {
        folder,
        user: req.user
      });
  
    } catch (error) {
      console.error(error);
      res.send("Error loading folder");
    }
  };

module.exports = { createFolder,getFolderById, showFolders,renameFolder, deleteFolder };