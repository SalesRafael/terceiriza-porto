import 'dart:convert';
import 'dart:math';
import 'package:http/http.dart' as http;
import '../models/models.dart';

class PontoReferenciaPorto {
  final String nome;
  final String cep;
  final double latitude;
  final double longitude;

  const PontoReferenciaPorto({
    required this.nome,
    required this.cep,
    required this.latitude,
    required this.longitude,
  });
}

class ApiService {
  static String baseUrl = 'http://100.48.192.161:3001/api';

  static const double unidadeLat = -16.4435;
  static const double unidadeLng = -39.0682;

  static const List<PontoReferenciaPorto> pontosPortoSeguro = [
    PontoReferenciaPorto(
      nome: 'São Francisco (Unidade)',
      cep: '45810-000',
      latitude: -16.4435,
      longitude: -39.0682,
    ),
    PontoReferenciaPorto(
      nome: 'Centro Histórico',
      cep: '45810-001',
      latitude: -16.4497,
      longitude: -39.0647,
    ),
    PontoReferenciaPorto(
      nome: 'Orla Taperapuã',
      cep: '45810-002',
      latitude: -16.3942,
      longitude: -39.0418,
    ),
    PontoReferenciaPorto(
      nome: 'Alto Mundaí',
      cep: '45810-004',
      latitude: -16.4165,
      longitude: -39.0512,
    ),
    PontoReferenciaPorto(
      nome: "Arraial d'Ajuda",
      cep: '45816-000',
      latitude: -16.4912,
      longitude: -39.0734,
    ),
    PontoReferenciaPorto(
      nome: 'Trancoso (Quadrado)',
      cep: '45818-000',
      latitude: -16.5886,
      longitude: -39.0928,
    ),
    PontoReferenciaPorto(
      nome: 'Caraíva',
      cep: '45819-000',
      latitude: -16.7965,
      longitude: -39.1472,
    ),
  ];

