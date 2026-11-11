import 'package:flutter/material.dart';
import '../models/models.dart';
import '../services/api_service.dart';
import '../theme/porto_seguro_theme.dart';

class OrcamentoCepScreen extends StatefulWidget {
  const OrcamentoCepScreen({super.key});

  @override
  State<OrcamentoCepScreen> createState() => _OrcamentoCepScreenState();
}

class _OrcamentoCepScreenState extends State<OrcamentoCepScreen> {
  final _nomeCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _cpfCtrl = TextEditingController();
  final _telCtrl = TextEditingController();
  final _cepCtrl = TextEditingController(text: '45810-000');
  final _logradouroCtrl = TextEditingController(text: 'Rua do Cajueiro');
  final _bairroCtrl = TextEditingController(text: 'São Francisco');
  final _numeroCtrl = TextEditingController();
  String _servicoSelecionado = 'residencial-4h';
  String _mensagemCep =
      'Cobertura confirmada na Unidade Porto Seguro — São Francisco!';
  bool _aceitouTermos = true;
  bool _enviando = false;

  List<OrcamentoModel> _orcamentos = [];

  @override
  void initState() {
    super.initState();
    _carregarOrcamentos();
  }

  @override
  void dispose() {
    _nomeCtrl.dispose();
    _emailCtrl.dispose();
    _cpfCtrl.dispose();
    _telCtrl.dispose();
    _cepCtrl.dispose();
    _logradouroCtrl.dispose();
    _bairroCtrl.dispose();
    _numeroCtrl.dispose();
    super.dispose();
  }

  Future<void> _carregarOrcamentos() async {
    final lista = await ApiService.listarOrcamentos();
    if (!mounted) return;
    setState(() => _orcamentos = lista);
  }

  Future<void> _validarCep(String cep) async {
    _cepCtrl.text = cep;
    final res = await ApiService.consultarCep(cep);
    if (!mounted) return;
    setState(() {
      _logradouroCtrl.text = (res['logradouro'] ?? '').toString();
      _bairroCtrl.text = (res['bairro'] ?? 'São Francisco').toString();
      _mensagemCep = (res['mensagem'] ?? 'CEP confirmado!').toString();
    });
  }

