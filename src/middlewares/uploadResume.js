import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const resumeStorage = new cloudinaryStorage({
  cloudinary,
  params: {
    folder: "candidate-resume",
    resource_type: "auto",
    format: async (req, res) => "pdf",
    public_id: (req, res) => {
      `${Date.now()}_${File.originalname.split(".")[0]}`;
    },
  },
});

const uploadResume = multer({ storage: resumeStorage });

export default uploadResume;
