import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../db/aws-connect.js";

// Configuração do Cliente S3

export default class UploadController {
  static async gerarUrlUpload(req, res) {
    const { nomeArquivo, tipoArquivo } = req.body; // Ex: "aula.pdf", "application/pdf"
    const bucketName = process.env.BUCKET_NAME;

    // Cria um nome único para não sobrescrever arquivos (ex: timestamp-nome)
    const key = `${Date.now()}-${nomeArquivo}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: tipoArquivo,
    });

    try {
      // Gera uma URL válida por 60 segundos apenas para upload
      const uploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 60,
      });

      // Esta é a URL final que ficará salva no banco depois
      const publicUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;

      return res.status(200).json({ uploadUrl, publicUrl });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao gerar URL" });
    }
  }

  static async handleFileUpload(file) {
    // 1. Pedir a URL assinada para o seu backend
    const response = await fetch("professor/materiais-upload", {
      method: "POST",
      body: JSON.stringify({
        nomeArquivo: file.name,
        tipoArquivo: file.type,
      }),
    });
    const { uploadUrl, publicUrl } = await response.json();

    // 2. Enviar o arquivo DIRETO para o S3 (usando a URL assinada)
    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    // 3. Se deu certo, agora salvamos o link no MySQL
    // Aqui você chama sua rota de criar Material (que usa o Sequelize)
    //await criarMaterialNoBanco({
    // titulo: "Aula 1",
    // arquivo_url: publicUrl, // <--- Salvando a URL no banco
    //});
  }
}
