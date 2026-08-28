# Datenschutzerklärung

Stand: 28. August 2026

Diese Datenschutzerklärung informiert darüber, welche personenbezogenen Daten bei der Nutzung der ClavisPass-Webseite, der ClavisPass-App und der ClavisPass-Browser-Erweiterung verarbeitet werden.

## 1. Verantwortlicher

Verantwortlich für die Datenverarbeitung ist:

```text
Ricardo Valente de Matos
E-Mail: clavispass@arratel.dev
Website: https://clavispass.arratel.dev/
```

## 2. Grundprinzip von ClavisPass

ClavisPass ist ein lokaler, datenschutzfreundlicher Passwortmanager. Vault-Inhalte werden auf dem Gerät des Nutzers verschlüsselt, bevor sie gespeichert oder mit unterstützten Speicheranbietern synchronisiert werden.

Das Master-Passwort wird nicht an Arratel oder ClavisPass übertragen. ClavisPass kann ein vergessenes Master-Passwort nicht wiederherstellen.

## 3. Lokale Datenverarbeitung in der App

Die ClavisPass-App verarbeitet Daten in erster Linie lokal auf dem Gerät des Nutzers. Dazu können insbesondere gehören:

- Vault-Daten wie Passwörter, Benutzernamen, URLs, Notizen, 2FA-Daten, Recovery Codes, Karten, Dokumente, Anhänge, Tags, Ordner und weitere vom Nutzer angelegte Inhalte
- App-Einstellungen wie Sprache, Theme, Session-Dauer, Kopierdauer, Fast-Access-Einstellungen und ähnliche Konfiguration
- technische Geräteinformationen, soweit sie zur Vault-Verwaltung, Synchronisation oder Geräteübersicht erforderlich sind
- lokale Session-Informationen, damit der Vault während einer Nutzungssitzung entsperrt bleiben kann

Vault-Inhalte werden verschlüsselt gespeichert. Lesbare Vault-Inhalte werden nicht an ClavisPass oder Arratel übertragen.

## 4. Verschlüsselung und Master-Passwort

ClavisPass verwendet für den Vault lokale Verschlüsselung. Nach aktuellem Implementierungsstand werden insbesondere folgende Verfahren eingesetzt:

- Argon2id zur Ableitung eines Schlüssels aus dem Master-Passwort
- XChaCha20-Poly1305 für authentifizierte Verschlüsselung

Das Master-Passwort wird lokal verarbeitet und nicht an ClavisPass oder Arratel übertragen. Verschlüsselte Vault-Daten können ohne das Master-Passwort nicht entschlüsselt werden.

## 5. Synchronisation und Speicheranbieter

ClavisPass kann Vault-Daten über vom Nutzer ausgewählte Anbieter speichern oder synchronisieren.

Aktuell relevante Speicher- und Synchronisationswege sind:

- lokaler Gerätespeicher
- lokale Vault-Datei auf Desktop
- Dropbox
- Google Drive
- selbst gehosteter ClavisPass Hub

Bei Dropbox, Google Drive oder einem selbst gehosteten ClavisPass Hub werden Vault-Inhalte verschlüsselt übertragen und gespeichert. Der jeweilige Anbieter oder Betreiber kann technische Metadaten verarbeiten, zum Beispiel Accountdaten, Dateinamen, Zeitpunkte, IP-Adressen, OAuth-Informationen oder Nutzungsdaten des jeweiligen Dienstes.

Für diese Verarbeitung gelten zusätzlich die Datenschutzhinweise des jeweiligen Drittanbieters oder des selbst gehosteten ClavisPass-Hub-Betreibers.

## 6. OAuth und Zugriffstokens

Wenn Nutzer Dropbox oder Google Drive verbinden, wird ein OAuth-Prozess des jeweiligen Anbieters verwendet. Dabei können Nutzer auf Seiten des Drittanbieters weitergeleitet werden.

ClavisPass speichert erforderliche Refresh- oder Zugriffstokens lokal sicher, soweit dies für die Synchronisation notwendig ist. Auf Desktop werden sichere Betriebssystem-Speichermechanismen genutzt. Auf mobilen Plattformen wird sicherer Gerätespeicher verwendet.

