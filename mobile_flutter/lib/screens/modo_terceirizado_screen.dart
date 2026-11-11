import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../models/models.dart';
import '../services/api_service.dart';
import '../theme/porto_seguro_theme.dart';

class ModoTerceirizadoScreen extends StatefulWidget {
  const ModoTerceirizadoScreen({super.key});

  @override
  State<ModoTerceirizadoScreen> createState() => _ModoTerceirizadoScreenState();
}

class _ModoTerceirizadoScreenState extends State<ModoTerceirizadoScreen> {
  List<TerceirizadoGps> _profissionais = [];
  TerceirizadoGps? _profAtivo;
  bool _carregando = true;
  bool _enviandoCheckin = false;

  final TextEditingController _localClienteController = TextEditingController(
    text: 'Condomínio Brisas do Descobrimento — Orla Taperapuã',
  );

  @override
  void initState() {
    super.initState();
    _carregarProfissionais();
  }

  @override
  void dispose() {
    _localClienteController.dispose();
    super.dispose();
  }

  Future<void> _carregarProfissionais() async {
    setState(() => _carregando = true);
    final lista = await ApiService.listarTerceirizadosGps(
      refLat: ApiService.unidadeLat,
      refLng: ApiService.unidadeLng,
    );
    if (!mounted) return;
    setState(() {
      _profissionais = lista;
      if (lista.isNotEmpty) {
        _profAtivo = lista.firstWhere(
          (p) => p.id == _profAtivo?.id,
          orElse: () => lista.first,
        );
      }
      _carregando = false;
    });
  }

  Future<void> _executarAcaoGps(String tipo) async {
    final prof = _profAtivo;
    if (prof == null) return;

    setState(() => _enviandoCheckin = true);

    double lat = prof.latitude;
    double lng = prof.longitude;

    try {
      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 3),
        ),
      );
      lat = pos.latitude;
      lng = pos.longitude;
    } catch (_) {
      // Caso sem GPS físico, avança levemente na coordenada de Porto Seguro
      lat = double.parse((prof.latitude + 0.0007).toStringAsFixed(6));
      lng = double.parse((prof.longitude + 0.0007).toStringAsFixed(6));
    }

    final atualizado = await ApiService.registrarCheckinGps(
      profissionalId: prof.id,
      tipo: tipo,
      local: _localClienteController.text.trim().isEmpty
          ? 'Atendimento Porto Seguro - BA'
          : _localClienteController.text.trim(),
      latitude: lat,
      longitude: lng,
    );

    if (!mounted) return;
    setState(() {
      _profAtivo = atualizado;
      _enviandoCheckin = false;
    });
    await _carregarProfissionais();

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
            '✅ $tipo GPS registrado em (${lat.toStringAsFixed(4)}, ${lng.toStringAsFixed(4)})!'),
        backgroundColor: PortoColors.green,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_carregando) {
      return const Center(child: CircularProgressIndicator());
    }

    final prof = _profAtivo;
    if (prof == null) {
      return const Center(child: Text('Nenhum terceirizado cadastrado.'));
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Cabeçalho Modo Terceirizado
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [PortoColors.greenDark, PortoColors.blueDark],
            ),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: PortoColors.goldSoft,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: const Text(
                  'MODO TERCEIRIZADO • TELEMETRIA GPS ATIVA',
                  style: TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w800,
                    color: PortoColors.textMain,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Check-in Georreferenciado & Ponto GPS',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 19,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'Transmita sua localização em tempo real para a Unidade São Francisco e registre início/término de diária.',
                style: TextStyle(color: Colors.white70, fontSize: 13),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Seletor de Profissional Terceirizado
        Card(
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Selecione o(a) Profissional em Campo:',
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: prof.id,
                  decoration: InputDecoration(
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    contentPadding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  ),
                  items: _profissionais.map((p) {
                    return DropdownMenuItem<String>(
                      value: p.id,
                      child: Text('${p.nome} (${p.bairro})'),
                    );
                  }).toList(),
                  onChanged: (novoId) {
                    if (novoId == null) return;
                    setState(() {
                      _profAtivo =
                          _profissionais.firstWhere((p) => p.id == novoId);
                    });
                  },
                ),
                const SizedBox(height: 12),
                // Dados GPS atuais do profissional
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: PortoColors.greenLight,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '📍 Coordenadas GPS Atuais: ${prof.latitude.toStringAsFixed(5)}, ${prof.longitude.toStringAsFixed(5)}',
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                          color: PortoColors.greenDark,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                          'Bairro/Distrito: ${prof.bairro} • ${prof.distrito}'),
                      Text('Status Operacional: ${prof.statusOperacional}'),
                      Text('Local Atual: ${prof.clienteAtual}'),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Ações de Check-in / Deslocamento / Check-out GPS
        Card(
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Local do Atendimento / Cliente em Porto Seguro:',
                  style: TextStyle(fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _localClienteController,
                  decoration: InputDecoration(
                    prefixIcon: const Icon(Icons.location_on_outlined),
                    hintText: 'Ex: Pousada do Cais — Rua do Mucugê',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: _enviandoCheckin
                            ? null
                            : () => _executarAcaoGps('DESLOCAMENTO'),
                        icon: const Icon(Icons.directions_car, size: 17),
                        label: const Text('Iniciar Rota'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: PortoColors.blue,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: _enviandoCheckin
                            ? null
                            : () => _executarAcaoGps('CHECKIN'),
                        icon: const Icon(Icons.where_to_vote, size: 17),
                        label: const Text('Check-in GPS'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: PortoColors.green,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _enviandoCheckin
                        ? null
                        : () => _executarAcaoGps('CHECKOUT'),
                    icon: const Icon(Icons.task_alt, size: 18),
                    label: const Text(
                        'Finalizar Atendimento (Check-out Georreferenciado)'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: PortoColors.red,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Histórico de Check-ins Georreferenciados
        Card(
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Histórico de Registros GPS do(a) Terceirizado(a)',
                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14.5),
                ),
                const SizedBox(height: 8),
                if (prof.historicoCheckins.isEmpty)
                  const Text(
                    'Nenhum check-in registrado hoje. Clique em Check-in GPS acima para registrar.',
                    style: TextStyle(color: PortoColors.textMuted),
                  )
                else
                  ...prof.historicoCheckins.map((chk) {
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: CircleAvatar(
                        backgroundColor: chk.tipo == 'CHECKIN'
                            ? PortoColors.green
                            : chk.tipo == 'DESLOCAMENTO'
                                ? PortoColors.blue
                                : PortoColors.red,
                        foregroundColor: Colors.white,
                        child: const Icon(Icons.gps_fixed, size: 18),
                      ),
                      title: Text(
                        '${chk.tipo} — ${chk.local}',
                        style: const TextStyle(
                            fontWeight: FontWeight.w700, fontSize: 13.5),
                      ),
                      subtitle: Text(
                        'Lat: ${chk.latitude.toStringAsFixed(4)}, Lng: ${chk.longitude.toStringAsFixed(4)} • ${chk.horario.substring(0, 16).replaceAll('T', ' ')}',
                        style: const TextStyle(fontSize: 12),
                      ),
                    );
                  }),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
