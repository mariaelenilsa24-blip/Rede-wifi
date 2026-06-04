// Padrões comuns em senhas WiFi
const commonPatterns = {
    sequences: ['12345', '123456', 'abcde', 'qwerty'],
    dates: [/\d{4}/, /\d{2}\d{2}/],
    repetitions: /(.)\1{3,}/,
    dictionary: ['admin', 'password', 'wifi', 'router', 'casa', 'casa2024']
};

// Analisador de Força de Senha
const passwordInput = document.getElementById('passwordInput');
const togglePassword = document.getElementById('togglePassword');
const result = document.getElementById('result');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const analysis = document.getElementById('analysis');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
});

passwordInput.addEventListener('input', analyzePassword);

function analyzePassword() {
    const password = passwordInput.value;
    
    if (password.length === 0) {
        result.classList.add('result-hidden');
        return;
    }
    
    result.classList.remove('result-hidden');
    
    // Calcular força
    let strength = 0;
    const feedback = [];
    
    // Verificar comprimento
    if (password.length >= 16) strength += 25;
    else if (password.length >= 12) strength += 20;
    else if (password.length >= 8) strength += 10;
    else strength += 5;
    
    if (password.length < 8) {
        feedback.push({ text: '❌ Muito curta (mín. 8 caracteres)', type: 'bad' });
    } else if (password.length < 12) {
        feedback.push({ text: '⚠️ Comprimento adequado (recomendado 12+)', type: 'medium' });
    } else {
        feedback.push({ text: '✅ Comprimento excelente', type: 'good' });
    }
    
    // Verificar maiúsculas
    if (/[A-Z]/.test(password)) {
        strength += 15;
        feedback.push({ text: '✅ Contém letras maiúsculas', type: 'good' });
    } else {
        feedback.push({ text: '❌ Sem letras maiúsculas', type: 'bad' });
    }
    
    // Verificar minúsculas
    if (/[a-z]/.test(password)) {
        strength += 15;
        feedback.push({ text: '✅ Contém letras minúsculas', type: 'good' });
    } else {
        feedback.push({ text: '❌ Sem letras minúsculas', type: 'bad' });
    }
    
    // Verificar números
    if (/[0-9]/.test(password)) {
        strength += 15;
        feedback.push({ text: '✅ Contém números', type: 'good' });
    } else {
        feedback.push({ text: '❌ Sem números', type: 'bad' });
    }
    
    // Verificar símbolos
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        strength += 20;
        feedback.push({ text: '✅ Contém símbolos especiais', type: 'good' });
    } else {
        feedback.push({ text: '⚠️ Sem símbolos especiais', type: 'medium' });
    }
    
    // Verificar padrões comuns
    let hasPattern = false;
    
    // Sequências
    for (let seq of commonPatterns.sequences) {
        if (password.toLowerCase().includes(seq)) {
            feedback.push({ text: '❌ Contém sequência óbvia: ' + seq, type: 'bad' });
            strength -= 20;
            hasPattern = true;
        }
    }
    
    // Repetições
    if (commonPatterns.repetitions.test(password)) {
        feedback.push({ text: '❌ Contém caracteres repetidos', type: 'bad' });
        strength -= 15;
        hasPattern = true;
    }
    
    // Palavras dicionário
    for (let word of commonPatterns.dictionary) {
        if (password.toLowerCase().includes(word)) {
            feedback.push({ text: '❌ Contém palavra comum: ' + word, type: 'bad' });
            strength -= 15;
            hasPattern = true;
        }
    }
    
    // Verificar datas
    if (/19\d{2}|20\d{2}/.test(password) || /\d{2}[\/\-]\d{2}[\/\-]\d{4}/.test(password)) {
        feedback.push({ text: '⚠️ Contém possível data', type: 'medium' });
        strength -= 10;
        hasPattern = true;
    }
    
    if (!hasPattern) {
        feedback.push({ text: '✅ Sem padrões óbvios detectados', type: 'good' });
    }
    
    // Limitar força a 100
    strength = Math.min(100, Math.max(0, strength));
    
    // Atualizar barra
    strengthBar.style.width = strength + '%';
    
    if (strength < 30) {
        strengthBar.style.backgroundColor = '#ef4444';
        strengthText.textContent = '🔴 Muito Fraca';
        strengthText.style.color = '#ef4444';
    } else if (strength < 50) {
        strengthBar.style.backgroundColor = '#f59e0b';
        strengthText.textContent = '🟠 Fraca';
        strengthText.style.color = '#f59e0b';
    } else if (strength < 75) {
        strengthBar.style.backgroundColor = '#eab308';
        strengthText.textContent = '🟡 Média';
        strengthText.style.color = '#eab308';
    } else if (strength < 90) {
        strengthBar.style.backgroundColor = '#84cc16';
        strengthText.textContent = '🟢 Forte';
        strengthText.style.color = '#84cc16';
    } else {
        strengthBar.style.backgroundColor = '#10b981';
        strengthText.textContent = '🟢 Muito Forte';
        strengthText.style.color = '#10b981';
    }
    
    // Atualizar análise
    analysis.innerHTML = feedback
        .map(item => `<div class="analysis-item ${item.type}">${item.text}</div>`)
        .join('');
}

// Gerador de Senhas
const generateBtn = document.getElementById('generateBtn');
const generatedPasswordDiv = document.getElementById('generatedPassword');
const passwordOutput = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const uppercase = document.getElementById('uppercase');
const lowercase = document.getElementById('lowercase');
const numbers = document.getElementById('numbers');
const symbols = document.getElementById('symbols');
const length = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');

length.addEventListener('input', () => {
    lengthValue.textContent = length.value;
});

generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyPassword);

function generatePassword() {
    let chars = '';
    const pwdLength = parseInt(length.value);
    
    if (uppercase.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase.checked) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers.checked) chars += '0123456789';
    if (symbols.checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (chars === '') {
        alert('Selecione pelo menos uma opção!');
        return;
    }
    
    let password = '';
    for (let i = 0; i < pwdLength; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    passwordOutput.value = password;
    generatedPasswordDiv.classList.remove('generated-password-hidden');
}

function copyPassword() {
    passwordOutput.select();
    document.execCommand('copy');
    
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✅ Copiado!';
    setTimeout(() => {
        copyBtn.textContent = originalText;
    }, 2000);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 WiFi Security Education loaded');
    console.log('Use este conhecimento responsavelmente!');
});