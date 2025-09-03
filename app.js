// Main JS for Prediction & 999okwin Simulator

// ---- Tab switching ----
const tabPrediction = document.getElementById('tab-prediction');
const tabHack = document.getElementById('tab-hack');
const panelPrediction = document.getElementById('panel-prediction');
const panelHack = document.getElementById('panel-hack');

tabPrediction.addEventListener('click', () => {
  tabPrediction.classList.add('active');
  tabHack.classList.remove('active');
  panelPrediction.classList.remove('hidden');
  panelHack.classList.add('hidden');
});
tabHack.addEventListener('click', () => {
  tabHack.classList.add('active');
  tabPrediction.classList.remove('active');
  panelHack.classList.remove('hidden');
  panelPrediction.classList.add('hidden');
});

// ---------------- Prediction Logic ----------------
const predictBtn = document.getElementById('predict-btn');
const resetPredictBtn = document.getElementById('reset-predict-btn');
const periodInput = document.getElementById('period-input');

const outWrap = document.getElementById('prediction-output');
const outPeriod = document.getElementById('out-period');
const outColor = document.getElementById('out-color');
const outNumber = document.getElementById('out-number');
const outProbability = document.getElementById('out-probability');
const outMessage = document.getElementById('out-message');

function calculateProbability(period){
  // ported from bash: magic_number = (period * 371) % 1000; probability = magic_number % 100
  const magic = (period * 371) % 1000;
  let prob = magic % 100;
  if(prob < 65) prob = Math.min(prob + 35, 100);
  return prob;
}

function predictPeriod(){
  const raw = periodInput.value;
  if(raw === '' || isNaN(raw) || Number(raw) < 0){
    alert('Please enter a non-negative integer period number.');
    return;
  }
  const period = Math.floor(Number(raw));
  const colorCode = period % 3;
  const number = period % 10;
  const probability = calculateProbability(period);

  let colorName = '';
  let colorClass = '';
  if(colorCode === 0){ colorName = 'RED'; colorClass = 'red'; }
  else if(colorCode === 1){ colorName = 'GREEN'; colorClass = 'green'; }
  else { colorName = 'VIOLET'; colorClass = 'violet'; }

  outPeriod.textContent = period;
  outColor.textContent = colorName;
  outColor.className = 'chip ' + colorClass;
  outNumber.textContent = number;
  outProbability.textContent = probability + '%';

  outWrap.classList.remove('hidden');
  outMessage.className = 'message';
  if(probability > 85){
    outMessage.classList.add('success');
    outMessage.textContent = '[+] High chance of winning!';
  } else if(probability > 65){
    outMessage.classList.add('warn');
    outMessage.textContent = '[!] Moderate chance of winning';
  } else {
    outMessage.classList.add('danger');
    outMessage.textContent = '[-] Low chance of winning';
  }
}

predictBtn.addEventListener('click', predictPeriod);
resetPredictBtn.addEventListener('click', () => {
  periodInput.value = '';
  outWrap.classList.add('hidden');
});

// ---------------- 999okwin Simulator ----------------
const startHackBtn = document.getElementById('start-hack');
const abortHackBtn = document.getElementById('abort-hack');
const simStatus = document.getElementById('sim-status');
const matrixArea = document.getElementById('matrix-area');
const logBox = document.getElementById('log-box');
const downloadLogBtn = document.getElementById('download-log');
const clearLogBtn = document.getElementById('clear-log');

const initialAccuracyEl = document.getElementById('initial-accuracy');
const finalAccuracyEl = document.getElementById('final-accuracy');
const simResultEl = document.getElementById('sim-result');

const pbScan = document.getElementById('pb-scan');
const pbConnect = document.getElementById('pb-connect');
const pbExtract = document.getElementById('pb-extract');
const pbEncrypt = document.getElementById('pb-encrypt');
const pbTransfer = document.getElementById('pb-transfer');
const pbDecrypt = document.getElementById('pb-decrypt');

let matrixInterval = null;
let running = false;
let currentLog = '';

function appendLog(line){
  const time = new Date().toLocaleTimeString();
  currentLog += `[${time}] ${line}\n`;
  logBox.textContent = currentLog;
  logBox.scrollTop = logBox.scrollHeight;
}

