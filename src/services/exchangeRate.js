// APIs para conversão WEMIX -> USDT -> BRL
const GATEIO_API = 'https://api.gateio.ws/api/v4/spot/tickers?currency_pair=WEMIX_USDT';
const AWESOME_API = 'https://economia.awesomeapi.com.br/json/last/USD-BRL';

// Taxa de fallback (última taxa conhecida)
const FALLBACK_RATE = 2.10;

export const fetchWemixToBRL = async () => {
  try {
    // Passo 1: Buscar preço de WEMIX em USDT
    const wemixResponse = await fetch(GATEIO_API, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!wemixResponse.ok) {
      console.warn(`Gate.io retornou status ${wemixResponse.status}: ${wemixResponse.statusText}`);
      console.log('Usando taxa de fallback:', FALLBACK_RATE);
      return FALLBACK_RATE;
    }
    
    const wemixData = await wemixResponse.json();
    console.log('Resposta Gate.io (WEMIX/USDT):', wemixData);
    
    if (!wemixData || !Array.isArray(wemixData) || wemixData.length === 0) {
      console.warn('Gate.io retornou dados inválidos');
      console.log('Usando taxa de fallback:', FALLBACK_RATE);
      return FALLBACK_RATE;
    }
    
    const wemixPriceInUSDT = parseFloat(wemixData[0].last);
    if (!wemixPriceInUSDT || isNaN(wemixPriceInUSDT)) {
      console.warn('Não foi possível obter o preço de WEMIX em USDT');
      console.log('Usando taxa de fallback:', FALLBACK_RATE);
      return FALLBACK_RATE;
    }
    
    console.log('Preço WEMIX em USDT:', wemixPriceInUSDT);
    
    // Passo 2: Buscar taxa de conversão USD para BRL
    const usdResponse = await fetch(AWESOME_API, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!usdResponse.ok) {
      console.warn(`AwesomeAPI retornou status ${usdResponse.status}: ${usdResponse.statusText}`);
      console.log('Usando taxa de fallback:', FALLBACK_RATE);
      return FALLBACK_RATE;
    }
    
    const usdData = await usdResponse.json();
    console.log('Resposta AwesomeAPI (USD/BRL):', usdData);
    
    if (!usdData || !usdData.USDBRL) {
      console.warn('AwesomeAPI retornou dados inválidos');
      console.log('Usando taxa de fallback:', FALLBACK_RATE);
      return FALLBACK_RATE;
    }
    
    const usdToBRL = parseFloat(usdData.USDBRL.bid || usdData.USDBRL.ask);
    if (!usdToBRL || isNaN(usdToBRL)) {
      console.warn('Não foi possível obter a taxa USD/BRL');
      console.log('Usando taxa de fallback:', FALLBACK_RATE);
      return FALLBACK_RATE;
    }
    
    console.log('Taxa USD/BRL:', usdToBRL);
    
    // Passo 3: Calcular WEMIX em BRL (WEMIX/USDT * USD/BRL)
    const wemixToBRL = wemixPriceInUSDT * usdToBRL;
    console.log('Taxa final WEMIX/BRL:', wemixToBRL);
    
    return wemixToBRL;
    
  } catch (error) {
    console.error('Erro ao buscar taxa de câmbio WEMIX/BRL:', error);
    console.log('Usando taxa de fallback devido ao erro:', FALLBACK_RATE);
    return FALLBACK_RATE;
  }
};



