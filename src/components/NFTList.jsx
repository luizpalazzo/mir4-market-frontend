import React, { useState, useEffect } from 'react';
import { fetchNFTs } from '../services/api';
import { fetchWemixToBRL } from '../services/exchangeRate';
import NFTCard from './NFTCard';

const NFTList = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wemixToBRL, setWemixToBRL] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState('price');
  const [orderDirection, setOrderDirection] = useState('asc');
  const [statFilters, setStatFilters] = useState([]);
  const [showStatFilterModal, setShowStatFilterModal] = useState(false);
  const [tempStatFilters, setTempStatFilters] = useState({});
  const [buildingName, setBuildingName] = useState('');
  const [buildingLevel, setBuildingLevel] = useState('');
  const [showBuildingFilterModal, setShowBuildingFilterModal] = useState(false);
  const [tempBuildingName, setTempBuildingName] = useState('');
  const [tempBuildingLevel, setTempBuildingLevel] = useState('');
  const NFTsPerPage = 32;

  // Valores predefinidos para building_name
  const buildingNames = [
    'Torre de Conquista',
    'Forja',
    'Mina',
    'Árvore Milenar',
    'Santuário de Treino',
    'Torre de Quintessência',
    'Torre da Vitória',
    'Santuário Sagrado',
    'Portão Dimensional',
    'Santuário de Hidra'
  ];

  // Status disponíveis para filtro
  const availableStats = [
    { name: 'ATAQUE FÍSICO', key: 'ATAQUE FÍSICO' },
    { name: 'ATAQUE de feitiço', key: 'ATAQUE de feitiço' },
    { name: 'DEFESA FÍSICA', key: 'DEFESA FÍSICA' },
    { name: 'DEFESA contra feitiços', key: 'DEFESA contra feitiços' },
    { name: 'Precisão', key: 'Precisão' },
    { name: 'EVASÃO', key: 'EVASÃO' },
    { name: 'CRÍTICO', key: 'CRÍTICO' },
    { name: 'EVASÃO DE CRÍTICO', key: 'EVASÃO DE CRÍTICO' },
  ];

  useEffect(() => {
    loadExchangeRate();
  }, []);

  useEffect(() => {
    loadNFTs();
  }, [currentPage, orderBy, orderDirection, statFilters, buildingName, buildingLevel]);

  const loadExchangeRate = async () => {
    const rate = await fetchWemixToBRL();
    setWemixToBRL(rate);
  };

  const loadNFTs = async () => {
    try {
      setLoading(true);
      setError(null);
      const skip = (currentPage - 1) * NFTsPerPage;
      
      // Preparar filtros de status para a API
      const statFiltersParam = statFilters.length > 0 
        ? JSON.stringify(statFilters.map(filter => ({
            statName: filter.statName,
            statValue: filter.statValue.toString()
          })))
        : null;

      const params = {
        limit: NFTsPerPage, 
        skip,
        order_by: orderBy,
        order_direction: orderDirection
      };

      if (statFiltersParam) {
        params.stat_filters = statFiltersParam;
      }

      // Adicionar filtros de Torre se estiverem preenchidos
      if (buildingName) {
        params.building_name = buildingName;
      }
      if (buildingLevel && buildingName) {
        params.building_level = buildingLevel;
      }

      const data = await fetchNFTs(params);
      setNfts(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar NFTs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderByChange = (newOrderBy) => {
    setOrderBy(newOrderBy);
    setCurrentPage(1);
  };

  const handleOrderDirectionChange = (newDirection) => {
    setOrderDirection(newDirection);
    setCurrentPage(1);
  };

  const openStatFilterModal = () => {
    // Inicializar tempStatFilters com os filtros atuais
    const initialFilters = {};
    statFilters.forEach(filter => {
      if (filter.statName && filter.statValue) {
        initialFilters[filter.statName] = filter.statValue;
      }
    });
    setTempStatFilters(initialFilters);
    setShowStatFilterModal(true);
  };

  const closeStatFilterModal = () => {
    setShowStatFilterModal(false);
    setTempStatFilters({});
  };

  const updateTempStatFilter = (statKey, value) => {
    setTempStatFilters(prev => {
      if (value === '' || value === null || value === undefined) {
        const newFilters = { ...prev };
        delete newFilters[statKey];
        return newFilters;
      }
      return { ...prev, [statKey]: value };
    });
  };

  const applyStatFilters = () => {
    // Converter tempStatFilters para o formato esperado
    const filters = Object.entries(tempStatFilters)
      .filter(([key, value]) => key && value && value.toString().trim() !== '')
      .map(([statName, statValue]) => ({
        statName,
        statValue: statValue.toString()
      }));
    
    setStatFilters(filters);
    setCurrentPage(1);
    closeStatFilterModal();
  };

  const clearAllStatFilters = () => {
    setStatFilters([]);
    setTempStatFilters({});
    setCurrentPage(1);
  };

  const openBuildingFilterModal = () => {
    // Inicializar valores temporários com os filtros atuais
    setTempBuildingName(buildingName);
    setTempBuildingLevel(buildingLevel);
    setShowBuildingFilterModal(true);
  };

  const closeBuildingFilterModal = () => {
    setShowBuildingFilterModal(false);
    setTempBuildingName('');
    setTempBuildingLevel('');
  };

  const applyBuildingFilter = () => {
    setBuildingName(tempBuildingName);
    setBuildingLevel(tempBuildingName ? tempBuildingLevel : '');
    setCurrentPage(1);
    closeBuildingFilterModal();
  };

  const clearBuildingFilter = () => {
    setBuildingName('');
    setBuildingLevel('');
    setCurrentPage(1);
  };


  const handlePageChange = (newPage) => {
    if (newPage >= 1) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const hasNextPage = nfts.length === NFTsPerPage;
  const hasPreviousPage = currentPage > 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-dark-textMuted">Carregando NFTs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-500/10 border border-red-500/50 rounded-lg p-6 max-w-md">
          <p className="text-red-400 font-semibold mb-2">Erro ao carregar NFTs</p>
          <p className="text-dark-textMuted text-sm mb-4">{error}</p>
          <button
            onClick={loadNFTs}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col items-center mb-4">
          <img 
            src="/img/logo_cat.png" 
            alt="Logo" 
            className="h-32 md:h-40 mb-4 object-contain"
          />
          <h1 className="text-5xl md:text-6xl font-extrabold mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] tracking-tight">
            MIR4 <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Market</span>
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Ordenação e Filtros */}
      <div className="mb-6 space-y-4">
        {/* Ordenação */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-dark-textMuted text-sm font-medium">
              Ordenar por:
            </label>
            <select
              value={orderBy}
              onChange={(e) => handleOrderByChange(e.target.value)}
              className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white font-medium hover:bg-dark-bg/50 hover:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all cursor-pointer"
            >
              <option value="power_score">Poder</option>
              <option value="price">Preço</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-dark-textMuted text-sm font-medium">
              Direção:
            </label>
            <select
              value={orderDirection}
              onChange={(e) => handleOrderDirectionChange(e.target.value)}
              className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white font-medium hover:bg-dark-bg/50 hover:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all cursor-pointer"
            >
              <option value="desc">Maior para Menor</option>
              <option value="asc">Menor para Maior</option>
            </select>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-4">
          {/* Filtro de Torre */}
          <button
            onClick={openBuildingFilterModal}
            className="px-4 py-2 bg-cyan-600/20 border border-cyan-500/50 rounded-lg text-cyan-400 font-medium hover:bg-cyan-600/30 transition-all flex items-center gap-2"
          >
            <span>🏰</span>
            <span>Filtro de Torre</span>
            {(buildingName || buildingLevel) && (
              <span className="bg-cyan-600 text-white text-xs px-2 py-0.5 rounded-full">
                1
              </span>
            )}
          </button>
          {(buildingName || buildingLevel) && (
            <button
              onClick={clearBuildingFilter}
              className="px-3 py-2 bg-red-600/20 border border-red-500/50 rounded-lg text-red-400 text-sm font-medium hover:bg-red-600/30 transition-all"
            >
              Limpar Torre
            </button>
          )}

          {/* Filtro de Status */}
          <button
            onClick={openStatFilterModal}
            className="px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-lg text-purple-400 font-medium hover:bg-purple-600/30 transition-all flex items-center gap-2"
          >
            <span>⚙️</span>
            <span>Filtros de Status</span>
            {statFilters.length > 0 && (
              <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                {statFilters.length}
              </span>
            )}
          </button>
          {statFilters.length > 0 && (
            <button
              onClick={clearAllStatFilters}
              className="px-3 py-2 bg-red-600/20 border border-red-500/50 rounded-lg text-red-400 text-sm font-medium hover:bg-red-600/30 transition-all"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Modal de Filtro de Torre */}
      {showBuildingFilterModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeBuildingFilterModal}>
          <div 
            className="bg-dark-card border border-dark-border rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="p-6 border-b border-dark-border">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Filtro de Torre</h2>
                <button
                  onClick={closeBuildingFilterModal}
                  className="text-dark-textMuted hover:text-white transition-colors text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <p className="text-dark-textMuted text-sm mt-2">
                Selecione o nome da torre e o nível desejado.
              </p>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Nome da Torre
                </label>
                <select
                  value={tempBuildingName}
                  onChange={(e) => {
                    setTempBuildingName(e.target.value);
                    if (!e.target.value) {
                      setTempBuildingLevel('');
                    }
                  }}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white font-medium hover:bg-dark-bg/80 hover:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all cursor-pointer"
                >
                  <option value="">Selecione uma torre</option>
                  {buildingNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Nível da Torre
                </label>
                <input
                  type="number"
                  value={tempBuildingLevel}
                  onChange={(e) => setTempBuildingLevel(e.target.value)}
                  placeholder="Nível (mínimo: 2)"
                  min="2"
                  step="1"
                  disabled={!tempBuildingName}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white font-medium placeholder-dark-textMuted hover:bg-dark-bg/80 hover:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Footer do Modal */}
            <div className="p-6 border-t border-dark-border flex items-center justify-end gap-3">
              <button
                onClick={closeBuildingFilterModal}
                className="px-6 py-2 bg-dark-bg border border-dark-border rounded-lg text-white font-medium hover:bg-dark-bg/80 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={applyBuildingFilter}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium transition-all"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Filtros de Status */}
      {showStatFilterModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeStatFilterModal}>
          <div 
            className="bg-dark-card border border-dark-border rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="p-6 border-b border-dark-border">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Filtros de Status</h2>
                <button
                  onClick={closeStatFilterModal}
                  className="text-dark-textMuted hover:text-white transition-colors text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <p className="text-dark-textMuted text-sm mt-2">
                Defina os valores mínimos para cada status. Deixe em branco para não filtrar.
              </p>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableStats.map((stat) => (
                  <div key={stat.key} className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border/50">
                    <label className="block text-white font-medium mb-2 text-sm">
                      {stat.name}
                    </label>
                    <input
                      type="number"
                      value={tempStatFilters[stat.key] || ''}
                      onChange={(e) => updateTempStatFilter(stat.key, e.target.value)}
                      placeholder="Valor mínimo (opcional)"
                      min="0"
                      step="1"
                      className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white placeholder-dark-textMuted focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer do Modal */}
            <div className="p-6 border-t border-dark-border flex items-center justify-between gap-4">
              <div className="text-dark-textMuted text-sm">
                {Object.keys(tempStatFilters).filter(key => tempStatFilters[key] && tempStatFilters[key].toString().trim() !== '').length > 0 ? (
                  <span>
                    {Object.keys(tempStatFilters).filter(key => tempStatFilters[key] && tempStatFilters[key].toString().trim() !== '').length} filtro(s) configurado(s)
                  </span>
                ) : (
                  <span>Nenhum filtro configurado</span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeStatFilterModal}
                  className="px-6 py-2 bg-dark-bg border border-dark-border rounded-lg text-white font-medium hover:bg-dark-bg/80 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={applyStatFilters}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-all"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NFT Grid */}
      {nfts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dark-textMuted text-lg">Nenhum NFT encontrado</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {nfts.map((nft, index) => (
              <NFTCard 
                key={nft.transport_id || index} 
                nft={nft} 
                wemixToBRL={wemixToBRL}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center gap-4 mt-8 pb-8">
            {/* Controles de navegação */}
            <div className="flex items-center justify-center gap-2">
              {/* Botão Anterior */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPreviousPage || loading}
                className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white font-medium hover:bg-dark-bg/50 hover:border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Anterior
              </button>

              {/* Números de página */}
              <div className="flex items-center gap-1">
                {/* Primeira página */}
                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white font-medium hover:bg-dark-bg/50 hover:border-purple-500/50 transition-all"
                    >
                      1
                    </button>
                    {currentPage > 4 && (
                      <span className="text-dark-textMuted px-2">...</span>
                    )}
                  </>
                )}

                {/* Páginas ao redor da atual */}
                {[
                  currentPage - 2,
                  currentPage - 1,
                  currentPage,
                  currentPage + 1,
                  currentPage + 2,
                ]
                  .filter((page) => page >= 1)
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                      className={`px-3 py-2 rounded-lg font-medium transition-all ${
                        page === currentPage
                          ? 'bg-purple-600 text-white border border-purple-500'
                          : 'bg-dark-card border border-dark-border text-white hover:bg-dark-bg/50 hover:border-purple-500/50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {page}
                    </button>
                  ))}

                {/* Indicador de mais páginas */}
                {hasNextPage && (
                  <>
                    {currentPage < 3 && (
                      <>
                        <button
                          onClick={() => handlePageChange(currentPage + 3)}
                          className="px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white font-medium hover:bg-dark-bg/50 hover:border-purple-500/50 transition-all"
                        >
                          {currentPage + 3}
                        </button>
                        <span className="text-dark-textMuted px-2">...</span>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Botão Próximo */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage || loading}
                className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white font-medium hover:bg-dark-bg/50 hover:border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Próximo
              </button>
            </div>

            {/* Info da página */}
            <div className="text-center text-dark-textMuted text-sm">
              Página {currentPage} {hasNextPage && '(há mais páginas)'}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NFTList;