  // Fallback local caso o servidor Node não esteja acessível na mesma rede do celular
  static final List<TerceirizadoGps> _fallbackTerceirizados = [
    TerceirizadoGps(
      id: 'PROF-001',
      nome: 'Luciana Ferreira dos Santos',
      funcaoPrincipal: 'Diarista & Governança Hoteleira',
      celular: '(73) 99931-2040',
      cep: '45810-000',
      bairro: 'São Francisco',
      distrito: 'Porto Seguro (Sede)',
      cidade: 'Porto Seguro',
      latitude: -16.4428,
      longitude: -39.0674,
      statusOperacional: 'DISPONIVEL',
      clienteAtual: 'Base Unidade São Francisco (Pronta para saída)',
      servicoAtual: 'Limpeza Residencial / Passadoria',
      bateriaNivel: 94,
      velocidadeKmh: 0,
      precisaoMetros: 6,
      ultimaAtualizacaoGps: DateTime.now().toIso8601String(),
      modalidadePreferida: 'Profissional Parceiro(a)',
      servicosInteresse: [
        'Limpeza residencial',
        'Limpeza Empresarial',
        'Passar roupa'
      ],
      avaliacaoMedia: 4.95,
      atendimentosRealizados: 148,
      status: 'APROVADA',
      distanciaKm: 0.1,
      tempoEstimadoMin: 4,
      historicoCheckins: [
        CheckinGpsRecord(
          id: 'CHK-101',
          tipo: 'CHECKIN',
          local: 'Unidade São Francisco — Rua do Cajueiro, 29',
          latitude: -16.4428,
          longitude: -39.0674,
          horario: DateTime.now().toIso8601String(),
        ),
      ],
    ),
    TerceirizadoGps(
      id: 'PROF-002',
      nome: 'Edson Oliveira Batista',
      funcaoPrincipal: 'Especialista Pós-Obra & Revitalização de Pisos',
      celular: '(73) 98842-1190',
      cep: '45810-002',
      bairro: 'Taperapuã',
      distrito: 'Porto Seguro (Sede)',
      cidade: 'Porto Seguro',
      latitude: -16.3948,
      longitude: -39.0422,
      statusOperacional: 'EM_ATENDIMENTO',
      clienteAtual: 'Condomínio Brisas do Descobrimento — Taperapuã',
      servicoAtual: 'Limpeza Pós-Obra · 8h',
      bateriaNivel: 82,
      velocidadeKmh: 0,
      precisaoMetros: 5,
      ultimaAtualizacaoGps: DateTime.now().toIso8601String(),
      modalidadePreferida: 'Profissional Celetista',
      servicosInteresse: ['Limpeza Pós-obra', 'Limpeza Empresarial'],
      avaliacaoMedia: 4.92,
      atendimentosRealizados: 94,
      status: 'APROVADA',
      distanciaKm: 6.1,
      tempoEstimadoMin: 13,
      historicoCheckins: [
        CheckinGpsRecord(
          id: 'CHK-102',
          tipo: 'CHECKIN',
          local: 'Condomínio Brisas do Descobrimento — Taperapuã',
          latitude: -16.3948,
          longitude: -39.0422,
          horario: DateTime.now().toIso8601String(),
        ),
      ],
    ),
    TerceirizadoGps(
      id: 'PROF-003',
      nome: 'Cláudia Nascimento Rocha',
      funcaoPrincipal: 'Camareira & Limpeza de Temporada',
      celular: '(73) 99974-6310',
      cep: '45816-000',
      bairro: "Arraial d'Ajuda",
      distrito: "Arraial d'Ajuda",
      cidade: 'Porto Seguro',
      latitude: -16.4915,
      longitude: -39.0738,
      statusOperacional: 'EM_DESLOCAMENTO',
      clienteAtual: "A caminho de Rua do Mucugê, 245 — Arraial d'Ajuda",
      servicoAtual: 'Limpeza Residencial · 6h',
      bateriaNivel: 88,
      velocidadeKmh: 26,
      precisaoMetros: 8,
      ultimaAtualizacaoGps: DateTime.now().toIso8601String(),
      modalidadePreferida: 'Profissional Parceiro(a)',
      servicosInteresse: [
        'Limpeza residencial',
        'Passar roupa',
        'Limpeza Empresarial'
      ],
      avaliacaoMedia: 4.98,
      atendimentosRealizados: 210,
      status: 'APROVADA',
      distanciaKm: 5.4,
      tempoEstimadoMin: 12,
      historicoCheckins: [],
    ),
    TerceirizadoGps(
      id: 'PROF-004',
      nome: 'Janaína Pataxó Silva',
      funcaoPrincipal: 'Auxiliar de Limpeza & Copeira Terceirizada',
      celular: '(73) 99850-4120',
      cep: '45810-004',
      bairro: 'Alto Mundaí',
      distrito: 'Porto Seguro (Sede)',
      cidade: 'Porto Seguro',
      latitude: -16.4168,
      longitude: -39.0518,
      statusOperacional: 'DISPONIVEL',
      clienteAtual: 'Disponível na região Alto Mundaí / Orla',
      servicoAtual: 'Terceirização / Limpeza Comercial',
      bateriaNivel: 91,
      velocidadeKmh: 0,
      precisaoMetros: 5,
      ultimaAtualizacaoGps: DateTime.now().toIso8601String(),
      modalidadePreferida: 'Profissional Celetista',
      servicosInteresse: ['Limpeza Empresarial', 'Limpeza residencial'],
      avaliacaoMedia: 4.91,
      atendimentosRealizados: 118,
      status: 'APROVADA',
      distanciaKm: 3.4,
      tempoEstimadoMin: 8,
      historicoCheckins: [],
    ),
    TerceirizadoGps(
      id: 'PROF-005',
      nome: 'Marcos Vinícius Santana',
      funcaoPrincipal: 'Técnico em Esquadrias, Vidros & Sanitização',
      celular: '(73) 99128-9055',
      cep: '45818-000',
      bairro: 'Trancoso',
      distrito: 'Trancoso',
      cidade: 'Porto Seguro',
      latitude: -16.5882,
      longitude: -39.0921,
      statusOperacional: 'EM_ATENDIMENTO',
      clienteAtual: 'Villa Boutique Quadrado — Trancoso',
      servicoAtual: 'Revitalização de Esquadrias & Limpeza de Vidros',
      bateriaNivel: 77,
      velocidadeKmh: 0,
      precisaoMetros: 7,
      ultimaAtualizacaoGps: DateTime.now().toIso8601String(),
      modalidadePreferida: 'Profissional Parceiro(a)',
      servicosInteresse: ['Limpeza Pós-obra', 'Limpeza Empresarial'],
      avaliacaoMedia: 4.96,
      atendimentosRealizados: 87,
      status: 'APROVADA',
      distanciaKm: 16.3,
      tempoEstimadoMin: 35,
      historicoCheckins: [],
    ),
    TerceirizadoGps(
      id: 'PROF-006',
      nome: 'Patrícia Gomes de Jesus',
      funcaoPrincipal: 'Passadeira & Diarista Residencial',
      celular: '(73) 99902-7741',
      cep: '45810-001',
      bairro: 'Centro',
      distrito: 'Porto Seguro (Sede)',
      cidade: 'Porto Seguro',
      latitude: -16.4492,
      longitude: -39.0641,
      statusOperacional: 'DISPONIVEL',
      clienteAtual: 'Disponível no Centro / Areião / São Francisco',
      servicoAtual: 'Passadeira Residencial · 4h / 6h',
      bateriaNivel: 97,
      velocidadeKmh: 0,
      precisaoMetros: 4,
      ultimaAtualizacaoGps: DateTime.now().toIso8601String(),
      modalidadePreferida: 'Profissional Parceiro(a)',
      servicosInteresse: ['Passar roupa', 'Limpeza residencial'],
      avaliacaoMedia: 4.94,
      atendimentosRealizados: 132,
      status: 'APROVADA',
      distanciaKm: 0.8,
      tempoEstimadoMin: 4,
      historicoCheckins: [],
    ),
  ];

