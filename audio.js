/**
 * 音频层 (audio.js)
 * 负责所有语音合成和播放功能
 */

let chineseVoice = null;

function initAudio() {
    if (!('speechSynthesis' in window)) {
        console.warn('您的浏览器不支持语音合成功能');
        return;
    }
    speechSynthesis.onvoiceschanged = () => {
        const voices = speechSynthesis.getVoices();
        chineseVoice = voices.find(v => v.lang.includes('zh')) || null;
    };
    speechSynthesis.getVoices();
}

function playWord(word, mode = 'english', speechRate = 1, onEnd = null) {
    if (!('speechSynthesis' in window)) return;
    if (!word || String(word).trim() === '') return;

    const wordStr = String(word);

    // 关键：只做 resume，绝不做 pause
    // pause() 可能让 Chrome 进入永久暂停状态，resume() 救不回来
    speechSynthesis.resume();

    const utterance = new SpeechSynthesisUtterance(wordStr);

    if (mode === 'chinese') {
        utterance.lang = 'zh-CN';
        if (chineseVoice) {
            utterance.voice = chineseVoice;
        } else {
            const match = speechSynthesis.getVoices().find(v => v.lang.includes('zh'));
            if (match) utterance.voice = match;
        }
    } else {
        utterance.lang = 'en-US';
    }

    utterance.rate = Math.max(0.1, Math.min(10, speechRate));
    utterance.pitch = 1;
    utterance.volume = 1;

    if (onEnd) utterance.onend = onEnd;

    speechSynthesis.speak(utterance);
}

function cancelAllSpeech() {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }
}

window.AudioManager = {
    init: initAudio,
    playWord,
    cancelAll: cancelAllSpeech
};