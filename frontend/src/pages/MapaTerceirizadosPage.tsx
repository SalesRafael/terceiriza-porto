import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { GeolocalizacaoPayload, Profissional } from '../types';

const PONTOS_PORTO_SEGURO = [
  { nome: 'São Francisco (Unidade)', lat: -16.4435, lng: -39.0682 },
  { nome: 'Centro Histórico', lat: -16.4497, lng: -39.0647 },
  { nome: 'Orla Taperapuã', lat: -16.3942, lng: -39.0418 },
  { nome: 'Alto Mundaí', lat: -16.4165, lng: -39.0512 },
  { nome: "Arraial d'Ajuda", lat: -16.4912, lng: -39.0734 },
  { nome: 'Trancoso (Quadrado)', lat: -16.5886, lng: -39.0928 }
];

export const MapaTerceirizadosPage: React.FC = () => {
  const [dadosGps, setDadosGps] = useState<GeolocalizacaoPayload | null>(null);
  const [refPoint, setRefPoint] = useState(PONTOS_PORTO_SEGURO[0]);
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [selecionado, setSelecionado] = useState<Profissional | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const carregarRadar = async (lat = refPoint.lat, lng = refPoint.lng, status = filtroStatus) => {
    setCarregando(true);
    try {
      const res = await api.getGeolocalizacaoTerceirizados(lat, lng, status);
      setDadosGps(res);
      if (res.terceirizados.length > 0) {
        const atual =
          res.terceirizados.find((p) => p.id === selecionado?.id) ||
          res.terceirizados[0];
        setSelecionado(atual);
      } else {
        setSelecionado(null);
      }
    } catch (err) {
      console.error('Erro ao carregar geolocalização:', err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarRadar();
  }, []);

  const handleMeuGpsNavegador = () => {
    if (!navigator.geolocation) {
      setFeedback('Geolocalização não suportada pelo navegador.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const pt = {
          nome: `Meu GPS (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setRefPoint(pt);
        carregarRadar(pt.lat, pt.lng, filtroStatus);
        setFeedback('Posição GPS sincronizada com sucesso!');
      },
      () => {
        const pt = PONTOS_PORTO_SEGURO[2];
        setRefPoint(pt);
        carregarRadar(pt.lat, pt.lng, filtroStatus);
        setFeedback('Simulando posição GPS na Orla Norte (Taperapuã — Porto Seguro)!');
      }
    );
  };

  const handleSimularMovimento = async () => {
    await api.simularMovimentoGps();
    await carregarRadar(refPoint.lat, refPoint.lng, filtroStatus);
    setFeedback('🛰️ Telemetria GPS dos terceirizados atualizada em tempo real!');
  };

  const handleCheckinRapido = async (
    prof: Profissional,
    tipo: 'CHECKIN' | 'DESLOCAMENTO' | 'CHECKOUT'
  ) => {
    const res = await api.registrarCheckinGps(prof.id, {
      tipo,
      local: `${refPoint.nome} — Porto Seguro/BA`,
      latitude: prof.latitude,
      longitude: prof.longitude
    });
    setFeedback(res.mensagem);
    await carregarRadar(refPoint.lat, refPoint.lng, filtroStatus);
  };

  const mapLat = selecionado?.latitude ?? refPoint.lat;
  const mapLng = selecionado?.longitude ?? refPoint.lng;
  const bbox = `${(mapLng - 0.035).toFixed(4)}%2C${(mapLat - 0.025).toFixed(4)}%2C${(
    mapLng + 0.035
  ).toFixed(4)}%2C${(mapLat + 0.025).toFixed(4)}`;

  return (
    <div className="mapa-gps-page">
      <section className="page-hero">
        <div className="container">
          <span className="flag-tag">
            <span className="flag-dot flag-dot--green" />
            <span className="flag-dot flag-dot--red" />
            <span className="flag-dot flag-dot--blue" />
            RADAR GPS EM TEMPO REAL • WEB & APP FLUTTER
          </span>
          <h1>
            Geolocalização dos <strong>Terceirizados</strong> em Porto Seguro
          </h1>
          <p>
            Acompanhe no mapa a posição GPS, distância em quilômetros, tempo estimado de chegada e
            check-ins georreferenciados da equipe em São Francisco, Orla Norte, Arraial d&apos;Ajuda e
            Trancoso.
          </p>

          <div className="cep-quick-buttons" style={{ justifyContent: 'center' }}>
            <span>Referência em Porto Seguro:</span>
            {PONTOS_PORTO_SEGURO.map((pt) => (
              <button
                key={pt.nome}
                type="button"
                className="cep-chip"
                onClick={() => {
                  setRefPoint(pt);
                  carregarRadar(pt.lat, pt.lng, filtroStatus);
                }}
              >
                📍 {pt.nome}
              </button>
            ))}
            <button type="button" className="btn btn--green-sm" onClick={handleMeuGpsNavegador}>
              🎯 Usar Meu GPS
            </button>
            <button type="button" className="btn btn--red-cta" onClick={handleSimularMovimento}>
              🛰️ Simular Movimento GPS
            </button>
          </div>

          {feedback && (
            <div
              className="cep-status-banner cep-status-banner--ok"
              style={{ maxWidth: 680, margin: '0.75rem auto 0', justifyContent: 'center' }}
            >
              <strong>{feedback}</strong>
            </div>
          )}
        </div>
      </section>

      <section className="panel-content-section">
        <div className="container">
          {dadosGps && (
            <div className="kpi-grid">
              <div className="kpi-card kpi-card--green">
                <small>Terceirizados Rastreados</small>
                <strong>{dadosGps.resumoOperacional.totalRastreados}</strong>
                <span>Telemetria GPS ativa em Porto Seguro</span>
              </div>
              <div className="kpi-card kpi-card--green">
                <small>🟢 Disponíveis para Saída</small>
                <strong>{dadosGps.resumoOperacional.disponiveis}</strong>
                <span>Prontos para atendimento imediato</span>
              </div>
              <div className="kpi-card kpi-card--blue">
                <small>🔵 Em Deslocamento (Rota)</small>
                <strong>{dadosGps.resumoOperacional.emDeslocamento}</strong>
                <span>Em trânsito para o cliente</span>
              </div>
              <div className="kpi-card kpi-card--red">
                <small>🔴 Em Atendimento (Check-in)</small>
                <strong>{dadosGps.resumoOperacional.emAtendimento}</strong>
                <span>Com check-in georreferenciado</span>
              </div>
            </div>
          )}

          {/* Filtros de Status */}
          <div className="precos-filter-tabs" style={{ marginBottom: '1.25rem' }}>
            {['TODOS', 'DISPONIVEL', 'EM_DESLOCAMENTO', 'EM_ATENDIMENTO'].map((st) => (
              <button
                key={st}
                type="button"
                className={filtroStatus === st ? 'active' : ''}
                onClick={() => {
                  setFiltroStatus(st);
                  carregarRadar(refPoint.lat, refPoint.lng, st);
                }}
              >
                {st === 'TODOS' && 'Todos os Terceirizados'}
                {st === 'DISPONIVEL' && '🟢 Disponíveis'}
                {st === 'EM_DESLOCAMENTO' && '🔵 Em Deslocamento'}
                {st === 'EM_ATENDIMENTO' && '🔴 Em Atendimento'}
              </button>
            ))}
          </div>

          <div className="orcamento-split-grid">
            {/* Mapa OpenStreetMap Interativo focado no Terceirizado Selecionado */}
            <div className="orcamento-form-card" style={{ padding: '1.25rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div>
                  <span className="step-pill">MAPA AO VIVO • PORTO SEGURO - BA</span>
                  <h3>
                    {selecionado
                      ? `${selecionado.nome} (${selecionado.bairro} • ${selecionado.distanciaKm} km)`
                      : refPoint.nome}
                  </h3>
                </div>
                {selecionado && (
                  <a
                    href={`https://www.google.com/maps?q=${selecionado.latitude},${selecionado.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn--outline-sm"
                  >
                    Abrir no Google Maps ↗
                  </a>
                )}
              </div>

              <div
                style={{
                  borderRadius: 14,
                  overflow: 'hidden',
                  border: '2px solid var(--porto-green)',
                  height: 420
                }}
              >
                <iframe
                  title="Mapa GPS Terceirizados Porto Seguro"
                  width="100%"
                  height="420"
                  style={{ border: 0 }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${mapLat}%2C${mapLng}`}
                />
              </div>

              {selecionado && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#f8faf9',
                    borderRadius: 12,
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}
                  >
                    <div>
                      <strong>
                        📍 Coordenadas GPS: {selecionado.latitude?.toFixed(5)},{' '}
                        {selecionado.longitude?.toFixed(5)}
                      </strong>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {selecionado.clienteAtual} • Bateria GPS: {selecionado.bateriaNivel}% •
                        Chegada estimada: ~{selecionado.tempoEstimadoMin} min
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn btn--outline-sm"
                        onClick={() => handleCheckinRapido(selecionado, 'DESLOCAMENTO')}
                      >
                        🔵 Iniciar Rota
                      </button>
                      <button
                        type="button"
                        className="btn btn--green-sm"
                        onClick={() => handleCheckinRapido(selecionado, 'CHECKIN')}
                      >
                        ✅ Check-in GPS
                      </button>
                      <button
                        type="button"
                        className="btn btn--outline-sm"
                        onClick={() => handleCheckinRapido(selecionado, 'CHECKOUT')}
                      >
                        🏁 Check-out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lista Lateral de Terceirizados Ordenados por Proximidade GPS */}
            <div className="admin-records-list">
              {carregando && <p>Calculando distâncias GPS...</p>}
              {dadosGps?.terceirizados.map((prof) => {
                const isSelected = selecionado?.id === prof.id;
                return (
                  <div
                    key={prof.id}
                    className="record-card"
                    style={{
                      cursor: 'pointer',
                      borderColor: isSelected ? 'var(--porto-green)' : undefined,
                      borderWidth: isSelected ? 2 : 1
                    }}
                    onClick={() => setSelecionado(prof)}
                  >
                    <div className="record-card__header">
                      <div>
                        <span className="protocol-pill">{prof.distanciaKm} km</span>
                        <strong>{prof.nome}</strong>
                      </div>
                      <span
                        className={`status-badge ${
                          prof.statusOperacional === 'DISPONIVEL'
                            ? 'status--CONFIRMADO'
                            : 'status--EM_ANALISE'
                        }`}
                      >
                        {prof.statusOperacional}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.84rem', marginBottom: '0.4rem' }}>
                      <strong>{prof.funcaoPrincipal}</strong> • Bairro: {prof.bairro}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      ⏱️ Chegada ~{prof.tempoEstimadoMin} min • 🔋 {prof.bateriaNivel}% • ⭐{' '}
                      {prof.avaliacaoMedia} ({prof.atendimentosRealizados} diárias)
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