  static final List<PlanoDiaria> planosOficiais = [
    PlanoDiaria(
      id: 'comercial-2h',
      titulo: 'Limpeza comercial · 2h',
      categoria: 'comercial',
      horas: 2,
      prestadores: 1,
      metragemRecomendada: 'até 30m²',
      preco: 169.0,
      extraFimDeSemana: 30.0,
      descricao:
          'Limpeza 02 horas | 01 Prestador | Recomendado para ambiente comercial de até 30m² Extra fim de semana: R\$ 30,00.',
    ),
    PlanoDiaria(
      id: 'comercial-4h',
      titulo: 'Limpeza comercial · 4h',
      categoria: 'comercial',
      horas: 4,
      prestadores: 1,
      metragemRecomendada: 'até 60m²',
      preco: 199.0,
      extraFimDeSemana: 30.0,
      descricao:
          'Limpeza 04 horas | 01 Prestador | Recomendado para ambiente comercial de até 60m² Extra fim de semana: R\$ 30,00.',
    ),
    PlanoDiaria(
      id: 'comercial-6h',
      titulo: 'Limpeza comercial · 6h',
      categoria: 'comercial',
      horas: 6,
      prestadores: 1,
      metragemRecomendada: 'até 90m²',
      preco: 239.0,
      extraFimDeSemana: 30.0,
      descricao:
          'Limpeza 06 horas | 01 Prestador | Recomendado para ambiente comercial de até 90m² Extra fim de semana: R\$ 30,00.',
    ),
    PlanoDiaria(
      id: 'comercial-8h',
      titulo: 'Limpeza comercial · 8h',
      categoria: 'comercial',
      horas: 8,
      prestadores: 1,
      metragemRecomendada: 'até 120m²',
      preco: 289.0,
      extraFimDeSemana: 30.0,
      descricao:
          'Limpeza 08 horas | 01 Prestador | Recomendado para ambiente comercial de até 120m² Extra fim de semana: R\$ 30,00.',
    ),
    PlanoDiaria(
      id: 'residencial-2h',
      titulo: 'Limpeza residencial · 2h',
      categoria: 'residencial',
      horas: 2,
      prestadores: 1,
      metragemRecomendada: 'até 30m²',
      preco: 169.0,
      extraFimDeSemana: 30.0,
      descricao:
          'Limpeza 02 horas | 01 Prestador | Recomendado para ambiente residencial de até 30m² Extra fim de semana: R\$ 30,00.',
    ),
    PlanoDiaria(
      id: 'residencial-4h',
      titulo: 'Limpeza residencial · 4h',
      categoria: 'residencial',
      horas: 4,
      prestadores: 1,
      metragemRecomendada: 'até 50m²',
      preco: 189.0,
      extraFimDeSemana: 30.0,
      destaquePopular: true,
      descricao:
          'Limpeza 04 horas | 01 Prestador | Recomendado para ambiente residencial de até 50m² Extra fim de semana: R\$ 30,00.',
    ),
    PlanoDiaria(
      id: 'residencial-6h',
      titulo: 'Limpeza residencial · 6h',
      categoria: 'residencial',
      horas: 6,
      prestadores: 1,
      metragemRecomendada: 'até 80m²',
      preco: 239.0,
      extraFimDeSemana: 30.0,
      descricao:
          'Limpeza 06 horas | 01 Prestador | Recomendado para ambiente residencial de até 80m² Extra fim de semana: R\$ 30,00.',
    ),
    PlanoDiaria(
      id: 'residencial-8h',
      titulo: 'Limpeza residencial · 8h',
      categoria: 'residencial',
      horas: 8,
      prestadores: 1,
      metragemRecomendada: 'até 120m²',
      preco: 289.0,
      extraFimDeSemana: 30.0,
      destaquePopular: true,
      descricao:
          'Limpeza 08 horas | 01 Prestador | Recomendado para ambiente residencial de até 120m² Extra fim de semana: R\$ 30,00.',
    ),
    PlanoDiaria(
      id: 'residencial-8h-2p',
      titulo: 'Limpeza residencial · 8h · 2 profissionais',
      categoria: 'residencial',
      horas: 8,
      prestadores: 2,
      metragemRecomendada: 'até 200m²',
      preco: 550.0,
      extraFimDeSemana: 30.0,
      descricao:
          'Limpeza 08 horas | 02 Prestadores | Recomendado para ambiente residencial até 200m² Extra fim de semana: R\$ 30,00.',
    ),
    PlanoDiaria(
      id: 'residencial-8h-3p',
      titulo: 'Limpeza residencial · 8h · 3 profissionais',
      categoria: 'residencial',
      horas: 8,
      prestadores: 3,
      metragemRecomendada: 'até 300m²',
      preco: 830.0,
      extraFimDeSemana: 30.0,
      descricao:
          'Limpeza 08 horas | 03 Prestadores | Recomendado para ambiente residencial até 300m² Extra fim de semana: R\$ 30,00.',
    ),
    PlanoDiaria(
      id: 'passadeira-4h',
      titulo: 'Passadeira residencial · 4h',
      categoria: 'passadoria',
      horas: 4,
      prestadores: 1,
      metragemRecomendada: 'Até 25 peças',
      preco: 189.0,
      extraFimDeSemana: 30.0,
      descricao:
          'Passadeira 04 horas | 01 Prestador Extra fim de semana: R\$ 30,00.',
    ),
    PlanoDiaria(
      id: 'passadeira-6h',
      titulo: 'Passadeira residencial · 6h',
      categoria: 'passadoria',
      horas: 6,
      prestadores: 1,
      metragemRecomendada: 'Até 40 peças',
      preco: 239.0,
      extraFimDeSemana: 30.0,
      descricao:
          'Passadeira 06 horas | 01 Prestador Extra fim de semana: R\$ 30,00.',
    ),
    PlanoDiaria(
      id: 'passadeira-8h',
      titulo: 'Passadeira residencial · 8h',
      categoria: 'passadoria',
      horas: 8,
      prestadores: 1,
      metragemRecomendada: 'Até 60 peças',
      preco: 289.0,
      extraFimDeSemana: 30.0,
      descricao:
          'Passadeira 08 horas | 01 Prestador Extra fim de semana: R\$ 30,00.',
    ),
  ];

