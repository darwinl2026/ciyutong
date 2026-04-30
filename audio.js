/**
 * 音频层 (audio.js)
 * 负责所有语音合成和播放功能
 */

// 全局中文语音变量
let chineseVoice = null;

/**
 * 初始化语音系统
 */
function initAudio() {
    if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = () => {
            const voices = speechSynthesis.getVoices();
            chineseVoice = voices.find(v => v.lang.includes('zh')) || null;
        };
        // 某些浏览器需要手动触发
        speechSynthesis.getVoices();
        
        // 检查语音支持
        if (!('speechSynthesis' in window)) {
            console.warn('您的浏览器不支持语音合成功能');
        }
    } else {
        console.warn('您的浏览器不支持语音合成功能');
    }
}

/**
 * 播放单词/词语朗读
 * @param {string} word - 要播放的单词或词语
 * @param {string} mode - 当前模式 'english' 或 'chinese'
 * @param {number} speechRate - 播放速率
 */
function playWord(word, mode = 'english', speechRate = 1) {
    if (!('speechSynthesis' in window)) return;

    // 不再调用cancel()，避免中断正在排队的语音
    // speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);

    // 根据当前模式设置语音语言
    if (mode === 'chinese') {
        utterance.lang = 'zh-CN';
        // 尝试使用中文语音
        if (chineseVoice) {
            utterance.voice = chineseVoice;
        } else {
            const voices = speechSynthesis.getVoices();
            const chineseVoiceMatch = voices.find(v => v.lang.includes('zh'));
            if (chineseVoiceMatch) {
                utterance.voice = chineseVoiceMatch;
            }
        }
    } else {
        utterance.lang = 'en-US';
    }

    utterance.rate = Math.max(0.1, Math.min(10, speechRate));
    utterance.pitch = 1;
    utterance.volume = 1;

    speechSynthesis.speak(utterance);
}

/**
 * 播放提示音
 * @param {string} type - 'success', 'error', 'info'
 */
function playSound(type = 'info') {
    if (!('speechSynthesis' in window)) return;
    
    const utterance = new SpeechSynthesisUtterance('');
    utterance.rate = 0;
    
    // 使用不同的音调区分类型
    switch(type) {
        case 'success':
            utterance.pitch = 1.5;
            break;
        case 'error':
            utterance.pitch = 0.8;
            break;
        default:
            utterance.pitch = 1;
    }
    
    speechSynthesis.speak(utterance);
}

// 导出模块
window.AudioManager = {
    init: initAudio,
    playWord,
    playSound,
    getChineseVoice: () => chineseVoice
};