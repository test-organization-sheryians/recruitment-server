import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv'

dotenv.config()
const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const putObject = async (req, res) => {
  try {
    const { fileName, contentType } = req.body;
    console.log("this is req.body from putObject", req.body);
    console.log(fileName, contentType);
    if (!fileName || !contentType) {
      throw new Error("Please provide the fileName and contentType ");
    }
    const command = new PutObjectCommand({
      Bucket: "sherihunt",
      Key: `uploads/${fileName}`,
      ContentType: contentType,
    });
    const getUrl = await getSignedUrl(s3Client, command);
    res.status(200).json(getUrl);
  } catch (error) {
    res.status(500).json(error?.message);
    console.log(error);
  }
};