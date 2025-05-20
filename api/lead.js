export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Somente POST permitido" });
  }

  try {
    const response = await fetch("https://mip.cvcrm.com.br/api/cvio/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        token: "72d919236350de7e54850a0cfa83096b573b0016",
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
