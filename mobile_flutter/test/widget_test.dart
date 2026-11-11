import 'package:flutter_test/flutter_test.dart';
import 'package:terceiriza_porto_mobile/main.dart';

void main() {
  testWidgets('Renderiza o app Terceiriza Porto com radar GPS',
      (WidgetTester tester) async {
    await tester.pumpWidget(const TerceirizaPortoApp());
    expect(find.text('Terceiriza Porto'), findsOneWidget);
    expect(find.text('Mapa GPS'), findsOneWidget);
  });
}
