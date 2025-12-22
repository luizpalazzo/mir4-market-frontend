import React, { useState } from 'react';

const NFTCard = ({ nft, wemixToBRL }) => {
  const [showModal, setShowModal] = useState(false);
  const formatWemix = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatBRL = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  // Mapeamento de classe para URL da imagem
  const getClassImage = (charClass) => {
    const classImageMap = {
      '1': 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-warrior2.webp', // Guerreiro
      '2': 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-sorcerer2.webp', // Maga
      '3': 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-taoist2.webp', // Taoista
      '4': 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-arbalist2.webp', // Arqueira
      '5': 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-lancer2.webp', // Lanceiro
      '6': 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-darkist3.webp', // Soturna
      '7': 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-lionheart3.webp', // Coração de Leão
    };
    
    const classStr = charClass?.toString();
    return classImageMap[classStr] || null;
  };

  // Converter tier para número romano
  const getRomanNumeral = (num) => {
    const romanMap = {
      1: 'I',
      2: 'II',
      3: 'III',
      4: 'IV',
      5: 'V',
      6: 'VI',
      7: 'VII',
      8: 'VIII',
      9: 'IX',
      10: 'X'
    };
    return romanMap[num] || num?.toString() || '';
  };

  // Obter cor de fundo baseada no grade
  const getGradeColor = (grade) => {
    const gradeColorMap = {
      '1': 'bg-gray-500/30', // cinza
      '2': 'bg-green-500/30', // verde
      '3': 'bg-blue-500/30', // azul
      '4': 'bg-red-500/30', // vermelho
      '5': 'bg-yellow-500/30', // amarelo
      '6': 'bg-orange-500/30', // laranja
    };
    const gradeStr = grade?.toString();
    return gradeColorMap[gradeStr] || 'bg-dark-bg/50';
  };

  // Função para buscar status específicos
  const getStatusValue = (statName) => {
    if (!nft.status?.raw_status?.lists) return null;
    
    const status = nft.status.raw_status.lists.find(
      (s) => s.statName === statName
    );
    return status || null;
  };

  // Status que queremos exibir
  const statusToShow = [
    { name: 'ATAQUE FÍSICO', key: 'ATAQUE FÍSICO' },
    { name: 'ATAQUE de feitiço', key: 'ATAQUE de feitiço' },
    { name: 'DEFESA FÍSICA', key: 'DEFESA FÍSICA' },
    { name: 'DEFESA contra feitiços', key: 'DEFESA contra feitiços' },
    { name: 'Precisão', key: 'Precisão' },
    { name: 'EVASÃO', key: 'EVASÃO' },
    { name: 'CRÍTICO', key: 'CRÍTICO' },
    { name: 'EVASÃO DE CRÍTICO', key: 'EVASÃO DE CRÍTICO' },
    { name: 'Aumento do DANO DE ATAQUE CRÍTICO', key: 'Aumento do DANO DE ATAQUE CRÍTICO' },
    { name: 'Redução do DANO CRÍTICO Recebido', key: 'Redução do DANO CRÍTICO Recebido' },
    { name: 'Aumento do DANO DE ATAQUE de Esmagamento', key: 'Aumento do DANO DE ATAQUE de Esmagamento' },
    { name: 'Redução do DANO de Esmagamento Recebido', key: 'Redução do DANO de Esmagamento Recebido' },
    { name: 'Aumento do DANO DE ATAQUE em PvP', key: 'Aumento do DANO DE ATAQUE em PvP' },
    { name: 'Redução do DANO em PvP Recebido', key: 'Redução do DANO em PvP Recebido' },
    { name: 'Aumento de DANO DE ATAQUE de Habilidade', key: 'Aumento de DANO DE ATAQUE de Habilidade' },
    { name: 'Redução do DANO de Habilidade Recebido', key: 'Redução do DANO de Habilidade Recebido' },
    { name: 'Aumento de Todo o DANO DE ATAQUE', key: 'Aumento de Todo o DANO DE ATAQUE' },
    { name: 'Redução de Todo o DANO Recebido', key: 'Redução de Todo o DANO Recebido' },
  ];

  const priceInWemix = nft.price;
  const priceInBRL = wemixToBRL && priceInWemix 
    ? priceInWemix * wemixToBRL 
    : null;

  // Debug: verificar se equipItem existe
  if (nft.equipItem || nft.equipItems) {
    console.log('EquipItems encontrados:', nft.equipItem || nft.equipItems);
  }

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenXdraco = () => {
    if (nft.seq) {
      const url = `https://xdraco.com/nft/trade/${nft.seq}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
    <div 
      className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className="space-y-4">
        {/* Badge de Arremate */}
        {nft.bidder_count > 0 && (
          <div className="flex justify-start">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">
              🔨 Arremate em andamento
            </span>
          </div>
        )}

        {/* Name */}
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
            {nft.name || 'Sem nome'}
          </h3>
          {/* Imagem da Classe */}
          {nft.char_class && getClassImage(nft.char_class) && (
            <div className="mt-3 flex justify-center">
              <img
                src={getClassImage(nft.char_class)}
                alt={`Classe ${nft.char_class}`}
                className="max-w-full h-auto max-h-48 object-contain rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Itens Equipados */}
          {(() => {
            const equipItems = nft.equipItem || nft.equipItems;
            if (!equipItems) return null;
            
            // Criar array de itens de 1 a 10
            const itemsToShow = [];
            for (let i = 1; i <= 10; i++) {
              if (equipItems[i.toString()] || equipItems[i]) {
                itemsToShow.push({
                  key: i.toString(),
                  item: equipItems[i.toString()] || equipItems[i]
                });
              }
            }
            
            if (itemsToShow.length === 0) return null;
            
            return (
              <div className="mt-3 pt-3 border-t border-dark-border">
                <div className="text-dark-textMuted text-xs uppercase tracking-wide mb-2">
                  Equipamentos
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {itemsToShow.map((itemData) => {
                    const gradeColor = getGradeColor(itemData.item.grade);
                    const tierRoman = getRomanNumeral(parseInt(itemData.item.tier));
                    const enhance = parseInt(itemData.item.enhance) || 0;
                    
                    return (
                      <div
                        key={itemData.key}
                        className={`${gradeColor} rounded-lg p-1.5 border border-dark-border/50 hover:border-purple-500/50 transition-all relative`}
                      >
                        <img
                          src={itemData.item.itemPath}
                          alt={itemData.item.itemName}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        {/* Enhance */}
                        {enhance > 0 && (
                          <div className="absolute top-0 right-0 bg-purple-600/90 text-white text-[10px] font-bold px-1 rounded-bl border border-purple-500/50">
                            +{enhance}
                          </div>
                        )}
                        {/* Tier em romano */}
                        {tierRoman && (
                          <div className="absolute bottom-0 right-0 bg-dark-card/90 text-white text-[10px] font-bold px-1 rounded-tl border border-dark-border/50">
                            {tierRoman}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {/* World Name */}
        {nft.world_name && (
          <div className="flex items-center gap-2">
            <span className="text-dark-textMuted text-sm">Servidor:</span>
            <span className="text-white font-medium">{nft.world_name}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Level */}
          <div className="bg-dark-bg/50 rounded-lg p-3 border border-dark-border">
            <div className="text-dark-textMuted text-xs uppercase tracking-wide mb-1">
              Level
            </div>
            <div className="text-white font-bold text-lg">
              {nft.level || 'N/A'}
            </div>
          </div>

          {/* Power Score */}
          <div className="bg-dark-bg/50 rounded-lg p-3 border border-dark-border">
            <div className="text-dark-textMuted text-xs uppercase tracking-wide mb-1">
              Power Score
            </div>
            <div className="text-white font-bold text-lg">
              {formatNumber(nft.power_score)}
            </div>
          </div>
        </div>

        {/* Status Section */}
        {nft.status?.raw_status?.lists && (
          <div className="pt-2 border-t border-dark-border">
            <div className="text-dark-textMuted text-xs uppercase tracking-wide mb-3">
              Status
            </div>
            <div className="grid grid-cols-2 gap-2">
              {statusToShow.map((statusConfig) => {
                const statusData = getStatusValue(statusConfig.key);
                if (!statusData) return null;

                return (
                  <div
                    key={statusConfig.key}
                    className="flex items-center gap-2 bg-dark-bg/40 rounded-md p-2 border border-dark-border/50 hover:bg-dark-bg/60 hover:border-purple-500/40 transition-all"
                  >
                    {/* Icon */}
                    {statusData.iconPath && (
                      <img
                        src={statusData.iconPath}
                        alt={statusData.statName}
                        className="w-6 h-6 flex-shrink-0 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    {/* Status Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-dark-textMuted text-[10px] leading-tight truncate mb-0.5">
                        {statusData.statName}
                      </div>
                      <div className="text-white font-bold text-xs">
                        {statusData.statValue || 'N/A'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="pt-2 border-t border-dark-border space-y-2">
          {/* Preço em WEMIX */}
          <div className="flex items-center justify-between">
            <span className="text-dark-textMuted text-sm">Preço (WEMIX)</span>
            <span className="text-2xl font-bold text-purple-400">
              {formatWemix(priceInWemix)} WEMIX
            </span>
          </div>
          
          {/* Preço em BRL */}
          {priceInBRL !== null ? (
            <div className="flex items-center justify-between">
              <span className="text-dark-textMuted text-xs">Preço aproximado em reais</span>
              <span className="text-lg font-semibold text-green-400">
                {formatBRL(priceInBRL)}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-dark-textMuted text-xs">Preço aproximado em reais</span>
              <span className="text-xs text-dark-textMuted italic">
                Carregando...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Modal de Detalhes */}
    {showModal && (
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={handleCloseModal}
      >
        <div 
          className="bg-dark-card border border-dark-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header do Modal */}
          <div className="p-6 border-b border-dark-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{nft.name || 'Sem nome'}</h2>
                {nft.world_name && (
                  <p className="text-dark-textMuted text-sm mt-1">Servidor: {nft.world_name}</p>
                )}
              </div>
              <button
                onClick={handleCloseModal}
                className="text-dark-textMuted hover:text-white transition-colors text-3xl leading-none"
              >
                ×
              </button>
            </div>
          </div>

          {/* Conteúdo do Modal */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Skills */}
            {nft.skills && nft.skills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">⚔️</span>
                  <h3 className="text-xl font-bold text-white">Skills</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {nft.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-dark-bg/50 rounded-lg p-3 border border-dark-border/50 flex items-center justify-between"
                    >
                      <span className="text-white font-medium text-sm">{skill.skill_name || 'N/A'}</span>
                      <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-xs font-semibold border border-purple-500/50">
                        Level {skill.skill_level || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Spirits */}
            {nft.spirits && nft.spirits.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">✨</span>
                  <h3 className="text-xl font-bold text-white">Spirits</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {nft.spirits.map((spirit, index) => (
                    <div
                      key={index}
                      className="bg-dark-bg/50 rounded-lg p-3 border border-dark-border/50 flex items-center justify-between"
                    >
                      <span className="text-white font-medium text-sm">{spirit.name || 'N/A'}</span>
                      <span className="bg-cyan-600/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold border border-cyan-500/50">
                        Grade {spirit.grade || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Training */}
            {nft.training && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🏋️</span>
                  <h3 className="text-xl font-bold text-white">Training</h3>
                </div>
                <div className="space-y-3">
                  {nft.training.consitutionName && (
                    <div className="bg-dark-bg/50 rounded-lg p-3 border border-dark-border/50">
                      <div className="text-dark-textMuted text-xs mb-1">{nft.training.consitutionName}</div>
                      <div className="text-white font-semibold">Level {nft.training.consitutionLevel || 'N/A'}</div>
                    </div>
                  )}
                  {nft.training.collectName && (
                    <div className="bg-dark-bg/50 rounded-lg p-3 border border-dark-border/50">
                      <div className="text-dark-textMuted text-xs mb-1">{nft.training.collectName}</div>
                      <div className="text-white font-semibold">Level {nft.training.collectLevel || 'N/A'}</div>
                    </div>
                  )}
                  {nft.training && Object.keys(nft.training).filter(key => !isNaN(key)).length > 0 && (
                    <div className="bg-dark-bg/50 rounded-lg p-3 border border-dark-border/50">
                      <div className="text-dark-textMuted text-xs mb-2">Forças de Treinamento</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.keys(nft.training)
                          .filter(key => !isNaN(key) && nft.training[key])
                          .map((key) => (
                            <div key={key} className="text-white text-sm">
                              <span className="text-dark-textMuted text-xs">{nft.training[key].forceName || 'N/A'}: </span>
                              <span className="font-semibold">Level {nft.training[key].forceLevel || 'N/A'}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer do Modal */}
          <div className="p-6 border-t border-dark-border flex items-center justify-end gap-4">
            <button
              onClick={handleCloseModal}
              className="px-6 py-2 bg-dark-bg border border-dark-border rounded-lg text-white font-medium hover:bg-dark-bg/80 transition-all"
            >
              Fechar
            </button>
            {nft.seq && (
              <button
                onClick={handleOpenXdraco}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-all flex items-center gap-2"
              >
                <span>🔗</span>
                <span>Ver no XDRACO</span>
              </button>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default NFTCard;

