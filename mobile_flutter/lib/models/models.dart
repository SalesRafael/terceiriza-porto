class CheckinGpsRecord {
  final String id;
  final String tipo; // CHECKIN, DESLOCAMENTO, CHECKOUT
  final String local;
  final double latitude;
  final double longitude;
  final String horario;

  CheckinGpsRecord({
    required this.id,
    required this.tipo,
    required this.local,
    required this.latitude,
    required this.longitude,
    required this.horario,
  });

  factory CheckinGpsRecord.fromJson(Map<String, dynamic> json) {
    return CheckinGpsRecord(
      id: (json['id'] ?? 'CHK-001').toString(),
      tipo: (json['tipo'] ?? 'CHECKIN').toString(),
      local: (json['local'] ?? 'Porto Seguro - BA').toString(),
      latitude: (json['latitude'] as num?)?.toDouble() ?? -16.4435,
      longitude: (json['longitude'] as num?)?.toDouble() ?? -39.0682,
      horario: (json['horario'] ?? DateTime.now().toIso8601String()).toString(),
    );
  }
}

class TerceirizadoGps {
  final String id;
  final String nome;
  final String funcaoPrincipal;
  final String celular;
  final String cep;
  final String bairro;
  final String distrito;
  final String cidade;
  double latitude;
  double longitude;
  String statusOperacional; // DISPONIVEL, EM_DESLOCAMENTO, EM_ATENDIMENTO
  String clienteAtual;
  String servicoAtual;
  int bateriaNivel;
  int velocidadeKmh;
  int precisaoMetros;
  String ultimaAtualizacaoGps;
  final String modalidadePreferida;
  final List<String> servicosInteresse;
  final double avaliacaoMedia;
  int atendimentosRealizados;
  final String status;
  double distanciaKm;
  int tempoEstimadoMin;
  List<CheckinGpsRecord> historicoCheckins;

  TerceirizadoGps({
    required this.id,
    required this.nome,
    required this.funcaoPrincipal,
    required this.celular,
    required this.cep,
    required this.bairro,
    required this.distrito,
    required this.cidade,
    required this.latitude,
    required this.longitude,
    required this.statusOperacional,
    required this.clienteAtual,
    required this.servicoAtual,
    required this.bateriaNivel,
    required this.velocidadeKmh,
    required this.precisaoMetros,
    required this.ultimaAtualizacaoGps,
    required this.modalidadePreferida,
    required this.servicosInteresse,
    required this.avaliacaoMedia,
    required this.atendimentosRealizados,
    required this.status,
    required this.distanciaKm,
    required this.tempoEstimadoMin,
    required this.historicoCheckins,
  });