  static final List<OrcamentoModel> _fallbackOrcamentos = [
    OrcamentoModel(
      id: 'ORC-2026-001',
      protocolo: 'TP-2026-8401',
      nome: 'Mariana Costa Figueiredo',
      telefone: '(73) 99812-4401',
      cep: '45810-002',
      bairro: 'Taperapuã',
      servicoTitulo: 'Limpeza residencial · 8h',
      dataDesejada: '2026-11-14',
      valorTotal: 319.0,
      status: 'CONFIRMADO',
    ),
    OrcamentoModel(
      id: 'ORC-2026-002',
      protocolo: 'TP-2026-8402',
      nome: 'Roberto Almeida Nascimento',
      telefone: '(73) 99945-7720',
      cep: '45810-000',
      bairro: 'São Francisco',
      servicoTitulo: 'Terceirização (Contrato 12 meses)',
      dataDesejada: '2026-11-18',
      valorTotal: 2890.0,
      status: 'EM_ANALISE',
    ),
  ];

  static double calcularDistanciaKm(
      double lat1, double lon1, double lat2, double lon2) {
    const double r = 6371.0;
    final double dLat = (lat2 - lat1) * pi / 180.0;
    final double dLon = (lon2 - lon1) * pi / 180.0;
    final double a = sin(dLat / 2) * sin(dLat / 2) +
        cos(lat1 * pi / 180.0) *
            cos(lat2 * pi / 180.0) *
            sin(dLon / 2) *
            sin(dLon / 2);
    final double c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return double.parse((r * c).toStringAsFixed(2));
  }

