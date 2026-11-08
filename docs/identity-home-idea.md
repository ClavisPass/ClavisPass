# Idee: Identity als persönlicher Hauptscreen

Stand: 16. Oktober 2026  
Status: Festgehaltene Produktidee, noch kein beschlossener Implementierungsplan.

## Ziel

Der Identity-Screen soll langfristig als Hauptscreen dienen. Der Schwerpunkt soll sich von E-Mail-Clustern zu einem persönlichen Einstieg verschieben: ClavisPass erkennt lokale Nutzungsmuster, schlägt wahrscheinlich benötigte Einträge vor und hilft beim Aufbau sinnvoller eigener Bereiche.

Die zentrale Frage des Screens lautet: „Was brauche ich gerade?“

## Mögliche Funktionen

- Angeheftete Einträge für einen verlässlichen Schnellzugriff.
- Zuletzt und häufig verwendete Einträge.
- Ein kleiner Bereich „Jetzt passend“ mit Vorschlägen anhand von Tageszeit, Wochentag und bisheriger Nutzung.
- Vorschläge für eigene Bereiche aus regelmäßig gemeinsam verwendeten oder anderweitig zusammengehörigen Einträgen.
- Bestehende Identitäts- und E-Mail-Cluster als vertiefende Ansicht innerhalb des neuen Einstiegs.
- Direkt erreichbare Suche und Zugriff auf alle Einträge.

Beispiel: Ein Arbeitskonto erscheint werktags morgens weiter oben. Häufig verwendete private Einträge bleiben grundsätzlich gut erreichbar.

## Technischer Ansatz

Für einen ersten Ausbau ist kein großes KI-Modell erforderlich. Eine lokale, nachvollziehbare Bewertung aus Nutzungshäufigkeit, letzter Verwendung, Wochentag und groben Tageszeitfenstern könnte bereits hilfreiche Vorschläge liefern.

Die bisherige Identity-Ansicht leitet Cluster aus vorhandenen Einträgen ab. Bei der ersten gezielten Codeprüfung wurde keine allgemeine Nutzungshistorie als Grundlage für solche Empfehlungen gefunden. Eine einheitliche Erfassung relevanter Nutzungsaktionen wäre daher zunächst zu prüfen und aufzubauen. Einzelne vorhandene Nutzungsfelder, etwa für Passkeys, ersetzen diese Grundlage nicht.

## Gestaltungsprinzipien und offene Fragen

- **Nutzung sinnvoll definieren:** Eintrag öffnen ist ein schwächeres Signal als Zugangsdaten kopieren oder Autofill auslösen. Bearbeitung und tatsächliche Verwendung sollten unterscheidbar sein.
- **Stabilität erhalten:** Feste Bereiche und angeheftete Einträge mit einem begrenzten dynamischen Vorschlagsbereich kombinieren. Ständiges Umsortieren erschwert das Wiederfinden.
- **Vorschläge erklären:** Kurze Begründungen wie „Werktags morgens häufig verwendet“ machen die Auswahl nachvollziehbar.
- **Bereiche bestätigen lassen:** Gemeinsame Nutzung kann Zusammengehörigkeit nahelegen, beweist aber keine Bedeutung wie „Arbeit“ oder „Finanzen“. Automatische Bereiche zunächst vorschlagen und vom Nutzer bestätigen oder benennen lassen.
- **Ohne Historie nützlich bleiben:** Suche, angeheftete Einträge und ein sinnvoller Zugriff auf alle Einträge müssen von Anfang an funktionieren.
- **Kontrolle ermöglichen:** Vorschläge sollten ausblendbar sein; der Umgang mit abgelehnten Vorschlägen ist noch festzulegen.

## Datenschutz

Nutzungsmuster sind selbst sensible Daten. Vorgeschlagener Ausgangspunkt:

- Lernen und Auswertung ausschließlich lokal, ohne externe KI-Dienste.
- Nutzungsdaten verschlüsselt speichern und an die vorhandenen Vault-Sicherheitsgrenzen anbinden.
- Keine Passwörter oder sonstigen Geheimnisse für die Bewertung erfassen.
- Für Zeitmuster möglichst aggregierte Zähler und grobe Zeitfenster statt einer dauerhaften detaillierten Aktivitätenhistorie verwenden.
- Lernen abschaltbar machen und eine Möglichkeit zum vollständigen Zurücksetzen anbieten.
- Aufbewahrungsdauer, Verhalten beim Sperren und ein möglicher späterer geräteübergreifender Abgleich sind vor der Umsetzung zu klären. Sync ist kein Bestandteil des vorgeschlagenen ersten Ausbaus.

## Mögliche Ausbaustufen

1. **Nützlicher Hauptscreen:** Suche, angeheftete Einträge, zuletzt und häufig verwendete Einträge; dafür die nötigen Nutzungsereignisse sauber erfassen.
2. **Zeitabhängige Vorschläge:** Tageszeit und Wochentag berücksichtigen, sobald ausreichend belastbare Muster vorliegen.
3. **Vorgeschlagene Bereiche:** Wiederkehrende Zusammenhänge erkennen und bestätigbare, benennbare Gruppen anbieten.

## Einschätzung

Die Richtung ist technisch gut machbar. Der größere Anspruch liegt in der Qualität der Vorschläge und einer ruhigen, verlässlichen Bedienung. Der Nutzen sollte daran beurteilt werden, ob Nutzer ihre benötigten Einträge mit weniger Suche und weniger Schritten erreichen.

Diese Idee beschreibt eine mögliche neue Produktrichtung. Sie ersetzt noch nicht die bisherige Identity-Ausrichtung in den Kontextdokumenten.
