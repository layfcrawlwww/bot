const readline = require('readline');
const fs = require('fs');
const { spawn } = require('child_process');

// Kullanıcıdan giriş alma
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Başlangıç mesajı
console.log("\x1b[35m%s\x1b[0m", "Wozy-bots");

let ip, port, version, spawnInterval, spawnDuration;

// Kullanıcıdan IP, Port ve Minecraft versiyonunu alma
rl.question("\x1b[33mSunucunun IP adresini ve portunu girin (örneğin 192.168.1.1:8080): \x1b[0m", (answer) => {
  [ip, port] = answer.split(':');
  console.log(`\x1b[32mSunucu IP: ${ip}, Port: ${port}\x1b[0m`);

  rl.question("\x1b[33mMinecraft versiyonunu seçin (1.19.4, 1.16.5): \x1b[0m", (ver) => {
    version = ver;
    console.log(`\x1b[32mSeçilen Minecraft versiyonu: ${version}\x1b[0m`);

    rl.question("\x1b[33mKaç saniyede bir bot atılsın? (örneğin 5): \x1b[0m", (interval) => {
      spawnInterval = parseInt(interval) * 1000;
      console.log(`\x1b[32mBot atma aralığı: ${interval} saniye\x1b[0m`);

      rl.question("\x1b[33mBot atma süresi kaç saniye devam etsin? (örneğin 30): \x1b[0m", (duration) => {
        spawnDuration = parseInt(duration) * 1000;
        console.log(`\x1b[32mBot atma süresi: ${duration} saniye\x1b[0m`);

        startBotSpawning();
        rl.close(); // Girişleri aldıktan sonra readline arayüzünü kapat
      });
    });
  });
});

// Botları spawn etme işlemi
function startBotSpawning() {
  console.log("\n\x1b[35m%s\x1b[0m", `Başlatılıyor...`);

  const startTime = Date.now();
  let botCount = 0;

  // CPS göstergesi ve zamanlayıcı
  const cpsTimer = setInterval(() => {
    const elapsedTime = (Date.now() - startTime) / 1000;
    const currentCPS = botCount / elapsedTime;
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`\x1b[36mCPS: ${currentCPS.toFixed(2)} - Kalan Süre: ${((spawnDuration - elapsedTime) / 1000).toFixed(0)} saniye\x1b[0m`);
  }, 1000);

  // Botları spawn etme döngüsü
  const spawnIntervalTimer = setInterval(() => {
    if (Date.now() - startTime < spawnDuration) {
      spawnBot();
      botCount++;
    } else {
      clearInterval(cpsTimer);
      clearInterval(spawnIntervalTimer);
      console.log("\n\x1b[35m%s\x1b[0m", "Bot atma işlemi tamamlandı.");
    }
  }, spawnInterval);
}

// Bot spawn etme fonksiyonu
function spawnBot() {
  const botName = generateRandomName(); // Rastgele isim oluştur
  const proxy = getRandomProxy(); // Rastgele proxy seç (gerçek implementasyon olmadığı için örnek)

  // Botu başlatma komutu
  const botProcess = spawn('node', ['your_bot_script.js', version, ip, port, botName, proxy]);

  botProcess.stdout.on('data', (data) => {
    console.log(`Bot: ${data.toString().trim()}`);
  });

  botProcess.stderr.on('data', (data) => {
    console.error(`Bot Error: ${data.toString().trim()}`);
  });
}

// Rastgele isim oluşturma fonksiyonu (örnek)
function generateRandomName() {
  const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
  return names[Math.floor(Math.random() * names.length)];
}

// Rastgele proxy seçme fonksiyonu (örnek)
function getRandomProxy() {
  const proxies = fs.readFileSync('proxies.txt', 'utf8').split('\n').filter(Boolean);
  return proxies[Math.floor(Math.random() * proxies.length)];
}