  static int calcularEtaMin(double distKm) {
    return max(4, ((distKm / 28.0) * 60.0).round());
  }

  static List<TerceirizadoGps> _ordenarPorDistancia(
      List<TerceirizadoGps> lista, double refLat, double refLng) {
    for (final p in lista) {
      p.distanciaKm =
          calcularDistanciaKm(refLat, refLng, p.latitude, p.longitude);
      p.tempoEstimadoMin = calcularEtaMin(p.distanciaKm);
    }
    lista.sort((a, b) => a.distanciaKm.compareTo(b.distanciaKm));
    return lista;
  }

  static Future<List<TerceirizadoGps>> listarTerceirizadosGps({
    required double refLat,
    required double refLng,
    String status = 'TODOS',
  }) async {
    try {
      final uri = Uri.parse(
          '$baseUrl/geolocalizacao/terceirizados?lat=$refLat&lng=$refLng&status=$status');
      final response =
          await http.get(uri).timeout(const Duration(milliseconds: 2200));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        final rawList = data['terceirizados'] as List<dynamic>? ?? [];
        return rawList
            .map((e) => TerceirizadoGps.fromJson(e as Map<String, dynamic>))
            .toList();
      }
    } catch (_) {
      // Usa estado local caso offline
    }

    var copia = _ordenarPorDistancia(
        List<TerceirizadoGps>.from(_fallbackTerceirizados), refLat, refLng);
    if (status != 'TODOS') {
      copia = copia.where((p) => p.statusOperacional == status).toList();
    }
    return copia;
  }

  static Future<List<TerceirizadoGps>> simularMovimentoGps({
    required double refLat,
    required double refLng,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/geolocalizacao/simular-movimento');
      final response =
          await http.post(uri).timeout(const Duration(milliseconds: 2200));
      if (response.statusCode == 200) {
        return listarTerceirizadosGps(refLat: refLat, refLng: refLng);
      }
    } catch (_) {
      // Fallback local: movimenta terceirizados nas vias de Porto Seguro
    }

    final rng = Random();
    for (final p in _fallbackTerceirizados) {
      p.latitude = double.parse(
          (p.latitude + (rng.nextDouble() - 0.48) * 0.003).toStringAsFixed(6));
      p.longitude = double.parse(
          (p.longitude + (rng.nextDouble() - 0.48) * 0.003).toStringAsFixed(6));
      p.ultimaAtualizacaoGps = DateTime.now().toIso8601String();
      if (p.statusOperacional == 'EM_DESLOCAMENTO') {
        p.velocidadeKmh = 18 + rng.nextInt(22);
      }
    }
    return _ordenarPorDistancia(
        List<TerceirizadoGps>.from(_fallbackTerceirizados), refLat, refLng);
  }

  static Future<TerceirizadoGps> registrarCheckinGps({
    required String profissionalId,
    required String tipo,
    required String local,
    required double latitude,
    required double longitude,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/profissionais/$profissionalId/checkin');
      final response = await http
          .post(
            uri,
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'tipo': tipo,
              'local': local,
              'latitude': latitude,
              'longitude': longitude,
            }),
          )
          .timeout(const Duration(milliseconds: 2500));

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        return TerceirizadoGps.fromJson(
            data['profissional'] as Map<String, dynamic>);
      }
    } catch (_) {
      // Fallback local
    }

    final prof = _fallbackTerceirizados.firstWhere(
      (p) => p.id == profissionalId,
      orElse: () => _fallbackTerceirizados.first,
    );
    prof.latitude = latitude;
    prof.longitude = longitude;
    prof.ultimaAtualizacaoGps = DateTime.now().toIso8601String();
    if (tipo == 'CHECKIN') {
      prof.statusOperacional = 'EM_ATENDIMENTO';
      prof.clienteAtual = local;
      prof.velocidadeKmh = 0;
    } else if (tipo == 'DESLOCAMENTO') {
      prof.statusOperacional = 'EM_DESLOCAMENTO';
      prof.clienteAtual = 'Em rota para: $local';
      prof.velocidadeKmh = 26;
    } else {
      prof.statusOperacional = 'DISPONIVEL';
      prof.clienteAtual = 'Check-out concluído ($local)';
      prof.velocidadeKmh = 0;
      prof.atendimentosRealizados += 1;
    }
    prof.historicoCheckins.insert(
      0,
      CheckinGpsRecord(
        id: 'CHK-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
        tipo: tipo,
        local: local,
        latitude: latitude,
        longitude: longitude,
        horario: DateTime.now().toIso8601String(),
      ),
    );
    return prof;
  }

  static Future<Map<String, dynamic>> consultarCep(String cep) async {
    try {
      final uri = Uri.parse('$baseUrl/cep/$cep');
      final response =
          await http.get(uri).timeout(const Duration(milliseconds: 2200));
      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      }
    } catch (_) {}

    final limpo = cep.replaceAll(RegExp(r'\D'), '');
    if (limpo == '45810002') {
      return {
        'valido': true,
        'cep': '45810-002',
        'logradouro': 'Avenida Beira Mar (Orla Norte)',
        'bairro': 'Taperapuã',
        'distrito': 'Porto Seguro (Sede)',
        'latitude': -16.3942,
        'longitude': -39.0418,
        'mensagem': 'Cobertura confirmada na Orla Norte (Taperapuã)!'
      };
    }
    if (limpo == '45816000') {
      return {
        'valido': true,
        'cep': '45816-000',
        'logradouro': 'Rua do Mucugê',
        'bairro': "Arraial d'Ajuda",
        'distrito': "Arraial d'Ajuda",
        'latitude': -16.4912,
        'longitude': -39.0734,
        'mensagem': "Cobertura confirmada em Arraial d'Ajuda!"
      };
    }
    if (limpo == '45818000') {
      return {
        'valido': true,
        'cep': '45818-000',
        'logradouro': 'Praça São João Batista (Quadrado)',
        'bairro': 'Trancoso',
        'distrito': 'Trancoso',
        'latitude': -16.5886,
        'longitude': -39.0928,
        'mensagem': 'Cobertura confirmada em Trancoso!'
      };
    }
    return {
      'valido': true,
      'cep': cep,
      'logradouro': 'Rua do Cajueiro',
      'bairro': 'São Francisco',
      'distrito': 'Porto Seguro (Sede)',
      'latitude': -16.4435,
      'longitude': -39.0682,
      'mensagem': 'Cobertura confirmada na Unidade Porto Seguro - BA!'
    };
  }

  static Future<OrcamentoModel> criarOrcamento(
      Map<String, dynamic> payload) async {
    try {
      final uri = Uri.parse('$baseUrl/orcamentos');
      final response = await http
          .post(
            uri,
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(payload),
          )
          .timeout(const Duration(milliseconds: 2500));
      if (response.statusCode == 201) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        return OrcamentoModel.fromJson(
            data['orcamento'] as Map<String, dynamic>);
      }
    } catch (_) {}

    final novo = OrcamentoModel(
      id: 'ORC-2026-00${_fallbackOrcamentos.length + 1}',
      protocolo: 'TP-2026-${8400 + _fallbackOrcamentos.length + 1}',
      nome: (payload['nome'] ?? 'Cliente Porto Seguro').toString(),
      telefone: (payload['telefone'] ?? '(73) 99999-9999').toString(),
      cep: (payload['cep'] ?? '45810-000').toString(),
      bairro: (payload['bairro'] ?? 'São Francisco').toString(),
      servicoTitulo:
          (payload['servicoTitulo'] ?? 'Limpeza residencial · 4h').toString(),
      dataDesejada: (payload['dataDesejada'] ?? '2026-11-15').toString(),
      valorTotal: 189.0,
      status: 'CONFIRMADO',
    );
    _fallbackOrcamentos.insert(0, novo);
    return novo;
  }

  static Future<List<OrcamentoModel>> listarOrcamentos() async {
    try {
      final uri = Uri.parse('$baseUrl/orcamentos');
      final response =
          await http.get(uri).timeout(const Duration(milliseconds: 2200));
      if (response.statusCode == 200) {
        final list = jsonDecode(response.body) as List<dynamic>;
        return list
            .map((e) => OrcamentoModel.fromJson(e as Map<String, dynamic>))
            .toList();
      }
    } catch (_) {}
    return _fallbackOrcamentos;
  }
}
