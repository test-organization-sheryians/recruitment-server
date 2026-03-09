import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv'

dotenv.config()
export const AWS_REGION = "ap-south-1";
export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || "sherihunt";

export const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const getPublicS3Url = (key) =>
  `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;

export const putObject = async (req, res) => {
  try {
    const { fileName, contentType } = req.body;
    console.log("this is req.body from putObject", req.body);
    console.log(fileName, contentType);
    if (!fileName || !contentType) {
      throw new Error("Please provide the fileName and contentType ");
    }
    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
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
