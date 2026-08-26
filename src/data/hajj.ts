export const hajjProcess = [
  { id: "p01", num: "01", title: "Vormerkung", short: "Du meldest dein Interesse für Hajj 2027 bei uns an.", full: "Du meldest dein Interesse für Hajj 2027 bei uns an. Die Voranmeldung ist kostenlos und unverbindlich." },
  { id: "p02", num: "02", title: "Information", short: "Sobald es wichtige Neuigkeiten gibt, informieren wir dich rechtzeitig.", full: "Sobald es wichtige Neuigkeiten zu Hajj 2027 gibt, informieren wir dich rechtzeitig." },
  { id: "p03", num: "03", title: "Registrierung", short: "Wir erklären dir die notwendigen Registrierungsschritte.", full: "Sobald der offizielle Ablauf feststeht, erklären wir dir die notwendigen Registrierungsschritte." },
  { id: "p04", num: "04", title: "Prüfung & Dokumente", short: "Unterstützung bei Informationen und Dokumenten.", full: "Wir unterstützen dich dabei, die erforderlichen Informationen und Dokumente vorzubereiten und zu prüfen." },
  { id: "p05", num: "05", title: "Passendes Programm", short: "Hilfe bei der Auswahl passender Möglichkeiten.", full: "Sobald Programme verfügbar sind, helfen wir dir, die passenden Möglichkeiten für dein Wohnsitzland zu verstehen." },
  { id: "p06", num: "06", title: "Unterstützung bei der Buchung", short: "Begleitung durch den Buchungsprozess.", full: "Wir begleiten dich durch den Buchungsprozess und erklären dir die wichtigen nächsten Schritte." },
  { id: "p07", num: "07", title: "Reisevorbereitung", short: "Organisatorische und religiöse Informationen.", full: "Vor der Abreise erhält unsere Gruppe organisatorische und religiöse Informationen." },
  { id: "p08", num: "08", title: "Abflug", short: "Informationen zu Treffpunkt, Flughafen und Ablauf.", full: "Unsere gemeinsame Reise beginnt. Du erhältst alle Informationen zu Treffpunkt, Flughafen, Gepäck und Ablauf." },
  { id: "p09", num: "09", title: "Ankunft in Saudi-Arabien", short: "Empfang, Transfers und erste Schritte.", full: "Nach der Ankunft koordinieren wir Empfang, Transfers und die ersten organisatorischen Schritte." },
  { id: "p10", num: "10", title: "Betreuung vor Ort", short: "Persönliche Begleitung während des Hajj.", full: "Während des Hajj begleiten unsere Reiseleiter und religiösen Begleiter die Gruppe persönlich in Saudi-Arabien." },
];

