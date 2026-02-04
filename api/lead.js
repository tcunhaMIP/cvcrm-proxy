/**
 * Handler de API para proxy de leads para o CV CRM
 * Recebe requisições de múltiplos sites autorizados e encaminha para a API do CV CRM
 * 
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} res - Objeto de resposta HTTP
 */
export default async function handler(req, res) {
  /**
   * Lista de origens (domínios) autorizadas a fazer chamadas para esta API
   * Inclui sites de produção e ambientes de desenvolvimento local
   */
  const allowedOrigins = [
    "https://jardins156.com.br",
    "https://www.jardins156.com.br",
    "https://mipconstrutora.com.br",
    "https://www.mipconstrutora.com.br",
    "https://janeiroengenharia.com.br",
    "https://www.janeiroengenharia.com.br",
    "http://127.0.0.1:5500",          // Desenvolvimento local (Live Server)
    "http://localhost:5500",
    "http://127.0.0.1:5173",          // Desenvolvimento local (Vite)
    "http://localhost:5173",
    "https://cad-digital.vercel.app",
    "https://carbonbyjaneiro.com.br",
    "https://www.carbonbyjaneiro.com.br",
    "https://oneviewluxemburgo.com.br",
    "https://www.oneviewluxemburgo.com.br",
  ];

  // Configuração de CORS (Cross-Origin Resource Sharing)
  const origin = req.headers.origin;
  
  // Permite acesso apenas se a origem estiver na lista autorizada
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  // Define métodos HTTP permitidos
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  
  // Define headers permitidos na requisição
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, token");

  /**
   * Responde a requisições OPTIONS (preflight do CORS)
   * Navegadores enviam OPTIONS antes da requisição real para verificar permissões
   */
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Aceita apenas requisições POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Somente POST permitido" });
  }

  try {
    let body = req.body;

    /**
     * Garante que o body seja um objeto JavaScript
     * Algumas plataformas enviam o body como string JSON
     */
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (err) {
        console.error("Body inválido recebido no proxy:", body);
        return res
          .status(400)
          .json({ error: "Body inválido (não é JSON válido)" });
      }
    }

    /**
     * Encaminha a requisição para a API do CV CRM
     * O token de autenticação é obtido de variável de ambiente (segurança)
     */
    const response = await fetch("https://mip.cvcrm.com.br/api/cvio/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        token: process.env.CVCRM_TOKEN, // Token armazenado na Vercel
      },
      body: JSON.stringify(body),
    });

    // Retorna a resposta do CV CRM para o cliente
    const data = await response.json();
    res.status(response.status).json(data);
    
  } catch (error) {
    // Tratamento de erros genéricos
    res
      .status(500)
      .json({ error: "Erro ao enviar para CVCRM", detalhes: error.message });
  }
}