## 7. Lokale Vault-Dateien

Auf Desktop kann ClavisPass eine lokale Vault-Datei als Speicherort verwenden. In diesem Fall verarbeitet ClavisPass den vom Nutzer ausgewählten Dateipfad, um den Vault zu laden und zu speichern.

Diese Verarbeitung erfolgt lokal auf dem Gerät. Der Dateipfad wird nicht an ClavisPass oder Arratel übertragen.

## 8. Importfunktionen

ClavisPass kann Daten aus anderen Quellen importieren, zum Beispiel:

- Browser-Exporte
- Bitwarden-Exporte
- KeePass/KDBX-Dateien
- Backup-Dateien

Importierte Daten werden lokal gelesen und in das ClavisPass-Datenmodell übernommen. Danach gelten sie als Teil des Vaults und werden entsprechend verschlüsselt gespeichert oder synchronisiert.

Bei KeePass/KDBX-Dateien wird das vom Nutzer eingegebene KeePass-Master-Passwort lokal verwendet, um die Datei zu öffnen. Es wird nicht an ClavisPass oder Arratel übertragen.

## 9. Passwortanalyse und Have I Been Pwned

ClavisPass kann Passwörter mit dem Dienst Have I Been Pwned / Pwned Passwords prüfen.

Diese Prüfung erfolgt nach dem k-Anonymity-Prinzip: Es wird nicht das vollständige Passwort übertragen, sondern nur ein kurzer Präfix eines lokal berechneten Hashes. Der Dienst liefert passende Hash-Suffixe zurück, die lokal abgeglichen werden.

Diese Funktion erfordert eine Netzwerkverbindung zum Pwned-Passwords-Dienst.

## 10. Browser-Erweiterung

Die ClavisPass-Browser-Erweiterung kommuniziert mit der lokalen ClavisPass-Desktop-App über Native Messaging.

Die Erweiterung kann die aktive Website-Domain lesen, um passende Vault-Einträge bei der lokalen Desktop-App anzufragen. Wenn der Nutzer eine Anmeldung ausfüllt, fordert die Erweiterung die ausgewählten Login-Daten von der lokalen Desktop-App an und fügt sie in die aktive Seite ein.

Die Erweiterung sendet keine Passwörter, Vault-Inhalte, Browserverläufe oder Websitedaten an ClavisPass, Arratel oder andere Remote-Server. Daten, die zwischen Erweiterung und Desktop-App ausgetauscht werden, dienen nur Pairing, Matching, Autofill und Speichern oder Aktualisieren von Einträgen.

## 11. Benachrichtigungen

Auf mobilen Geräten kann ClavisPass lokale Benachrichtigungen verwenden, zum Beispiel für Fast Access oder Ablauf-Erinnerungen.

Benachrichtigungen werden lokal durch das Betriebssystem geplant oder angezeigt. Ablauf-Erinnerungen enthalten keine sensiblen Vault-Details.

## 12. Kontaktaufnahme

Wenn Nutzer per E-Mail Kontakt aufnehmen, werden die übermittelten Angaben verarbeitet, zum Beispiel:

- E-Mail-Adresse
- Name, sofern angegeben
- Inhalt der Nachricht
- technische Metadaten der E-Mail-Kommunikation

Zweck ist die Bearbeitung der Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern die Anfrage mit der Nutzung von ClavisPass zusammenhängt, oder Art. 6 Abs. 1 lit. f DSGVO auf Grundlage des berechtigten Interesses an Support und Kommunikation.

## 13. Webseite und Hosting

Die ClavisPass-Webseite wird statisch über GitHub Pages bereitgestellt.

Beim Besuch der Webseite können technische Zugriffsdaten verarbeitet werden, zum Beispiel:

- IP-Adresse
- Datum und Uhrzeit des Abrufs
- angeforderte Seite oder Datei
- Referrer
- Browser und Betriebssystem
- übertragene Datenmenge