  factory TerceirizadoGps.fromJson(Map<String, dynamic> json) {
    final rawServicos = json['servicosInteresse'] as List<dynamic>? ?? [];
    final rawCheckins = json['historicoCheckins'] as List<dynamic>? ?? [];
    return TerceirizadoGps(
      id: (json['id'] ?? '').toString(),
      nome: (json['nome'] ?? '').toString(),
      funcaoPrincipal:
          (json['funcaoPrincipal'] ?? 'Profissional Terceirizado(a)').toString(),
      celular: (json['celular'] ?? '(73) 99910-3388').toString(),
      cep: (json['cep'] ?? '45810-000').toString(),
      bairro: (json['bairro'] ?? 'São Francisco').toString(),
      distrito: (json['distrito'] ?? 'Porto Seguro (Sede)').toString(),
      cidade: (json['cidade'] ?? 'Porto Seguro').toString(),
      latitude: (json['latitude'] as num?)?.toDouble() ?? -16.4435,
      longitude: (json['longitude'] as num?)?.toDouble() ?? -39.0682,
      statusOperacional:
          (json['statusOperacional'] ?? 'DISPONIVEL').toString(),
      clienteAtual:
          (json['clienteAtual'] ?? 'Base Unidade São Francisco').toString(),
      servicoAtual:
          (json['servicoAtual'] ?? 'Limpeza Residencial').toString(),
      bateriaNivel: (json['bateriaNivel'] as num?)?.toInt() ?? 92,
      velocidadeKmh: (json['velocidadeKmh'] as num?)?.toInt() ?? 0,
      precisaoMetros: (json['precisaoMetros'] as num?)?.toInt() ?? 5,
      ultimaAtualizacaoGps:
          (json['ultimaAtualizacaoGps'] ?? DateTime.now().toIso8601String())
              .toString(),
      modalidadePreferida:
          (json['modalidadePreferida'] ?? 'Profissional Parceiro(a)').toString(),
      servicosInteresse: rawServicos.map((e) => e.toString()).toList(),
      avaliacaoMedia: (json['avaliacaoMedia'] as num?)?.toDouble() ?? 4.95,
      atendimentosRealizados:
          (json['atendimentosRealizados'] as num?)?.toInt() ?? 50,
      status: (json['status'] ?? 'APROVADA').toString(),
      distanciaKm: (json['distanciaKm'] as num?)?.toDouble() ?? 0.5,
      tempoEstimadoMin: (json['tempoEstimadoMin'] as num?)?.toInt() ?? 5,
      historicoCheckins: rawCheckins
          .map((e) => CheckinGpsRecord.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class PlanoDiaria {
  final String id;
  final String titulo;
  final String categoria;
  final int horas;
  final int prestadores;
  final String metragemRecomendada;
  final double preco;
  final double extraFimDeSemana;
  final bool destaquePopular;
  final String descricao;

  PlanoDiaria({
    required this.id,
    required this.titulo,
    required this.categoria,
    required this.horas,
    required this.prestadores,
    required this.metragemRecomendada,
    required this.preco,
    required this.extraFimDeSemana,
    this.destaquePopular = false,
    required this.descricao,
  });

  factory PlanoDiaria.fromJson(Map<String, dynamic> json) {
    return PlanoDiaria(
      id: (json['id'] ?? '').toString(),
      titulo: (json['titulo'] ?? '').toString(),
      categoria: (json['categoria'] ?? 'residencial').toString(),
      horas: (json['horas'] as num?)?.toInt() ?? 4,
      prestadores: (json['prestadores'] as num?)?.toInt() ?? 1,
      metragemRecomendada: (json['metragemRecomendada'] ?? 'até 50m²').toString(),
      preco: (json['preco'] as num?)?.toDouble() ?? 169.0,
      extraFimDeSemana: (json['extraFimDeSemana'] as num?)?.toDouble() ?? 30.0,
      destaquePopular: json['destaquePopular'] == true,
      descricao: (json['descricao'] ?? '').toString(),
    );
  }
}

class OrcamentoModel {
  final String id;
  final String protocolo;
  final String nome;
  final String telefone;
  final String cep;
  final String bairro;
  final String servicoTitulo;
  final String dataDesejada;
  final double valorTotal;
  final String status;

  OrcamentoModel({
    required this.id,
    required this.protocolo,
    required this.nome,
    required this.telefone,
    required this.cep,
    required this.bairro,
    required this.servicoTitulo,
    required this.dataDesejada,
    required this.valorTotal,
    required this.status,
  });

  factory OrcamentoModel.fromJson(Map<String, dynamic> json) {
    return OrcamentoModel(
      id: (json['id'] ?? '').toString(),
      protocolo: (json['protocolo'] ?? '').toString(),
      nome: (json['nome'] ?? '').toString(),
      telefone: (json['telefone'] ?? '').toString(),
      cep: (json['cep'] ?? '').toString(),
      bairro: (json['bairro'] ?? '').toString(),
      servicoTitulo: (json['servicoTitulo'] ?? '').toString(),
      dataDesejada: (json['dataDesejada'] ?? '').toString(),
      valorTotal: (json['valorTotal'] as num?)?.toDouble() ?? 169.0,
      status: (json['status'] ?? 'EM_ANALISE').toString(),
    );
  }
}
