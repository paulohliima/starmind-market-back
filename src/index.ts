import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const siteContent = fs.readFileSync('siteContent.txt', 'utf-8');

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: 'Message is required' });
  console.log('Pergunta recebida:', message);

  const prompt = `
    Você é um atendente virtual da marca StarMind. Responda às perguntas de forma curta, direta e simpática, como se estivesse conversando com alguém. Evite quebras de linha. Use apenas as informações abaixo. Se não souber, diga que não tem certeza.

    INFORMAÇÕES DO SITE:
    ${siteContent}

    PERGUNTA DO USUÁRIO:
    ${message}
`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-oss-20b:free',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const answer = response.data.choices?.[0].message?.content || 'Limite de tokens excedidos, renove a key';
    res.json({ response: answer });
  } catch (error: any) {
    console.error('Erro OpenRouter:', error.response?.data || error.message);
    res.status(500).json({ response: 'Erro ao comunicar com a IA.' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
