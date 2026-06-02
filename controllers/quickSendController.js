const fs = require("fs");
const { prisma } = require("../prismaClient");
const supabase = require("../lib/supabaseClient");
const QRCode = require("qrcode");


const createQuickSend = async (req, res) => {
  try {

    // 1️⃣ Get file
    const file = req.file;

    const fileStream = fs.readFileSync(file.path);

    // 2️⃣ Unique filename
    const uniqueFileName =
      Date.now() + "-" + file.originalname;

    // 3️⃣ Upload to Supabase
    const { data, error } = await supabase.storage
      .from("files")
      .upload(uniqueFileName, fileStream, {
        contentType: file.mimetype
      });

    if (error) {
      console.error(error);
      return res.send("Error uploading to Supabase");
    }
    fs.unlinkSync(file.path);

    // 4️⃣ Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("files")
      .getPublicUrl(uniqueFileName);

    const publicUrl = publicUrlData.publicUrl;

    // 5️⃣ Generate code
    const code = Math.floor(
      100000 + Math.random() * 900000
    ).toString();


    // 6️⃣ Expiry
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // 7️⃣ Save in Prisma
    await prisma.quickSend.create({
      data: {
        code,
        fileUrl: publicUrl,
        fileName: file.originalname,
        mimeType: file.mimetype,
        expiresAt
      }
    });

    // generate QR

    const baseUrl =
  process.env.BASE_URL || "http://localhost:3000";

const qrUrl =
  `${baseUrl}/quick-send/${code}`;
    const qrCode = await QRCode.toDataURL(qrUrl);

    // 8️⃣ Render success page
    res.render("quickSendSuccess", {
      code,
      qrCode
    });

  } catch (error) {
    console.error(error);
    res.send("Error creating quick send");
  }
};



const accessQuickSend = async (req,res) => {
  try {
    const { code } = req.params;

    const quickSend = await prisma.quickSend.findUnique({
      where: { code }
    });

    if (!quickSend) {
      return res.send("Invalid code");
    }

    if (new Date() > quickSend.expiresAt) {
      await prisma.quickSend.delete({
        where: { code }
      });
      return res.send("Link expired");
    }

    // res.redirect(quickSend.fileUrl);
    res.render("quickSendFile", {
      quickSend
    });

  } catch (error) {
    console.error(error);
    res.send("Error accessing quick send");
  }
}

module.exports = { createQuickSend,accessQuickSend };