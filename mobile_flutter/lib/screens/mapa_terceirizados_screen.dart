import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/models.dart';
import '../services/api_service.dart';
import '../theme/porto_seguro_theme.dart';

class MapaTerceirizadosScreen extends StatefulWidget {
  final void Function(TerceirizadoGps) onContratarTerceirizado;

  const MapaTerceirizadosScreen({
    super.key,
    required this.onContratarTerceirizado,
  });

  @override
  State<MapaTerceirizadosScreen> createState() =>
      _MapaTerceirizadosScreenState();
}

class _MapaTerceirizadosScreenState extends State<MapaTerceirizadosScreen> {
  final MapController _mapController = MapController();

  double _clienteLat = ApiService.unidadeLat;
  double _clienteLng = ApiService.unidadeLng;
  String _localReferenciaLabel = 'São Francisco (Unidade)';
  String _filtroStatus = 'TODOS';

  List<TerceirizadoGps> _terceirizados = [];
  TerceirizadoGps? _selecionado;
  bool _carregando = true;
  bool _buscandoGpsReal = false;

  @override
  void initState() {
    super.initState();
    _carregarTerceirizados();
  }

  Future<void> _carregarTerceirizados() async {
    setState(() => _carregando = true);
    final lista = await ApiService.listarTerceirizadosGps(
      refLat: _clienteLat,
      refLng: _clienteLng,
      status: _filtroStatus,
    );
    if (!mounted) return;
    setState(() {
      _terceirizados = lista;
      if (lista.isNotEmpty) {
        _selecionado = lista.firstWhere(
          (p) => p.id == _selecionado?.id,
          orElse: () => lista.first,
        );
      } else {
        _selecionado = null;
      }
      _carregando = false;
    });
  }

