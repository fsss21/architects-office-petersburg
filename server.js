/* eslint-env node */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { existsSync } from 'fs';
import { platform } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Определяем путь к папке dist
// При запуске через pkg, __dirname указывает на временную папку с распакованными assets
// При обычном запуске - на папку с server.js
let distPath;
if (process?.pkg) {
  // При запуске через pkg, assets находятся в __dirname
  distPath = path.join(__dirname, 'dist');
} else {
  // При обычном запуске, dist находится рядом с server.js
  distPath = path.join(__dirname, 'dist');
}

// Обслуживание статических файлов из папки dist
app.use(express.static(distPath));

// Для всех остальных маршрутов возвращаем index.html (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Функция для запуска браузера в киоск-режиме (только для Windows)
function launchBrowser() {
  if (platform() !== 'win32') {
    console.log('Автоматический запуск браузера доступен только на Windows');
    return;
  }

  const chromePath = process.env['ProgramFiles'] + '\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe';
  const url = `http://localhost:${PORT}/`;

  setTimeout(() => {
    if (existsSync(chromePath)) {
      // Запуск Chrome в киоск-режиме
      const chromeArgs = [
        '--disable-web-security',
        `--user-data-dir="${process.env.TEMP}\\ChromeTempProfile"`,
        '--autoplay-policy=no-user-gesture-required',
        `--app="${url}"`,
        '--start-fullscreen',
        '--kiosk',
        '--disable-features=Translate,ContextMenuSearchWebFor,ImageSearch',
      ].join(' ');

      exec(`"${chromePath}" ${chromeArgs}`, (error) => {
        if (error) {
          console.error('Ошибка запуска Chrome:', error);
        }
      });
    } else if (existsSync(edgePath)) {
      // Настройка реестра для Edge (требует прав администратора)
      const regCommands = [
        'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v "TranslateEnabled" /t REG_DWORD /d 0 /f',
        'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v "ContextMenuSearchEnabled" /t REG_DWORD /d 0 /f',
        'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v "VisualSearchEnabled" /t REG_DWORD /d 0 /f',
      ];

      // Выполняем команды реестра (могут не сработать без прав администратора)
      regCommands.forEach((cmd) => {
        exec(cmd, () => {}); // Игнорируем ошибки, если нет прав
      });

      // Запуск Edge в киоск-режиме
      const edgeArgs = [
        `--kiosk "${url}"`,
        '--edge-kiosk-type=fullscreen',
        '--no-first-run',
        '--disable-features=msEdgeSidebarV2,msHub,msWelcomePage,msTranslations,msContextMenuSearch,msVisualSearch',
        '--disable-component-update',
        '--disable-prompt-on-repost',
        '--kiosk-idle-timeout-minutes=0',
      ].join(' ');

      exec(`"${edgePath}" ${edgeArgs}`, (error) => {
        if (error) {
          console.error('Ошибка запуска Edge:', error);
        }
      });
    } else {
      console.log('Не найден ни Chrome, ни Edge. Откройте браузер вручную.');
      console.log(`URL: ${url}`);
    }
  }, 3000); // Ждем 3 секунды после запуска сервера

  // Убиваем explorer.exe через 12 секунд (опционально, можно закомментировать)
  setTimeout(() => {
    console.log('Kill Explorer...');
    exec('taskkill /f /im explorer.exe', (error) => {
      if (error) {
        // Игнорируем ошибки, если нет прав или explorer уже закрыт
      }
    });
  }, 12000);
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Serving files from: ${distPath}`);

  // Запускаем браузер автоматически (только на Windows)
  if (platform() === 'win32') {
    launchBrowser();
  }
});
