# 💖 Liebes-Prüfung Troll Website

Diese süße, kleine Website ist das perfekte Troll-Spiel für deine Freundin. Wenn sie versucht, auf "Nein" zu klicken, weicht der Button aus und es erscheinen lustige, liebevolle Nachrichten. Klickt sie schließlich auf "Ja! ❤️", wird sie mit einer süßen Nachricht, einem Katzenfoto und Konfetti überrascht.

Die Website ist so programmiert, dass sie **vollständig kompatibel mit GitHub Pages** ist (alle Pfade sind relativ).

---

## 🚀 Anleitung: Website kostenlos auf GitHub hosten

Folge diesen einfachen Schritten, um die Website online zu stellen:

### Schritt 1: GitHub Repository erstellen
1. Gehe auf [github.com](https://github.com/) und logge dich in deinen Account ein.
2. Klicke oben rechts auf das **`+`** und wähle **`New repository`** (Neues Repository).
3. Benenne dein Repository (z.B. `fuer-meine-freundin` oder `liebst-du-mich`).
4. Setze die Sichtbarkeit auf **`Public`** (Öffentlich) – das ist wichtig für kostenloses Hosting!
5. Klicke unten auf **`Create repository`** (Repository erstellen).
6. Kopiere die URL deines neuen Repositories (sieht etwa so aus: `https://github.com/DEIN-BENUTZERNAME/REPOSITROY-NAME.git`).

---

### Schritt 2: Code auf GitHub hochladen (über das Terminal)
Öffne dein Terminal (z.B. PowerShell in VS Code) im Ordner `love-puzzle-game` und führe folgende Befehle aus:

1. **Git initialisieren:**
   ```bash
   git init
   ```

2. **Dateien hinzufügen:**
   ```bash
   git add .
   ```

3. **Ersten Commit erstellen:**
   ```bash
   git commit -m "Initial commit - sweet troll game ready"
   ```

4. **Hauptbranch auf 'main' setzen:**
   ```bash
   git branch -M main
   ```

5. **Lokales Projekt mit GitHub verknüpfen** *(Ersetze die URL mit deiner kopierten URL)*:
   ```bash
   git remote add origin https://github.com/DEIN-BENUTZERNAME/REPOSITROY-NAME.git
   ```

6. **Code hochladen:**
   ```bash
   git push -u origin main
   ```

*(Alternativ kannst du die Dateien auch einfach per Drag & Drop direkt auf der GitHub-Website in dein Repository hochladen.)*

---

### Schritt 3: GitHub Pages aktivieren
1. Gehe in deinem GitHub Repository oben auf den Reiter **`Settings`** (Einstellungen).
2. Klicke in der linken Seitenleiste unter "Code and automation" auf **`Pages`**.
3. Wähle unter "Build and deployment" -> "Branch" den Branch **`main`** aus und lasse den Ordner auf `/ (root)`.
4. Klicke auf **`Save`** (Speichern).
5. Nach ca. 1-2 Minuten wird dir ganz oben auf dieser Seite der Link zu deiner Live-Website angezeigt (z.B. `https://DEIN-BENUTZERNAME.github.io/REPOSITORY-NAME/`).

Fertig! Du kannst den Link kopieren und deiner Freundin schicken. 🎉
