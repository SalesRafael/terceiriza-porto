import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'models/models.dart';
import 'screens/diarias_precos_screen.dart';
import 'screens/mapa_terceirizados_screen.dart';
import 'screens/modo_terceirizado_screen.dart';
import 'screens/orcamento_cep_screen.dart';
import 'theme/porto_seguro_theme.dart';

void main() {
  runApp(const TerceirizaPortoApp());
}

class TerceirizaPortoApp extends StatelessWidget {
  const TerceirizaPortoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Terceiriza Porto — Porto Seguro (BA)',
      debugShowCheckedModeBanner: false,
      theme: buildPortoSeguroTheme(),
      home: const HomeShellScreen(),
    );
  }
}

class HomeShellScreen extends StatefulWidget {
  const HomeShellScreen({super.key});

  @override
  State<HomeShellScreen> createState() => _HomeShellScreenState();
}

class _HomeShellScreenState extends State<HomeShellScreen> {
  int _abaAtual = 0;
  TerceirizadoGps? _terceirizadoSelecionado;

  void _irParaContratacaoComTerceirizado(TerceirizadoGps prof) {
    setState(() {
      _terceirizadoSelecionado = prof;
      _abaAtual = 1; // Vai para a aba de Diárias & Preços com o profissional vinculado
    });
  }

  Future<void> _abrirWhatsAppUnidade() async {
    final uri = Uri.parse(
        'https://wa.me/5573999103388?text=Ol%C3%A1!%20Estou%20no%20aplicativo%20Terceiriza%20Porto%20(Porto%20Seguro%20-%20BA).');
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final paginas = [
      MapaTerceirizadosScreen(
        onContratarTerceirizado: _irParaContratacaoComTerceirizado,
      ),
      DiariasPrecosScreen(
        terceirizadoPreSelecionado: _terceirizadoSelecionado,
      ),
      const OrcamentoCepScreen(),
      const ModoTerceirizadoScreen(),
    ];

    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(66),
        child: Column(
          children: [
            const PortoFlagRibbon(height: 5),
            Expanded(
              child: AppBar(
                titleSpacing: 12,
                title: const Row(
                  children: [
                    PortoFlagBadge(size: 32),
                    SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Terceiriza Porto',
                            style: TextStyle(
                              fontWeight: FontWeight.w900,
                              fontSize: 17,
                              letterSpacing: -0.3,
                            ),
                          ),
                          Text(
                            'PORTO SEGURO · BA • SÃO FRANCISCO (GPS ATIVO)',
                            style: TextStyle(
                              fontSize: 9.5,
                              color: PortoColors.goldSoft,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                actions: [
                  IconButton(
                    tooltip: 'WhatsApp (73) 99910-3388',
                    onPressed: _abrirWhatsAppUnidade,
                    icon: const Icon(Icons.support_agent),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      body: paginas[_abaAtual],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _abaAtual,
        backgroundColor: Colors.white,
        indicatorColor: PortoColors.greenLight,
        onDestinationSelected: (idx) => setState(() => _abaAtual = idx),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.radar),
            selectedIcon:
                Icon(Icons.radar, color: PortoColors.greenDark),
            label: 'Mapa GPS',
          ),
          NavigationDestination(
            icon: Icon(Icons.cleaning_services_outlined),
            selectedIcon: Icon(Icons.cleaning_services,
                color: PortoColors.greenDark),
            label: 'Diárias R\$169+',
          ),
          NavigationDestination(
            icon: Icon(Icons.request_quote_outlined),
            selectedIcon: Icon(Icons.request_quote,
                color: PortoColors.greenDark),
            label: 'Orçamento CEP',
          ),
          NavigationDestination(
            icon: Icon(Icons.where_to_vote_outlined),
            selectedIcon: Icon(Icons.where_to_vote,
                color: PortoColors.greenDark),
            label: 'Check-in GPS',
          ),
        ],
      ),
    );
  }
}