  Future<void> _enviarOrcamento() async {
    if (_nomeCtrl.text.trim().isEmpty || _telCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Preencha seu Nome e Telefone/WhatsApp.'),
          backgroundColor: PortoColors.red,
        ),
      );
      return;
    }

    setState(() => _enviando = true);
    final plano = ApiService.planosOficiais.firstWhere(
      (p) => p.id == _servicoSelecionado,
      orElse: () => ApiService.planosOficiais.first,
    );

    final criado = await ApiService.criarOrcamento({
      'nome': _nomeCtrl.text.trim(),
      'email': _emailCtrl.text.trim().isEmpty
          ? 'cliente@portoseguro.com.br'
          : _emailCtrl.text.trim(),
      'cpf':
          _cpfCtrl.text.trim().isEmpty ? '000.000.000-00' : _cpfCtrl.text.trim(),
      'telefone': _telCtrl.text.trim(),
      'cep': _cepCtrl.text.trim(),
      'logradouro': _logradouroCtrl.text.trim(),
      'numero': _numeroCtrl.text.trim(),
      'bairro': _bairroCtrl.text.trim(),
      'servicoId': plano.id,
      'servicoTitulo': plano.titulo,
      'aceitouTermos': _aceitouTermos,
    });

    if (!mounted) return;
    setState(() => _enviando = false);
    await _carregarOrcamentos();

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
            '✅ Orçamento ${criado.protocolo} enviado para a unidade São Francisco!'),
        backgroundColor: PortoColors.green,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Solicite um orçamento com a Terceiriza Porto',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Toque em um CEP de Porto Seguro abaixo ou digite o seu:',
                  style: TextStyle(fontSize: 12.5, color: PortoColors.textMuted),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: [
                    ActionChip(
                      label: const Text('São Francisco (45810-000)',
                          style: TextStyle(fontSize: 11)),
                      onPressed: () => _validarCep('45810-000'),
                    ),
                    ActionChip(
                      label: const Text('Taperapuã (45810-002)',
                          style: TextStyle(fontSize: 11)),
                      onPressed: () => _validarCep('45810-002'),
                    ),
                    ActionChip(
                      label: const Text("Arraial d'Ajuda (45816-000)",
                          style: TextStyle(fontSize: 11)),
                      onPressed: () => _validarCep('45816-000'),
                    ),
                    ActionChip(
                      label: const Text('Trancoso (45818-000)',
                          style: TextStyle(fontSize: 11)),
                      onPressed: () => _validarCep('45818-000'),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: PortoColors.greenLight,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.verified,
                          color: PortoColors.green, size: 18),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _mensagemCep,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: PortoColors.greenDark,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _nomeCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Nome completo*',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _telCtrl,
                        decoration: const InputDecoration(
                          labelText: 'WhatsApp / Telefone*',
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: TextField(
                        controller: _cepCtrl,
                        onSubmitted: _validarCep,
                        decoration: const InputDecoration(
                          labelText: 'CEP*',
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: TextField(
                        controller: _logradouroCtrl,
                        decoration: const InputDecoration(
                          labelText: 'Logradouro (Rua / Av.)*',
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: TextField(
                        controller: _bairroCtrl,
                        decoration: const InputDecoration(
                          labelText: 'Bairro*',
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  value: _servicoSelecionado,
                  decoration: const InputDecoration(
                    labelText: 'Serviço desejado (Unidade Porto Seguro)',
                    border: OutlineInputBorder(),
                  ),
                  items: ApiService.planosOficiais.map((p) {
                    return DropdownMenuItem<String>(
                      value: p.id,
                      child: Text(
                        '${p.titulo} — R\$ ${p.preco.toStringAsFixed(0)}',
                        overflow: TextOverflow.ellipsis,
                      ),
                    );
                  }).toList(),
                  onChanged: (v) {
                    if (v != null) setState(() => _servicoSelecionado = v);
                  },
                ),
                const SizedBox(height: 8),
                CheckboxListTile(
                  contentPadding: EdgeInsets.zero,
                  value: _aceitouTermos,
                  activeColor: PortoColors.green,
                  title: const Text(
                    'Li e aceito os Termos de Uso da Terceiriza Porto',
                    style: TextStyle(fontSize: 12.5),
                  ),
                  onChanged: (v) => setState(() => _aceitouTermos = v ?? true),
                ),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _enviando ? null : _enviarOrcamento,
                    icon: const Icon(Icons.send),
                    label: Text(
                        _enviando ? 'Enviando...' : 'Solicitar Orçamento'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: PortoColors.red,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 14),

        // Últimos protocolos gerados
        Card(
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Protocolos de Orçamento Recentes (Porto Seguro)',
                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
                ),
                const SizedBox(height: 8),
                ..._orcamentos.map((orc) {
                  return ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: PortoColors.blueLight,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        orc.protocolo,
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                          fontSize: 11,
                          color: PortoColors.blueDark,
                        ),
                      ),
                    ),
                    title: Text(
                      '${orc.nome} • ${orc.servicoTitulo}',
                      style: const TextStyle(
                          fontWeight: FontWeight.w700, fontSize: 13.5),
                    ),
                    subtitle: Text(
                      '${orc.bairro} (${orc.cep}) • R\$ ${orc.valorTotal.toStringAsFixed(2)}',
                      style: const TextStyle(fontSize: 12),
                    ),
                    trailing: Text(
                      orc.status,
                      style: const TextStyle(
                        fontWeight: FontWeight.w800,
                        fontSize: 11,
                        color: PortoColors.green,
                      ),
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
