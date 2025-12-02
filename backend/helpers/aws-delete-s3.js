import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../db/aws-connect.js";

const deleteUrl = async (url) => {
  const bucket = process.env.BUCKET_NAME;
  const key = url.split(".com/")[1];

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await s3Client.send(command);
};

export default deleteUrl;
