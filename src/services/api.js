const API_BASE_URL = 'https://mir4-market-backend-production.up.railway.app';

export const fetchNFTs = async (params = {}) => {
  const queryParams = new URLSearchParams({
    limit: '32',
    ...params,
  });

  const response = await fetch(`${API_BASE_URL}/nfts/?${queryParams}`);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar NFTs: ${response.statusText}`);
  }
  
  return response.json();
};

