export default async function handler(req, res) {
  const allowedOrigins = [
    "https://jardins156.com.br",
    "https://www.jardins156.com.br",
    "https://mipconstrutora.com.br",
    "https://www.mipconstrutora.com.br",
    "http://127.0.0.1:5500", // desenvolvimento local
    "http://localhost:5500", // alternativa comum
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, token");

  if (req.method === "OPTIONS") {
    // Responde à requisição preflight
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Somente POST permitido" });
  }

  try {
    const response = await fetch("https://mip.cvcrm.com.br/api/cvio/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        token: process.env.CVCRM_TOKEN,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao enviar para CVCRM", detalhes: error.message });
  }
}
