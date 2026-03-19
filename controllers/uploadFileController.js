const {prisma} = require("../prismaClient");
const supabase = require("../lib/supabaseClient");
const fs = require("fs");

// const uploadFile = async (req, res) => {
//   const file = req.file;
//   const { folderId } = req.params;

//   try {
//     await prisma.file.create({
//       data: {
//         name: file.originalname,
//         size: file.size,
//         mimeType: file.mimetype,
//         url: file.path,
//         folderId: Number(folderId)
//       }
//     });

//     res.redirect(`/folders/${folderId}`);

//   } catch (error) {
//     console.error(error);
//     res.send("Error uploading file");
//   }
// };

const uploadFile = async (req, res) => {
    const file = req.file;
    const { folderId } = req.params;
  
    try {
      // 1️⃣ Upload to Supabase
      const fileStream = fs.readFileSync(file.path);
  
      const { data, error } = await supabase.storage
        .from("files")
        .upload(file.filename, fileStream, {
          contentType: file.mimetype
        });
  
      if (error) {
        console.error(error);
        return res.send("Error uploading to Supabase");
      }
  
      // 2️⃣ Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("files")
        .getPublicUrl(file.filename);
  
      const publicUrl = publicUrlData.publicUrl;
  
      // 3️⃣ Save in DB
      await prisma.file.create({
        data: {
          name: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          url: publicUrl,
          folderId: Number(folderId)
        }
      });
  
      // 4️⃣ Delete local file
      fs.unlinkSync(file.path);
  
      // 5️⃣ Redirect
      res.redirect(`/folders/${folderId}`);
  
    } catch (error) {
      console.error(error);
      res.send("Error uploading file");
    }
  };
  

// const downloadFile = async (req, res) => {
//     const { id } = req.params;
  
//     try {
//       const file = await prisma.file.findUnique({
//         where: { id: Number(id) },
//         include: {
//           folder: true
//         }
//       });
  
//       if (!file || file.folder.userId !== req.user.id) {
//         return res.send("Unauthorized or file not found");
//       }
  
//       res.download(file.url);
  
//     } catch (error) {
//       console.error(error);
//       res.send("Error downloading file");
//     }
//   };


 
// const deleteFile = async (req, res) => {
//     const { id } = req.params;
  
//     try {
//       // 1️ Find file first
//       const file = await prisma.file.findUnique({
//         where: { id: Number(id) },
//         include: {
//           folder: true
//         }
//       });
  
//       // 2️ Security check
//       if (!file || file.folder.userId !== req.user.id) {
//         return res.send("Unauthorized or file not found");
//       }
  
//       // 3️ Delete file from disk
//       fs.unlink(file.url, (err) => {
//         if (err) {
//           console.error("Error deleting file from disk:", err);
//         }
//       });
  
//       // 4️ Delete from DB
//       await prisma.file.delete({
//         where: { id: Number(id) }
//       });
  
//       // 5️ Redirect back to folder
//       res.redirect(`/folders/${file.folderId}`);
  
//     } catch (error) {
//       console.error(error);
//       res.send("Error deleting file");
//     }
//   };


const downloadFile = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await prisma.file.findUnique({
      where: { id: Number(id) },
      include: { folder: true }
    });

    if (!file || file.folder.userId !== req.user.id) {
      return res.send("Unauthorized");
    }

    res.redirect(file.url);

  } catch (err) {
    console.error(err);
    res.send("Error downloading file");
  }
};
  const deleteFile = async (req, res) => {
    const { id } = req.params;
  
    try {
      // 1️⃣ Find file
      const file = await prisma.file.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          folder: true
        }
      });
  
      // 2️⃣ Security check
      if (!file || file.folder.userId !== req.user.id) {
        return res.send("Unauthorized or file not found");
      }
  
      // 3️⃣ Extract filename from URL
      const filename = file.url.split("/").pop();
  
      // 4️⃣ Delete from Supabase
      await supabase.storage.from("files").remove([filename]);
  
      // 5️⃣ Delete from DB
      await prisma.file.delete({
        where: { id: Number(id) }
      });
  
      // 6️⃣ Redirect back to folder
      res.redirect(`/folders/${file.folderId}`);
  
    } catch (error) {
      console.error(error);
      res.send("Error deleting file");
    }
  };
module.exports = { uploadFile, downloadFile,deleteFile };