function randBetween(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

function startMatrixEffect(){
  matrixArea.textContent = '';
  matrixInterval = setInterval(() => {
    // create a line of random 0/1, length based on width
    const width = Math.max(60, Math.floor(matrixArea.clientWidth / 6));
    let line = '';
    for(let i=0;i<width;i++){
      line += (Math.random() > 0.5 ? '1' : '0');
    }
    // occasionally include some words
    if(Math.random() < 0.08){
      const phrases = ['INITIALIZING','BYPASS','INTRUSION','DECRYPT','EXFIL','BACKDOOR'];
      const p = phrases[Math.floor(Math.random()*phrases.length)];
      const pos = Math.floor(Math.random() * (Math.max(1,width - p.length)));
      line = line.substring(0,pos) + p + line.substring(pos + p.length);
    }
    matrixArea.textContent = line + '\n' + matrixArea.textContent;
    // keep matrixArea to a limited amount
    const maxLines = 200;
    const lines = matrixArea.textContent.split('\n').slice(0,maxLines);
    matrixArea.textContent = lines.join('\n');
  }, 80);
}

function stopMatrixEffect(){
  if(matrixInterval) clearInterval(matrixInterval);
  matrixInterval = null;
}

function animateProgressBar(barEl, durationSecs){
  return new Promise(resolve => {
    barEl.style.width = '0%';
    const start = Date.now();
    const duration = Math.max(350, durationSecs*1000);
    function tick(){
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.floor((elapsed/duration)*100));
      barEl.style.width = pct + '%';
      if(pct >= 100){
        resolve();
      } else {
        requestAnimationFrame(tick);
      }
    }
    tick();
  });
}

async function runSimulation(targetId){
  if(running) return;
  running = true;
  simStatus.classList.remove('hidden');
  currentLog = '';
  logBox.textContent = '';

  const initialAcc = randBetween(85,100);
  initialAccuracyEl.textContent = initialAcc + '%';
  appendLog(`Last accuracy: ${initialAcc}%`);
  appendLog(`Target ID: ${targetId || '(none)'}`);

  startMatrixEffect();
  appendLog('Scanning network for target...');
  await animateProgressBar(pbScan, 4);
  appendLog('Scan complete.');

  appendLog('Connecting to target...');
  await animateProgressBar(pbConnect, 2);
  appendLog('Connected.');

  appendLog('Extracting data from target...');
  await animateProgressBar(pbExtract, 3);
  appendLog('Extraction complete.');

  appendLog('Encrypting data...');
  await animateProgressBar(pbEncrypt, 2);
  appendLog('Data encrypted.');

  appendLog('Transferring data to secure server...');
  await animateProgressBar(pbTransfer, 4);
  appendLog('Transfer complete.');

  appendLog('Decrypting data...');
  await animateProgressBar(pbDecrypt, 2);
  appendLog('Decryption complete.');

  stopMatrixEffect();

  // Generate result and final accuracy
  const result = (Math.random() < 0.5) ? '🟢' : '🔴';
  const finalAcc = randBetween(90,100);
  simResultEl.textContent = `${result} Target ID: ${targetId || '(none)'}`;
  finalAccuracyEl.textContent = finalAcc + '%';
  appendLog(`Final Accuracy: ${finalAcc}%`);
  appendLog(`Result: ${result}`);

  // prepare log file content
  appendLog('Generating log file...');
  appendLog('Log file ready.');

  running = false;
}

startHackBtn.addEventListener('click', () => {
  const targetId = document.getElementById('target-input').value.trim();
  runSimulation(targetId);
});

abortHackBtn.addEventListener('click', () => {
  if(!running){
    appendLog('No simulation currently running.');
    return;
  }
  // Simple abort: stop matrix and reset bars
  stopMatrixEffect();
  [pbScan,pbConnect,pbExtract,pbEncrypt,pbTransfer,pbDecrypt].forEach(b => b.style.width = '0%');
  appendLog('Simulation aborted by user.');
  running = false;
});

downloadLogBtn.addEventListener('click', () => {
  if(!currentLog){
    alert('No log available yet. Run a simulation first.');
    return;
  }
  const blob = new Blob([`Hack Log\n--------\n${currentLog}`], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hack_log.txt';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 500);
});

clearLogBtn.addEventListener('click', () => {
  currentLog = '';
  logBox.textContent = '';
  appendLog('Logs cleared.');
});
