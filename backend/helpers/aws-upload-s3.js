import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../db/aws-connect.js";

// Configuração do Cliente S3

const gerarUrl = async (nomeArquivo, tipoArquivo) => {
  const bucket = process.env.BUCKET_NAME;

  const key = `${Date.now()}-${nomeArquivo}`;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: tipoArquivo,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 600,
  });

  const publicUrl = `https://${bucket}.s3.sa-east-1.amazonaws.com/${key}`;

  return { uploadUrl, publicUrl, key };
};

export default gerarUrl;
