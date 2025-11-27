import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../db/aws-connect.js";

export default class MaterialController {
  static async gerarUrlLeitura(req, res) {
    // O Frontend envia o nome do arquivo (Key) que quer acessar
    // Ex: "173229999-aula1.pdf"
    const { nomeArquivo } = req.body;
    const bucketName = process.env.BUCKET_NAME;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: nomeArquivo,
    });

    try {
      // Gera uma URL válida por 1 hora (3600 segundos)
      // O aluno tem esse tempo para começar o download
      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });

      return res.status(200).json({ url: signedUrl });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao gerar link de acesso" });
    }
  }
}
