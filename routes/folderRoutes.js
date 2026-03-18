const { createFolder, getFolderById,showFolders, renameFolder, deleteFolder } = require("../controllers/folderController");
const { Router } = require("express");
const { isAuthenticated } = require("../middlewares/authMiddleware");

const folderRoutes = Router();

// Show folders (dashboard)
folderRoutes.get("/dashboard", isAuthenticated, showFolders);
folderRoutes.get("/folders/:id", isAuthenticated, getFolderById);

// Create folder
folderRoutes.post("/folders", isAuthenticated, createFolder);

// Rename folder
folderRoutes.post("/folders/rename", isAuthenticated, renameFolder);

// Delete folder
folderRoutes.post("/folders/delete", isAuthenticated, deleteFolder);

module.exports = folderRoutes;