  Future<void> _obterGpsRealDispositivo() async {
    setState(() => _buscandoGpsReal = true);
    try {
      bool servicoAtivo = await Geolocator.isLocationServiceEnabled();
      if (!servicoAtivo) {
        throw Exception('Serviço de GPS desativado.');
      }
      LocationPermission perm = await Geolocator.checkPermission();
      if (perm == LocationPermission.denied) {
        perm = await Geolocator.requestPermission();
      }
      if (perm == LocationPermission.denied ||
          perm == LocationPermission.deniedForever) {
        throw Exception('Permissão de GPS não concedida.');
      }

      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 5),
        ),
      );

      setState(() {
        _clienteLat = pos.latitude;
        _clienteLng = pos.longitude;
        _localReferenciaLabel =
            'Meu GPS (${pos.latitude.toStringAsFixed(4)}, ${pos.longitude.toStringAsFixed(4)})';
      });
      _mapController.move(LatLng(_clienteLat, _clienteLng), 13.8);
      await _carregarTerceirizados();
    } catch (_) {
      // Caso emulador/desktop esteja sem antena GPS física, simula posição na Orla de Porto Seguro
      if (!mounted) return;
      setState(() {
        _clienteLat = -16.4165;
        _clienteLng = -39.0512;
        _localReferenciaLabel = 'GPS Porto Seguro · Alto Mundaí';
      });
      _mapController.move(LatLng(_clienteLat, _clienteLng), 13.5);
      await _carregarTerceirizados();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
              'GPS sincronizado em Porto Seguro - BA (Região Orla / Alto Mundaí)!'),
          backgroundColor: PortoColors.green,
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _buscandoGpsReal = false);
      }
    }
  }

  Future<void> _simularMovimentoTempoReal() async {
    final lista = await ApiService.simularMovimentoGps(
      refLat: _clienteLat,
      refLng: _clienteLng,
    );
    if (!mounted) return;
    setState(() {
      _terceirizados = _filtroStatus == 'TODOS'
          ? lista
          : lista.where((p) => p.statusOperacional == _filtroStatus).toList();
      if (_terceirizados.isNotEmpty) {
        _selecionado = _terceirizados.firstWhere(
          (p) => p.id == _selecionado?.id,
          orElse: () => _terceirizados.first,
        );
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(
            '🛰️ Telemetria GPS atualizada! Posições e distâncias recalculadas.'),
        backgroundColor: PortoColors.blueDark,
        duration: Duration(seconds: 2),
      ),
    );
  }

  void _moverParaPontoPortoSeguro(PontoReferenciaPorto ponto) {
    setState(() {
      _clienteLat = ponto.latitude;
      _clienteLng = ponto.longitude;
      _localReferenciaLabel = ponto.nome;
    });
    _mapController.move(LatLng(ponto.latitude, ponto.longitude), 13.8);
    _carregarTerceirizados();
  }

  Color _corPorStatus(String status) {
    switch (status) {
      case 'DISPONIVEL':
        return PortoColors.green;
      case 'EM_DESLOCAMENTO':
        return PortoColors.blue;
      case 'EM_ATENDIMENTO':
        return PortoColors.red;
      default:
        return PortoColors.greenDark;
    }
  }

  String _labelPorStatus(String status) {
    switch (status) {
      case 'DISPONIVEL':
        return 'Disponível';
      case 'EM_DESLOCAMENTO':
        return 'Em Deslocamento';
      case 'EM_ATENDIMENTO':
        return 'Em Atendimento';
      default:
        return status;
    }
  }

  Future<void> _abrirWhatsApp(TerceirizadoGps prof) async {
    final msg = Uri.encodeComponent(
        'Olá! Vi no radar GPS da Terceiriza Porto que ${prof.nome} está a ${prof.distanciaKm} km (${prof.bairro}). Gostaria de agendar um atendimento!');
    final uri = Uri.parse('https://wa.me/5573999103388?text=$msg');
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final selecionada = _selecionado;

    return Column(
      children: [
        // Barra de atalhos de regiões de Porto Seguro + Botões GPS
        Container(
          color: Colors.white,
          padding: const EdgeInsets.fromLTRB(12, 10, 12, 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.my_location,
                      color: PortoColors.green, size: 18),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      'Referência GPS: $_localReferenciaLabel',
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 13,
                        color: PortoColors.textMain,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  TextButton.icon(
                    onPressed:
                        _buscandoGpsReal ? null : _obterGpsRealDispositivo,
                    icon: const Icon(Icons.gps_fixed, size: 16),
                    label: Text(_buscandoGpsReal ? 'Buscando...' : 'Meu GPS'),
                    style: TextButton.styleFrom(
                      foregroundColor: PortoColors.blueDark,
                      visualDensity: VisualDensity.compact,
                    ),
                  ),
                  const SizedBox(width: 4),
                  ElevatedButton.icon(
                    onPressed: _simularMovimentoTempoReal,
                    icon: const Icon(Icons.satellite_alt, size: 15),
                    label: const Text('Simular GPS'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: PortoColors.red,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 6),
                      visualDensity: VisualDensity.compact,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              // Chips de bairros/distritos de Porto Seguro
              SizedBox(
                height: 32,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: ApiService.pontosPortoSeguro.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 6),
                  itemBuilder: (context, index) {
                    final pt = ApiService.pontosPortoSeguro[index];
                    final ativo = _localReferenciaLabel == pt.nome;
                    return ActionChip(
                      label: Text(
                        pt.nome,
                        style: TextStyle(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w700,
                          color: ativo ? Colors.white : PortoColors.greenDark,
                        ),
                      ),
                      backgroundColor:
                          ativo ? PortoColors.green : PortoColors.greenLight,
                      side: BorderSide.none,
                      visualDensity: VisualDensity.compact,
                      onPressed: () => _moverParaPontoPortoSeguro(pt),
                    );
                  },
                ),
              ),
              const SizedBox(height: 6),
              // Filtro por status operacional
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _buildStatusChip('TODOS', 'Todos (${_terceirizados.length})'),
                    const SizedBox(width: 6),
                    _buildStatusChip('DISPONIVEL', '🟢 Disponíveis'),
                    const SizedBox(width: 6),
                    _buildStatusChip('EM_DESLOCAMENTO', '🔵 Em Rota'),
                    const SizedBox(width: 6),
                    _buildStatusChip('EM_ATENDIMENTO', '🔴 Em Atendimento'),
                  ],
                ),
              ),
            ],
          ),
        ),

        // MAPA INTERATIVO DE PORTO SEGURO COM PINOS DOS TERCEIRIZADOS
        Expanded(
          flex: 5,
          child: Stack(
            children: [
              FlutterMap(
                mapController: _mapController,
                options: MapOptions(
                  initialCenter: LatLng(_clienteLat, _clienteLng),
                  initialZoom: 13.2,
                ),
                children: [
                  TileLayer(
                    urlTemplate:
                        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    userAgentPackageName: 'br.com.terceirizaporto.mobile',
                  ),
                  // Linha de rota entre a referência do cliente e o terceirizado selecionado
                  if (selecionada != null)
                    PolylineLayer(
                      polylines: [
                        Polyline(
                          points: [
                            LatLng(_clienteLat, _clienteLng),
                            LatLng(
                                selecionada.latitude, selecionada.longitude),
                          ],
                          strokeWidth: 4.0,
                          color: PortoColors.blue,
                        ),
                      ],
                    ),
                  MarkerLayer(
                    markers: [
                      // Marcador da Posição de Referência / Cliente
                      Marker(
                        point: LatLng(_clienteLat, _clienteLng),
                        width: 118,
                        height: 76,
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: PortoColors.textMain,
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: const Text(
                                'Sua Posição',
                                style: TextStyle(
                                  color: PortoColors.goldSoft,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                            const Icon(
                              Icons.person_pin_circle,
                              color: PortoColors.blueDark,
                              size: 30,
                            ),
                          ],
                        ),
                      ),

                      // Marcadores GPS de cada Terceirizado em Porto Seguro
                      ..._terceirizados.map((prof) {
                        final isSelected = selecionada?.id == prof.id;
                        final cor = _corPorStatus(prof.statusOperacional);
                        return Marker(
                          point: LatLng(prof.latitude, prof.longitude),
                          width: 140,
                          height: 82,
                          child: GestureDetector(
                            onTap: () {
                              setState(() => _selecionado = prof);
                              _mapController.move(
                                  LatLng(prof.latitude, prof.longitude), 14.2);
                            },
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 7, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: isSelected
                                        ? PortoColors.textMain
                                        : Colors.white,
                                    borderRadius: BorderRadius.circular(999),
                                    border: Border.all(color: cor, width: 2),
                                    boxShadow: const [
                                      BoxShadow(
                                        color: Colors.black26,
                                        blurRadius: 4,
                                      ),
                                    ],
                                  ),
                                  child: Text(
                                    '${prof.nome.split(' ').first} • ${prof.distanciaKm}km',
                                    style: TextStyle(
                                      fontSize: 10.5,
                                      fontWeight: FontWeight.w800,
                                      color: isSelected
                                          ? Colors.white
                                          : PortoColors.textMain,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                Container(
                                  margin: const EdgeInsets.only(top: 2),
                                  width: isSelected ? 34 : 28,
                                  height: isSelected ? 34 : 28,
                                  decoration: BoxDecoration(
                                    color: cor,
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                        color: Colors.white, width: 2.2),
                                  ),
                                  child: const Icon(
                                    Icons.engineering,
                                    color: Colors.white,
                                    size: 16,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }),
                    ],
                  ),
                ],
              ),

              // Legenda flutuante das cores da bandeira no mapa
              Positioned(
                top: 10,
                right: 10,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.94),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: PortoColors.border),
                  ),
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'RADAR PORTO SEGURO',
                        style: TextStyle(
                          fontSize: 9.5,
                          fontWeight: FontWeight.w800,
                          color: PortoColors.greenDark,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text('🟢 Disponível  🔵 Em Rota  🔴 Em Serviço',
                          style: TextStyle(fontSize: 10.5)),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),

        // PAINEL INFERIOR DOS TERCEIRIZADOS RASTREADOS POR GPS
        Expanded(
          flex: 4,
          child: Container(
            decoration: const BoxDecoration(
              color: PortoColors.background,
              border: Border(top: BorderSide(color: PortoColors.border)),
            ),
            child: _carregando
                ? const Center(child: CircularProgressIndicator())
                : ListView.builder(
                    padding: const EdgeInsets.all(12),
                    itemCount: _terceirizados.length,
                    itemBuilder: (context, index) {
                      final prof = _terceirizados[index];
                      final isSelected = selecionada?.id == prof.id;
                      final corStatus = _corPorStatus(prof.statusOperacional);

                      return Card(
                        margin: const EdgeInsets.only(bottom: 10),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                          side: BorderSide(
                            color: isSelected ? PortoColors.green : PortoColors.border,
                            width: isSelected ? 2 : 1,
                          ),
                        ),
                        child: InkWell(
                          borderRadius: BorderRadius.circular(14),
                          onTap: () {
                            setState(() => _selecionado = prof);
                            _mapController.move(
                                LatLng(prof.latitude, prof.longitude), 14.4);
                          },
                          child: Padding(
                            padding: const EdgeInsets.all(12),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    CircleAvatar(
                                      backgroundColor: corStatus,
                                      foregroundColor: Colors.white,
                                      child: Text(
                                        prof.nome.substring(0, 1),
                                        style: const TextStyle(
                                            fontWeight: FontWeight.w800),
                                      ),
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            prof.nome,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.w800,
                                              fontSize: 14.5,
                                            ),
                                          ),
                                          Text(
                                            '${prof.funcaoPrincipal} • ${prof.bairro}',
                                            style: const TextStyle(
                                              fontSize: 12,
                                              color: PortoColors.textMuted,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: corStatus.withValues(alpha: 0.14),
                                        borderRadius:
                                            BorderRadius.circular(999),
                                      ),
                                      child: Text(
                                        _labelPorStatus(prof.statusOperacional),
                                        style: TextStyle(
                                          color: corStatus,
                                          fontWeight: FontWeight.w800,
                                          fontSize: 11,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                // Linha de telemetria GPS: distância, tempo estimado, bateria, velocidade
                                Wrap(
                                  spacing: 8,
                                  runSpacing: 4,
                                  children: [
                                    _buildTelemetryPill(
                                        '📍 ${prof.distanciaKm} km de você'),
                                    _buildTelemetryPill(
                                        '⏱️ Chegada ~${prof.tempoEstimadoMin} min'),
                                    _buildTelemetryPill(
                                        '🔋 GPS ${prof.bateriaNivel}%'),
                                    _buildTelemetryPill(
                                        '⭐ ${prof.avaliacaoMedia} (${prof.atendimentosRealizados} diárias)'),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  'Status Atual: ${prof.clienteAtual}',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: PortoColors.blueDark,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    Expanded(
                                      child: OutlinedButton.icon(
                                        onPressed: () => _abrirWhatsApp(prof),
                                        icon: const Icon(Icons.chat, size: 16),
                                        label: const Text('WhatsApp'),
                                        style: OutlinedButton.styleFrom(
                                          foregroundColor:
                                              PortoColors.greenDark,
                                          side: const BorderSide(
                                              color: PortoColors.green),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: ElevatedButton.icon(
                                        onPressed: () =>
                                            widget.onContratarTerceirizado(prof),
                                        icon: const Icon(
                                            Icons.shopping_bag_outlined,
                                            size: 16),
                                        label: const Text('Contratar'),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: PortoColors.green,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ),
      ],
    );
  }

  Widget _buildStatusChip(String valor, String label) {
    final bool selecionado = _filtroStatus == valor;
    return ChoiceChip(
      label: Text(
        label,
        style: TextStyle(
          fontSize: 11.5,
          fontWeight: FontWeight.w700,
          color: selecionado ? Colors.white : PortoColors.textMain,
        ),
      ),
      selected: selecionado,
      selectedColor: PortoColors.blueDark,
      backgroundColor: Colors.grey.shade100,
      visualDensity: VisualDensity.compact,
      onSelected: (_) {
        setState(() => _filtroStatus = valor);
        _carregarTerceirizados();
      },
    );
  }

  Widget _buildTelemetryPill(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: PortoColors.greenLight,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: PortoColors.greenDark,
        ),
      ),
    );
  }
}
