import 'package:flutter/material.dart';

/// Cores oficiais inspiradas na Bandeira e Brasão de Porto Seguro - BA
/// Lema: "Jam Ante Brasiliam Ego" (Antes do Brasil, Eu)
class PortoColors {
  // Metade esquerda da bandeira: Verde Oficial
  static const Color green = Color(0xFF008B45);
  static const Color greenDark = Color(0xFF006833);
  static const Color greenLight = Color(0xFFE6F5ED);

  // Metade direita da bandeira: Vermelho Oficial
  static const Color red = Color(0xFFDC2626);
  static const Color redDark = Color(0xFFB91C1C);
  static const Color redLight = Color(0xFFFEF2F2);

  // Escudo Central das Caravelas: Azul Oceano
  static const Color blue = Color(0xFF0E87CC);
  static const Color blueDark = Color(0xFF0A5F91);
  static const Color blueLight = Color(0xFFE0F2FE);

  // Colunas Imperiais do Brasão: Dourado / Amarelo
  static const Color gold = Color(0xFFEAB308);
  static const Color goldSoft = Color(0xFFF5D061);
  static const Color goldLight = Color(0xFFFEF9C3);

  // Superfícies e texto
  static const Color background = Color(0xFFF6F9F7);
  static const Color card = Color(0xFFFFFFFF);
  static const Color textMain = Color(0xFF0F172A);
  static const Color textMuted = Color(0xFF475569);
  static const Color border = Color(0xFFDBE5DF);
}

ThemeData buildPortoSeguroTheme() {
  return ThemeData(
    useMaterial3: true,
    scaffoldBackgroundColor: PortoColors.background,
    colorScheme: ColorScheme.fromSeed(
      seedColor: PortoColors.green,
      primary: PortoColors.green,
      secondary: PortoColors.red,
      tertiary: PortoColors.blue,
      surface: PortoColors.card,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: PortoColors.greenDark,
      foregroundColor: Colors.white,
      elevation: 0,
      centerTitle: false,
    ),
    cardTheme: CardThemeData(
      color: PortoColors.card,
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: const BorderSide(color: PortoColors.border),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: PortoColors.green,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 13),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(999),
        ),
        textStyle: const TextStyle(
          fontWeight: FontWeight.w700,
          fontSize: 14,
        ),
      ),
    ),
  );
}

/// Faixa superior com as cores da Bandeira de Porto Seguro
class PortoFlagRibbon extends StatelessWidget {
  final double height;
  const PortoFlagRibbon({super.key, this.height = 5});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      child: Row(
        children: [
          Expanded(flex: 40, child: Container(color: PortoColors.green)),
          Expanded(flex: 4, child: Container(color: PortoColors.goldSoft)),
          Expanded(flex: 18, child: Container(color: PortoColors.blue)),
          Expanded(flex: 4, child: Container(color: PortoColors.goldSoft)),
          Expanded(flex: 40, child: Container(color: PortoColors.red)),
        ],
      ),
    );
  }
}

/// Emblema da Bandeira de Porto Seguro (Verde | Vermelho + Escudo Azul das Caravelas + Colunas Douradas)
class PortoFlagBadge extends StatelessWidget {
  final double size;
  const PortoFlagBadge({super.key, this.size = 38});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size * 1.25,
      height: size,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: PortoColors.goldSoft, width: 1.8),
        boxShadow: const [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Row(
            children: [
              Expanded(child: Container(color: PortoColors.green)),
              Expanded(child: Container(color: PortoColors.red)),
            ],
          ),
          // Escudo central azul com vela branca e cruz vermelha
          Container(
            width: size * 0.56,
            height: size * 0.66,
            decoration: BoxDecoration(
              color: PortoColors.blue,
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(3),
                bottom: Radius.circular(12),
              ),
              border: Border.all(color: Colors.white, width: 1.4),
            ),
            child: const Center(
              child: Icon(
                Icons.directions_boat_filled,
                color: Colors.white,
                size: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
