import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/models.dart';
import '../services/api_service.dart';
import '../theme/porto_seguro_theme.dart';

class DiariasPrecosScreen extends StatefulWidget {
  final TerceirizadoGps? terceirizadoPreSelecionado;

  const DiariasPrecosScreen({
    super.key,
    this.terceirizadoPreSelecionado,
  });

  @override
  State<DiariasPrecosScreen> createState() => _DiariasPrecosScreenState();
}

class _DiariasPrecosScreenState extends State<DiariasPrecosScreen> {
  String _filtro = 'todos';

  void _abrirModalContratacao(PlanoDiaria plano) {
    final prof = widget.terceirizadoPreSelecionado;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            left: 18,
            right: 18,
            top: 18,
            bottom: MediaQuery.of(context).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: PortoColors.greenLight,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: const Text(
                  'CHECKOUT RÁPIDO · UNIDADE PORTO SEGURO',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: PortoColors.greenDark,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                plano.titulo,
                style: const TextStyle(
                  fontSize: 19,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Valor da diária: R\$ ${plano.preco.toStringAsFixed(2).replaceAll('.', ',')} (+R\$ 30,00 aos fins de semana)',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: PortoColors.red,
                ),
              ),
              if (prof != null) ...[
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: PortoColors.blueLight,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.gps_fixed,
                          color: PortoColors.blueDark, size: 18),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Terceirizado(a) próximo(a): ${prof.nome} (${prof.distanciaKm} km • ${prof.bairro})',
                          style: const TextStyle(
                            fontWeight: FontWeight.w700,
                            fontSize: 12.5,
                            color: PortoColors.blueDark,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
              const SizedBox(height: 12),
              Text(
                plano.descricao,
                style: const TextStyle(
                  color: PortoColors.textMuted,
                  fontSize: 13,
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () async {
                    Navigator.pop(context);
                    final msg = Uri.encodeComponent(
                        'Olá Terceiriza Porto! Quero contratar pelo App: ${plano.titulo} (R\$ ${plano.preco.toStringAsFixed(2)})${prof != null ? " com ${prof.nome}" : ""} em Porto Seguro - BA.');
                    final uri =
                        Uri.parse('https://wa.me/5573999103388?text=$msg');
                    await launchUrl(uri, mode: LaunchMode.externalApplication);
                  },
                  icon: const Icon(Icons.check_circle_outline),
                  label: const Text('Confirmar Contratação (WhatsApp / PIX)'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: PortoColors.red,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final planos = _filtro == 'todos'
        ? ApiService.planosOficiais
        : ApiService.planosOficiais
            .where((p) => p.categoria == _filtro)
            .toList();

    return Column(
      children: [
        // Cabeçalho e Filtros
        Container(
          color: Colors.white,
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Quanto custa uma diarista em Porto Seguro?',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 4),
              const Text(
                'Preços oficiais da Unidade São Francisco (a partir de R\$ 169,00):',
                style: TextStyle(fontSize: 12.5, color: PortoColors.textMuted),
              ),
              if (widget.terceirizadoPreSelecionado != null) ...[
                const SizedBox(height: 8),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: PortoColors.greenLight,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '📍 Profissional vinculada no GPS: ${widget.terceirizadoPreSelecionado!.nome} (${widget.terceirizadoPreSelecionado!.bairro})',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: PortoColors.greenDark,
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 10),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _buildFilterBtn('todos', 'Todos (13)'),
                    const SizedBox(width: 6),
                    _buildFilterBtn('residencial', '🏠 Residencial'),
                    const SizedBox(width: 6),
                    _buildFilterBtn('comercial', '🏢 Comercial'),
                    const SizedBox(width: 6),
                    _buildFilterBtn('passadoria', '👔 Passadeira'),
                  ],
                ),
              ),
            ],
          ),
        ),

        // Lista de Cards de Preços
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(14),
            itemCount: planos.length,
            itemBuilder: (context, index) {
              final plano = planos[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                  side: BorderSide(
                    color: plano.destaquePopular
                        ? PortoColors.green
                        : PortoColors.border,
                    width: plano.destaquePopular ? 2 : 1,
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: PortoColors.blueLight,
                              borderRadius: BorderRadius.circular(999),
                            ),
                            child: Text(
                              'Porto Seguro • ${plano.metragemRecomendada}',
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: PortoColors.blueDark,
                              ),
                            ),
                          ),
                          if (plano.destaquePopular)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: PortoColors.red,
                                borderRadius: BorderRadius.circular(999),
                              ),
                              child: const Text(
                                'MAIS CONTRATADO',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              plano.titulo,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                          Text(
                            'R\$ ${plano.preco.toStringAsFixed(2).replaceAll('.', ',')}',
                            style: const TextStyle(
                              fontSize: 19,
                              fontWeight: FontWeight.w900,
                              color: PortoColors.greenDark,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        plano.descricao,
                        style: const TextStyle(
                          fontSize: 12.5,
                          color: PortoColors.textMuted,
                        ),
                      ),
                      const SizedBox(height: 10),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: () => _abrirModalContratacao(plano),
                          icon: const Icon(Icons.bolt, size: 17),
                          label: const Text('Contratar Diária'),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildFilterBtn(String valor, String label) {
    final ativo = _filtro == valor;
    return ChoiceChip(
      label: Text(
        label,
        style: TextStyle(
          fontWeight: FontWeight.w700,
          color: ativo ? Colors.white : PortoColors.textMain,
        ),
      ),
      selected: ativo,
      selectedColor: PortoColors.green,
      onSelected: (_) => setState(() => _filtro = valor),
    );
  }
}