export const hajjJourney = [
  { id: "j01", num: "01", title: "Ankunft in Saudi-Arabien", short: "Empfang am Flughafen und erste wichtige Informationen.", full: "Nach der Landung beginnt unsere Betreuung direkt vor Ort. Unsere Reiseleitung informiert die Gruppe über die nächsten Schritte.", checks: ["Treffpunkt der Gruppe", "Informationen zur Einreise", "Gepäckinformationen", "Ansprechpartner vor Ort"] },
  { id: "j02", num: "02", title: "Transfer zum Hotel", short: "Gemeinsamer Transfer zum vorgesehenen Hotel.", full: "Nach der Ankunft koordinieren wir den Transfer der Gruppe zum vorgesehenen Hotel.", checks: ["Bus- und Gruppeneinteilung", "Gepäckkoordination", "Begleitung durch das Team"] },
  { id: "j03", num: "03", title: "Check-in Medina", short: "Ankunft in Medina und Zimmerbezug.", full: "Wir begleiten unsere Gruppe beim Hotel-Check-in und bei der Zimmervergabe in Medina.", checks: ["Zimmervergabe", "Hotelinformationen", "Treffpunkt der Gruppe"] },
  { id: "j04", num: "04", title: "Aufenthalt & Betreuung in Medina", short: "Religiöse Programme und persönliche Begleitung.", full: "Medina ist für viele Pilger einer der emotionalsten Teile der Reise. Wir schaffen Raum für Ibadah und strukturierte Betreuung.", checks: ["Masjid an-Nabawi", "Ziyarat", "Religiöse Vorträge"] },
  { id: "j05", num: "05", title: "Transfer Medina → Makkah", short: "Gemeinsame Weiterreise Richtung Makkah.", full: "Die Weiterreise von Medina nach Makkah ist ein wichtiger Übergang. Informationen zu Abfahrt, Gepäck und Ihram erfolgen rechtzeitig.", checks: ["Abfahrtszeit", "Treffpunkt", "Vorbereitung auf Ihram"] },
  { id: "j06", num: "06", title: "Miqat / Ihram", short: "Vorbereitung am vorgesehenen Miqat.", full: "Unsere religiösen Begleiter erklären der Gruppe die notwendigen Schritte für den Ihram.", checks: ["Ihram", "Niyyah", "Talbiyah"] },
  { id: "j07", num: "07", title: "Check-in Makkah", short: "Ankunft in Makkah und Zimmerbezug.", full: "Begleitung beim Hotel-Check-in und Informationen über Treffpunkte und das weitere Programm.", checks: ["Zimmervergabe", "Entfernung zum Haram", "Treffpunkte"] },
  { id: "j08", num: "08", title: "Vorbereitung auf Hajj", short: "Wichtige Informationen vor Beginn der Hajj-Tage.", full: "Ausführliche religiöse und organisatorische Vorbereitung auf die kommenden Tage.", checks: ["Ablauf der Hajj-Tage", "Mina", "Arafat"] },
  { id: "j09", num: "09", title: "Mina", short: "8. Dhul Hijjah – Beginn der Hajj-Tage.", full: "Mit dem Aufenthalt in Mina beginnt eine der wichtigsten Phasen unserer Hajj-Reise.", checks: ["Transfer nach Mina", "Gruppentreffpunkte", "Vorbereitung auf Arafat"], highlight: false },
  { id: "j10", num: "10", title: "Tag von Arafat", short: "9. Dhul Hijjah – Der wichtigste Tag des Hajj.", full: "An diesem besonderen Tag möchten wir unseren Pilgern ermöglichen, sich möglichst auf ihre Ibadah zu konzentrieren. Offizielle Vorgaben haben Vorrang.", checks: ["Gruppenorganisation", "Klare Treffpunkte", "Religiöse Begleitung"], highlight: true },
  { id: "j11", num: "11", title: "Transfer Arafat → Muzdalifah", short: "Weiterreise nach Sonnenuntergang.", full: "Transportabläufe können durch offizielle Vorgaben beeinflusst werden; das Team informiert laufend.", checks: ["Treffpunkte", "Transferinformationen"] },
  { id: "j12", num: "12", title: "Muzdalifah", short: "Übernachtung und Vorbereitung auf die kommenden Riten.", full: "Religiöse Begleiter erklären die entsprechenden Riten; Reiseleitung informiert über den Ablauf.", checks: ["Gebet", "Vorbereitung auf Jamarat"] },
  { id: "j13", num: "13", title: "Transfer nach Mina", short: "Weiterreise am folgenden Morgen.", full: "Informationen über Abfahrtszeiten, Treffpunkte und kommende Riten.", checks: ["Transfer", "Jamarat-Informationen"] },
  { id: "j14", num: "14", title: "Jamarat & weitere Hajj-Riten", short: "Steinigung und weitere wichtige Riten.", full: "Informationen zum vorgesehenen Zeitfenster und zur Gruppenorganisation entsprechend dem finalen Programm.", checks: ["Jamarat", "Hady", "Tawaf al-Ifadah"] },
  { id: "j15", num: "15", title: "Tage von Tashreeq", short: "11.–13. Dhul Hijjah – Weitere Tage in Mina.", full: "Tägliche Informationen über Programmpunkte, Treffpunkte und vorgesehene Zeiten.", checks: ["Mina", "Jamarat", "Religiöse Begleitung"] },
  { id: "j16", num: "16", title: "Transfer nach Makkah", short: "Rückkehr nach Makkah.", full: "Koordination des Transfers und Informationen über den weiteren Aufenthalt.", checks: ["Transfer", "Nächste Programmpunkte"] },
  { id: "j17", num: "17", title: "Abschieds-Tawaf", short: "Gemeinsamer Abschieds-Tawaf vor der Rückreise.", full: "Informationen über den vorgesehenen Ablauf und Unterstützung der Gruppe.", checks: ["Treffpunkt", "Religiöse Hinweise"] },
  { id: "j18", num: "18", title: "Transfer zum Flughafen & Rückreise", short: "Heimreise mit besonderen Erinnerungen.", full: "Informationen zu Check-out, Treffpunkt, Gepäck und Flughafentransfer.", checks: ["Hotel Check-out", "Flughafentransfer", "Rückflug"] },
];

export const hajjFaqs = [
  {
    q: "Wann stehen die finalen Hajj-2027-Termine und Preise fest?",
    a: "Die finalen Programme, Preise und Termine stehen derzeit noch nicht fest. Vorgemerkte Pilger werden informiert, sobald offizielle Informationen vorliegen.",
  },
  {
    q: "Ist die Voranmeldung verbindlich?",
    a: "Nein. Die Voranmeldung ist kostenlos und unverbindlich. Sie verpflichtet Sie nicht zu einer Buchung.",
  },
  {
    q: "Muss ich später ein Mobarak-Programm buchen?",
    a: "Nein. Nach Veröffentlichung der Programme entscheiden Sie frei, ob Sie unser Programm oder ein anderes wählen.",
  },
];