Diese Verarbeitung dient der technischen Bereitstellung, Stabilität und Sicherheit der Webseite. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Für die Verarbeitung durch GitHub gelten zusätzlich die Datenschutzhinweise von GitHub.

## 14. Cookies, Tracking und Analytics

ClavisPass setzt nach aktuellem Stand keine eigenen Tracking-Cookies und keine eigenen Analytics-Dienste ein.

## 15. App Stores und Download-Plattformen

Wenn ClavisPass über Plattformen wie Microsoft Store, Google Play, Apple App Store, GitHub Releases oder Browser Extension Stores bezogen wird, können diese Plattformen eigene personenbezogene Daten verarbeiten. Dazu können Accountdaten, Geräteinformationen, Download-Informationen, Bewertungen oder Crash-Informationen gehören.

Für diese Verarbeitung gelten die Datenschutzhinweise der jeweiligen Plattformanbieter.

## 16. Rechtsgrundlagen

Je nach Funktion verarbeitet ClavisPass Daten auf Grundlage folgender Rechtsgrundlagen:

- Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung zur Bereitstellung angefragter Funktionen erforderlich ist
- Art. 6 Abs. 1 lit. f DSGVO, soweit ein berechtigtes Interesse an sicherem Betrieb, Support, Missbrauchsvermeidung, Fehleranalyse oder technischer Bereitstellung besteht
- Art. 6 Abs. 1 lit. a DSGVO, soweit eine Einwilligung erforderlich ist, zum Beispiel bei optionalen Benachrichtigungen
- Art. 6 Abs. 1 lit. c DSGVO, soweit gesetzliche Pflichten bestehen

## 17. Speicherdauer

Lokale Vault-Daten bleiben auf dem Gerät des Nutzers oder beim gewählten Speicheranbieter gespeichert, bis der Nutzer sie löscht oder den Speicherort entfernt.

Kontaktanfragen werden nur so lange gespeichert, wie es für die Bearbeitung und etwaige Anschlussfragen erforderlich ist, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.

Technische Website-Logs werden durch GitHub nach den dort geltenden Regelungen verarbeitet.

## 18. Empfänger

Empfänger personenbezogener Daten können je nach Nutzung sein:

- GitHub als Hosting- und Release-Plattform
- der E-Mail-Anbieter für Kontaktanfragen
- App-Store- und Download-Plattformen
- vom Nutzer gewählte Sync-Anbieter wie Dropbox oder Google
- Have I Been Pwned / Pwned Passwords, sofern die Passwortprüfung genutzt wird
- ein selbst gehosteter ClavisPass Hub, sofern der Nutzer diesen verwendet

Je nach Anbieter kann eine Übermittlung in Länder außerhalb der EU/des EWR erfolgen. In diesem Fall gelten die jeweiligen Datenschutzinformationen und Transfermechanismen der Anbieter.

## 19. Rechte der betroffenen Personen

Betroffene Personen haben nach Maßgabe der DSGVO insbesondere folgende Rechte:

- Auskunft über verarbeitete personenbezogene Daten
- Berichtigung unrichtiger Daten
- Löschung
- Einschränkung der Verarbeitung
- Datenübertragbarkeit
- Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen
- Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft
- Beschwerde bei einer Datenschutzaufsichtsbehörde

Anfragen können an `clavispass@arratel.dev` gerichtet werden.

## 20. Sicherheit

ClavisPass trifft technische Maßnahmen, um Daten zu schützen. Dazu gehören insbesondere lokale Verschlüsselung des Vaults, sichere Speicherung von Tokens und die Trennung von sensiblen Vault-Inhalten und UI-Metadaten.

Kein System kann absolute Sicherheit garantieren. Nutzer sollten ein starkes Master-Passwort verwenden, Geräte aktuell halten und Backups sorgfältig sichern.

## 21. Änderungen dieser Datenschutzerklärung

Diese Datenschutzerklärung kann angepasst werden, wenn sich Funktionen, Anbieter, rechtliche Anforderungen oder technische Abläufe ändern.

