/**
 * 英语听写工具 - 主入口文件
 * 模块化的应用核心
 */

// 全局状态管理
const App = {
    // 当前模式：'english' 或 'chinese'
    currentMode: 'english',
    
    // 英语词库
    englishWords: [],
    englishErrors: {},
    englishSelectedWords: new Set(),
    englishSelectedErrorWords: new Set(),
    
    // 语文词库
    chineseWords: [],
    chineseErrors: {},
    chineseSelectedWords: new Set(),
    chineseSelectedErrorWords: new Set(),

    // 自定义词库（树形结构）
    englishCustomBooks: {},
    chineseCustomBooks: {},
    
    // 展开状态（用于树形UI）
    expandedFolders: {
        english: new Set(),
        chinese: new Set()
    },

    // 通用状态
    currentSession: [],
    currentIndex: 0,
    correctCount: 0,
    isDictating: false,
    autoPlayTimer: null,
    
    // 单词ID递增计数器，确保ID唯一
    nextId: 1,
    
    // 词库排序状态
    isSortedByAlpha: false,

    // 词库全选切换状态（true=高亮/已全选，false=非高亮/未全选）
    isWordAllSelected: false,

    // 错题本排序状态（true=按字母，false=按默认）
    isErrorSortedByAlpha: false,

    // 错题本全选切换状态
    isErrorAllSelected: false,

    // 临时显示单词状态（true=强制显示完整单词，false=按设置显示）
    isTempShowingWord: false,

    // 最近一次听写记录（保存原始顺序，用于导出）
    lastDictationSession: [],
    
    // 拼读练习状态
    currentPhonicsPractice: null,
    
    // 通用设置
    settings: {
        range: 'all',
        order: 'sequential',
        playCount: 2,
        intervalTime: 5,
        speechRate: 0.85,
        showMeaning: false,
        showWord: false,
        showExamples: false,
        inputMode: 'offline'
    }
};

// 别名访问器
Object.defineProperty(App, 'words', {
    get() { return App.currentMode === 'english' ? App.englishWords : App.chineseWords; },
    set(val) { 
        if (App.currentMode === 'english') App.englishWords = val;
        else App.chineseWords = val;
    }
});

Object.defineProperty(App, 'errors', {
    get() { return App.currentMode === 'english' ? App.englishErrors : App.chineseErrors; },
    set(val) { 
        if (App.currentMode === 'english') App.englishErrors = val;
        else App.chineseErrors = val;
    }
});

Object.defineProperty(App, 'selectedWords', {
    get() { return App.currentMode === 'english' ? App.englishSelectedWords : App.chineseSelectedWords; }
});

Object.defineProperty(App, 'selectedErrorWords', {
    get() { return App.currentMode === 'english' ? App.englishSelectedErrorWords : App.chineseSelectedErrorWords; }
});

// ==================== 数据持久化 ====================

function saveData() {
    DataManager.save(
        App.englishWords, App.englishErrors,
        App.chineseWords, App.chineseErrors,
        App.settings, App.currentMode,
        App.englishCustomBooks, App.chineseCustomBooks
    );
}

function loadData() {
    const data = DataManager.load();

    App.englishWords = data.englishWords;
    App.englishErrors = data.englishErrors;
    App.chineseWords = data.chineseWords;
    App.chineseErrors = data.chineseErrors;
    App.settings = { ...App.settings, ...data.settings };

    if (data.mode === 'english' || data.mode === 'chinese') {
        App.currentMode = data.mode;
    }
    
    // 加载自定义词库（自动迁移旧数据到树形结构）
    App.englishCustomBooks = migrateToTreeStructure(data.englishCustomBooks || {});
    App.chineseCustomBooks = migrateToTreeStructure(data.chineseCustomBooks || {});
    
    // 初始化展开状态（根目录默认展开）
    if (!App.expandedFolders) {
        App.expandedFolders = { english: new Set(), chinese: new Set() };
    }
    App.expandedFolders[App.currentMode].add('root');
}

// ==================== 初始化 ====================

function initApp() {
    loadData();
    
    // 初始化音频
    AudioManager.init();
    
    // 更新UI
    updateModeUI(App.currentMode, App.settings);
    renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
    renderCustomWordBooks();
    
    // 初始化预设词库折叠状态（默认折叠）
    initPresetSectionCollapse();

    renderErrorList(App.errors, App.selectedErrorWords, App.words);
    updateCounts(App.words, App.selectedWords);
    updateErrorCounts();
    
    // 设置事件监听
    setupEventListeners(App.settings);
    
    // 注册PWA
    registerPWA();
    
    // 键盘快捷键
    setupKeyboardShortcuts();
    
    console.log('✅ 英语听写工具已就绪');
}

// PWA注册
function registerPWA() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => {
                    console.log('SW registered:', registration.scope);
                })
                .catch((error) => {
                    console.log('SW registration failed:', error);
                });
        });
    }
}

// 键盘快捷键
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+Enter 开始听写
        if (e.ctrlKey && e.key === 'Enter' && !App.isDictating) {
            startDictation();
        }
        // Escape 停止听写
        else if (e.key === 'Escape' && App.isDictating) {
            stopDictation();
        }
        // Escape 清空搜索（不在输入框中时）
        else if (e.key === 'Escape' && !App.isDictating && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            const searchInput = document.getElementById('wordSearchInput');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                currentWordSearch = '';
                renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
            }
        }
        // Space 播放当前单词（仅在听写时，且不在输入框/文本框中）
        else if (e.key === ' ' && App.isDictating && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            playWord(App.currentSession[App.currentIndex]?.word, App.currentMode, App.settings.speechRate);
        }
    });
}

// ==================== 模式切换 ====================

function switchMode(mode) {
    if (App.currentMode === mode) return;

    App.currentMode = mode;
    App.selectedWords.clear();
    App.selectedErrorWords.clear();
    App.currentSession = [];
    App.currentIndex = 0;
    App.correctCount = 0;
    App.isDictating = false;
    App.isSortedByAlpha = false;
    App.isWordAllSelected = false;
    App.isErrorSortedByAlpha = false;

    if (App.autoPlayTimer) {
        clearTimeout(App.autoPlayTimer);
        App.autoPlayTimer = null;
    }

    saveData();
    updateModeUI(App.currentMode, App.settings);
    renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
    renderCustomWordBooks();
    renderErrorList(App.errors, App.selectedErrorWords, App.words);
    updateCounts(App.words, App.selectedWords);
    updateErrorCounts();

    // 重置排序按钮状态
    const sortWordsBtn = document.getElementById('sortWordsBtn');
    if (sortWordsBtn) {
        sortWordsBtn.classList.remove('active');
    }
    const sortErrorsBtn = document.getElementById('sortErrorsBtn');
    if (sortErrorsBtn) {
        sortErrorsBtn.classList.remove('active');
    }
    const selectAllBtn = document.getElementById('selectAllBtn');
    if (selectAllBtn) {
        selectAllBtn.classList.remove('active');
    }
    
    // 清空搜索框
    const searchInput = document.getElementById('wordSearchInput');
    if (searchInput) {
        searchInput.value = '';
        currentWordSearch = '';
    }
}

// ==================== 词库排序 ====================

function toggleWordSort() {
    App.isSortedByAlpha = !App.isSortedByAlpha;

    if (App.isSortedByAlpha) {
        // 按首字母A-Z排序（不区分大小写）
        App.words.sort((a, b) => a.word.toLowerCase().localeCompare(b.word.toLowerCase()));
        showNotification('已按字母顺序排列', 'info');
    } else {
        // 恢复添加顺序（按id升序）
        App.words.sort((a, b) => a.id - b.id);
        showNotification('已恢复默认排序', 'info');
    }

    renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);

    // 更新按钮状态
    const sortBtn = document.getElementById('sortWordsBtn');
    if (sortBtn) {
        sortBtn.classList.toggle('active', App.isSortedByAlpha);
    }
}

// ==================== 词库全选切换 ====================

function toggleWordSelectAll() {
    App.isWordAllSelected = !App.isWordAllSelected;

    if (App.isWordAllSelected) {
        // 全选：选中所有单词
        App.words.forEach(w => App.selectedWords.add(w.id));
        showNotification('已全选', 'info');
    } else {
        // 清空：取消所有选中
        App.selectedWords.clear();
        showNotification('已取消全选', 'info');
    }

    renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
    updateCounts(App.words, App.selectedWords);

    // 更新按钮状态
    const selectAllBtn = document.getElementById('selectAllBtn');
    if (selectAllBtn) {
        selectAllBtn.classList.toggle('active', App.isWordAllSelected);
    }
}

// ==================== 单词管理 ====================

/**
 * 解析单词输入行
 * 支持格式：
 *   英语模式：
 *   - apple 苹果           （空格分隔）
 *   - banana,香蕉         （逗号分隔）
 *   - apple   苹果         （多个空格/Tab分隔）
 *   - apple苹果            （粘连，自动识别）
 *   - get up 起床         （英文词组）
 *   - hello world.        （英文句子，自动识别）
 *   语文模式：
 *   - 屋檐               （纯中文，直接导入）
 * @param {string} line - 输入行
 * @param {string} mode - 'english' 或 'chinese'
 * @returns {object|null} - { word, meaning } 或 null（无效行）
 */
function parseWordLine(line, mode = 'english') {
    const trimmed = line.trim();
    if (!trimmed) return null;

    // 语文模式：直接返回纯中文内容
    if (mode === 'chinese') {
        return { word: trimmed, meaning: null };
    }

    // 英语模式：检测是否包含中文字符
    const hasChinese = /[\u4e00-\u9fff]/.test(trimmed);

    if (hasChinese) {
        // 方案：找到最后一个英文字母的位置，在此位置之后第一个汉字作为分界点
        // 扫描字符串，从后往前找英文字母
        let lastLetterIndex = -1;
        for (let i = 0; i < trimmed.length; i++) {
            const char = trimmed[i];
            if (/[a-zA-Z]/.test(char)) {
                lastLetterIndex = i;
            }
        }
        
        if (lastLetterIndex >= 0) {
            // 在最后一个英文字母之后，找到第一个汉字的位置
            let splitIndex = -1;
            for (let i = lastLetterIndex + 1; i < trimmed.length; i++) {
                if (/[\u4e00-\u9fff]/.test(trimmed[i])) {
                    splitIndex = i;
                    break;
                }
            }
            
            if (splitIndex > lastLetterIndex) {
                const englishPart = trimmed.substring(0, splitIndex);
                const chinesePart = trimmed.substring(splitIndex);
                
                // 确保英文部分以字母开头
                if (/^[a-zA-Z]/i.test(englishPart)) {
                    return { word: englishPart, meaning: chinesePart };
                }
            }
        }

        // 有中文但无法解析 → 跳过
        return null;
    } else {
        // 情况B: 输入不包含中文（纯英文）
        return { word: trimmed, meaning: null };
    }
}

async function bulkImportWords() {
    const textarea = document.getElementById('bulkImport');
    const text = textarea.value.trim();

    if (!text) {
        showNotification(App.currentMode === 'english' ? '请输入单词' : '请输入词语', 'error');
        return;
    }

    const parsedLines = [];  // { word, meaning, line }
    const seen = new Set(App.words.map(w => w.word.toLowerCase()));
    let skippedCount = 0;
    const skippedLines = [];

    text.split(/\n/).forEach((line, lineIndex) => {
        const result = parseWordLine(line, App.currentMode);
        
        if (result === null) {
            // 无效行（如纯中文、空行等）
            const trimmed = line.trim();
            if (trimmed && !seen.has(trimmed.toLowerCase())) {
                // 记录跳过的行（可能是用户输入错误）
                skippedLines.push(lineIndex + 1);
                skippedCount++;
            }
            return;
        }

        // 检查是否重复
        if (seen.has(result.word)) {
            skippedCount++;
            return;
        }

        parsedLines.push(result);
        seen.add(result.word);
    });

    if (parsedLines.length === 0) {
        const msg = skippedCount > 0 
            ? `没有新单词可导入（${skippedCount}行格式无效或重复）` 
            : '没有新单词可导入';
        showNotification(App.currentMode === 'english' ? msg : '没有新词语可导入', 'info');
        return;
    }

    const startTime = Date.now();
    const wordType = App.currentMode === 'english' ? '单词' : '词语';
    showNotification(`正在导入 ${parsedLines.length} 个${wordType}，请稍候...`, 'info');

    // 语文模式：直接批量添加
    if (App.currentMode === 'chinese') {
        const idBase = App.nextId;
        App.nextId += parsedLines.length;
        const results = parsedLines.map((item, index) => ({
            id: idBase + index,
            word: item.word,
            meaning: item.meaning || '',
            pronunciation: '',
            partOfSpeech: '',
            addedAt: new Date().toISOString()
        }));

        App.words.push(...results);
        saveData();
        renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
        updateCounts(App.words, App.selectedWords);
        textarea.value = '';

        const totalTime = Math.round((Date.now() - startTime) / 1000);
        const skipMsg = skippedCount > 0 ? ` | 跳过${skippedCount}行` : '';
        showNotification(`导入完成: ${results.length}个${wordType}${skipMsg} | 用时: ${totalTime}秒`, 'success', 5000);
        return;
    }

    // 英语模式：批量获取单词信息
    const concurrencyLimit = 20;
    const results = [];
    let completed = 0;
    const idBase = App.nextId;
    App.nextId += parsedLines.length;

    // 统计用户自定义释义的数量
    const customMeaningCount = parsedLines.filter(p => p.meaning !== null).length;

    for (let i = 0; i < parsedLines.length; i += concurrencyLimit) {
        const batch = parsedLines.slice(i, i + concurrencyLimit);

        const batchPromises = batch.map(async (item, index) => {
            try {
                let data = { meaning: '', pronunciation: '', partOfSpeech: '' };

                // 如果用户提供了释义，直接使用，不再调用API
                if (item.meaning !== null) {
                    data.meaning = item.meaning;
                } else {
                    // 纯英文单词，调用API获取释义
                    data = await fetchWordData(item.word);
                }

                completed++;

                if (completed % 5 === 0) {
                    const progress = Math.round((completed / parsedLines.length) * 100);
                    const elapsed = Math.round((Date.now() - startTime) / 1000);
                    showNotification(`导入进度: ${progress}% (${completed}/${parsedLines.length}) | 已用时: ${elapsed}秒`, 'info', 2000);
                }

                return {
                    id: idBase + i + index,
                    word: item.word,
                    meaning: data.meaning || '',
                    pronunciation: data.pronunciation || '',
                    partOfSpeech: data.partOfSpeech || '',
                    addedAt: new Date().toISOString()
                };
            } catch (error) {
                completed++;
                return {
                    id: idBase + i + index,
                    word: item.word,
                    meaning: item.meaning || '',
                    pronunciation: '',
                    partOfSpeech: '',
                    addedAt: new Date().toISOString()
                };
            }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
    }

    const totalTime = Math.round((Date.now() - startTime) / 1000);

    App.words.push(...results);

    saveData();
    renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
    updateCounts(App.words, App.selectedWords);
    textarea.value = '';

    // 统计结果
    const successCount = results.filter(r => r.meaning && r.meaning.length > 0).length;
    const basicCount = results.length - successCount;
    const skipMsg = skippedCount > 0 ? ` | 跳过${skippedCount}行` : '';
    const customMsg = customMeaningCount > 0 ? ` | 自定义释义: ${customMeaningCount}个` : '';

    showNotification(`导入完成: ${results.length}个${wordType}${customMsg}${skipMsg} | 用时: ${totalTime}秒`, 'success', 5000);
}

function deleteWord(id) {
    if (!confirm('确定删除这个单词吗？')) return;

    App.words = App.words.filter(w => w.id !== id);
    App.selectedWords.delete(id);
    saveData();
    renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
    updateCounts(App.words, App.selectedWords);
    showNotification('单词已删除', 'info');
}

// 编辑单词释义
function editWordMeaning(wordId, newMeaning) {
    const word = App.words.find(w => w.id === wordId);
    if (!word) return;

    word.meaning = newMeaning.trim();
    saveData();
    renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
}

function toggleWordSelection(id) {
    if (App.selectedWords.has(id)) {
        App.selectedWords.delete(id);
    } else {
        App.selectedWords.add(id);
    }
    updateCounts(App.words, App.selectedWords);
}

function clearSelectedWords() {
    const selectedCount = App.selectedWords.size;
    if (selectedCount === 0) {
        showNotification('请先选择要清理的单词', 'warning');
        return;
    }

    if (!confirm(`确定要清理选中的 ${selectedCount} 个单词吗？`)) return;

    App.words = App.words.filter(w => !App.selectedWords.has(w.id));
    App.selectedWords.clear();
    saveData();
    renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
    updateCounts(App.words, App.selectedWords);
    showNotification(`已清理 ${selectedCount} 个单词`, 'info');
}

// ==================== 听写功能 ====================

function startDictation() {
    // 直接从DOM读取radio button的选中值
    const rangeRadio = document.querySelector('input[name="range"]:checked');
    const range = rangeRadio ? rangeRadio.value : 'all';

    // 直接从DOM读取播放顺序
    const orderRadio = document.querySelector('input[name="order"]:checked');
    const order = orderRadio ? orderRadio.value : 'sequential';

    // 直接从DOM读取播放次数
    const playCountSelect = document.getElementById('playCount');
    const playCount = parseInt(playCountSelect ? playCountSelect.value : '2');

    // 直接从DOM读取播放间隔
    const intervalTimeSelect = document.getElementById('intervalTime');
    const intervalTime = parseInt(intervalTimeSelect ? intervalTimeSelect.value : '5');

    // 直接从DOM读取朗读速度
    const speechRateSelect = document.getElementById('speechRate');
    const speechRate = parseFloat(speechRateSelect ? speechRateSelect.value : '1');

    // 直接从DOM读取抽词数量
    const wordPickCountInput = document.getElementById('wordPickCount');
    const wordPickCount = parseInt(wordPickCountInput ? wordPickCountInput.value : '0');

    // 直接从DOM读取显示选项
    const showMeaning = document.getElementById('showMeaning').checked;
    const showWord = document.getElementById('showWord').checked;

    // 直接从DOM读取输入模式
    const inputModeRadio = document.querySelector('input[name="inputMode"]:checked');
    const inputMode = inputModeRadio ? inputModeRadio.value : 'offline';

    let wordsToDictate = [];

    if (range === 'all') {
        wordsToDictate = [...App.words];
    } else if (range === 'selected') {
        if (App.selectedWords.size === 0) {
            showNotification('请先选择要听写的单词', 'error');
            return;
        }
        wordsToDictate = App.words.filter(w => App.selectedWords.has(w.id));
    } else if (range === 'errors') {
        const selectedErrors = App.selectedErrorWords.size > 0 ?
            Array.from(App.selectedErrorWords) :
            Object.keys(App.errors).filter(word => App.errors[word] > 0);

        if (selectedErrors.length === 0) {
            showNotification('错词本为空', 'error');
            return;
        }
        // 使用不区分大小写的比较
        const selectedErrorsLower = selectedErrors.map(w => w.toLowerCase());
        wordsToDictate = App.words.filter(w => selectedErrorsLower.includes(w.word.toLowerCase()));
        
        // 处理错词本中但不在词库中的单词 - 自动生成临时单词对象
        const foundWordsLower = wordsToDictate.map(w => w.word.toLowerCase());
        const notFoundInWordList = selectedErrors.filter(w => !foundWordsLower.includes(w.toLowerCase()));
        if (notFoundInWordList.length > 0) {
            console.log('[DEBUG] 以下错词本单词在词库中不存在，自动生成:', notFoundInWordList);
            const tempWords = notFoundInWordList.map(word => ({
                id: Date.now() + Math.random(),
                word: word,
                meaning: '',
                pronunciation: '',
                partOfSpeech: '',
                addedAt: new Date().toISOString(),
                isFromErrorBook: true
            }));
            wordsToDictate = [...wordsToDictate, ...tempWords];
        }
    }

    if (wordsToDictate.length === 0) {
        showNotification('没有可听写的单词', 'error');
        return;
    }

    // 抽词数量：先从范围内随机抽取指定数量的单词
    // 播放顺序：决定最终听写的排列顺序
    if (wordPickCount > 0 && wordPickCount < wordsToDictate.length) {
        // 无论播放顺序如何，抽词本身都是随机的
        wordsToDictate = shuffleArray(wordsToDictate).slice(0, wordPickCount);
    }

    // 根据播放顺序决定最终排列
    App.currentSession = order === 'random'
        ? shuffleArray(wordsToDictate)
        : wordsToDictate;

    // 保存最近一次听写记录（与实际听写顺序一致）
    App.lastDictationSession = [...App.currentSession];

    App.currentIndex = 0;
    App.correctCount = 0;
    App.isDictating = true;

    // 将设置保存回App.settings（保持一致性）
    App.settings.range = range;
    App.settings.order = order;
    App.settings.playCount = playCount;
    App.settings.intervalTime = intervalTime;
    App.settings.speechRate = speechRate;
    App.settings.inputMode = inputMode;
    App.settings.showMeaning = showMeaning;
    App.settings.showWord = showWord;

    document.getElementById('startDictationBtn').classList.add('hidden');
    document.getElementById('stopDictationBtn').classList.remove('hidden');
    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').focus();

    updateStats(App.currentIndex, App.currentSession.length, App.correctCount);
    updateControlButtons(App.isDictating, App.currentIndex, App.currentSession.length, App.autoPlayTimer);
    playCurrentWord();
    
    showNotification('开始听写', 'info');
}

function stopDictation() {
    App.isDictating = false;
    
    if (App.autoPlayTimer) {
        clearTimeout(App.autoPlayTimer);
        App.autoPlayTimer = null;
    }
    
    document.getElementById('startDictationBtn').classList.remove('hidden');
    document.getElementById('stopDictationBtn').classList.add('hidden');
    document.getElementById('displayWord').textContent = '准备开始';
    document.getElementById('displayHint').textContent = '';
    
    updateControlButtons(App.isDictating, App.currentIndex, App.currentSession.length, App.autoPlayTimer);
    
    const accuracy = App.currentSession.length > 0 
        ? Math.round((App.correctCount / App.currentSession.length) * 100) 
        : 0;
    
    showNotification(`听写完成！正确率: ${accuracy}%`, 'success');
}

function playCurrentWord() {
    if (!App.isDictating || App.currentIndex >= App.currentSession.length) {
        stopDictation();
        return;
    }

    const currentWord = App.currentSession[App.currentIndex];

    document.getElementById('displayWord').textContent =
        (App.settings.showWord || App.isTempShowingWord) ? currentWord.word : '♪';

    let hint = '';
    if (App.settings.showMeaning && currentWord.meaning) {
        hint += currentWord.meaning;
    }
    if (App.settings.showExamples && currentWord.examples && currentWord.examples.length > 0) {
        const examplesText = currentWord.examples.join(' / ');
        hint += hint ? '\n' : '';
        hint += '例句: ' + (examplesText.length > 50 ? examplesText.slice(0, 50) + '…' : examplesText);
    }
    document.getElementById('displayHint').textContent = hint;

    // 直接从DOM读取播放设置
    const playCountEl = document.getElementById('playCount');
    const actualPlayCount = parseInt(playCountEl ? playCountEl.value : '2');

    const speechRateEl = document.getElementById('speechRate');
    const actualSpeechRate = parseFloat(speechRateEl ? speechRateEl.value : '1');

    document.getElementById('answerInput').value = '';

    // 自动播放下一个：使用轮询检测语音完成 + 兜底定时器
    if (App.settings.intervalTime > 0 && App.settings.inputMode === 'offline') {
        if (App.autoPlayTimer) clearTimeout(App.autoPlayTimer);

        // 计算预估播放时长（保守估计：每个单词约2秒 + 间隔）
        const estimatedPlayTime = actualPlayCount * 2000; // 2秒/次，比实际稍长
        const totalWaitTime = estimatedPlayTime + App.settings.intervalTime * 1000;

        // 兜底定时器：保守估计播放时长
        App.autoPlayTimer = setTimeout(() => {
            nextWord();
        }, totalWaitTime);

        // 播放单词 (playCount=0时不朗读，用于线下自测模式)
        if (actualPlayCount > 0) {
            for (let i = 0; i < actualPlayCount; i++) {
                setTimeout(() => {
                    playWord(currentWord.word, App.currentMode, actualSpeechRate);
                }, i * 1500);
            }
        }
    } else if (actualPlayCount > 0) {
        // intervalTime=0 时，只播放不自动切换
        for (let i = 0; i < actualPlayCount; i++) {
            setTimeout(() => playWord(currentWord.word, App.currentMode, actualSpeechRate), i * 1500);
        }
    }

    updateStats(App.currentIndex, App.currentSession.length, App.correctCount);
    updateControlButtons(App.isDictating, App.currentIndex, App.currentSession.length, App.autoPlayTimer);
}

// 复读功能：固定播放1次，不受播放次数设置影响
function replayWord() {
    if (!App.isDictating || App.currentIndex >= App.currentSession.length) {
        stopDictation();
        return;
    }

    const currentWord = App.currentSession[App.currentIndex];
    const speechRateEl = document.getElementById('speechRate');
    const actualSpeechRate = parseFloat(speechRateEl ? speechRateEl.value : '1');

    playWord(currentWord.word, App.currentMode, actualSpeechRate);
}

// 临时显示单词：按下时强制显示完整单词信息，松开/下一题时恢复按设置显示
function toggleShowWord() {
    if (!App.isDictating) return;

    App.isTempShowingWord = !App.isTempShowingWord;

    // 重新渲染当前单词的显示
    const currentWord = App.currentSession[App.currentIndex];

    document.getElementById('displayWord').textContent =
        (App.settings.showWord || App.isTempShowingWord) ? currentWord.word : '♪';

    // 按下显示按钮时，强制显示释义+例句；平时按设置勾选显示
    let hint = '';
    if (App.isTempShowingWord) {
        // 强制显示模式：显示所有信息
        if (currentWord.meaning) hint += currentWord.meaning;
        if (currentWord.examples && currentWord.examples.length > 0) {
            const examplesText = currentWord.examples.join(' / ');
            hint += hint ? '\n' : '';
            hint += '例句: ' + (examplesText.length > 50 ? examplesText.slice(0, 50) + '…' : examplesText);
        }
    } else {
        // 普通模式：按勾选设置显示
        if (App.settings.showMeaning && currentWord.meaning) {
            hint += currentWord.meaning;
        }
        if (App.settings.showExamples && currentWord.examples && currentWord.examples.length > 0) {
            const examplesText = currentWord.examples.join(' / ');
            hint += hint ? '\n' : '';
            hint += '例句: ' + (examplesText.length > 50 ? examplesText.slice(0, 50) + '…' : examplesText);
        }
    }
    document.getElementById('displayHint').textContent = hint;

    // 更新按钮高亮状态
    const showWordBtn = document.getElementById('showWordBtn');
    if (showWordBtn) {
        showWordBtn.classList.toggle('active', App.isTempShowingWord);
    }
}

function playWord(word, mode, speechRate) {
    AudioManager.playWord(word, mode, speechRate);
}

function submitAnswer() {
    if (!App.isDictating) return;
    
    const currentWord = App.currentSession[App.currentIndex];
    const userAnswer = document.getElementById('answerInput').value.trim().toLowerCase();
    const correctAnswer = currentWord.word.toLowerCase();
    
    if (App.autoPlayTimer) {
        clearTimeout(App.autoPlayTimer);
        App.autoPlayTimer = null;
    }
    
    if (userAnswer === correctAnswer) {
        App.correctCount++;
        showNotification('✅ 正确！', 'success');
        
        if (App.errors[currentWord.word]) {
            App.errors[currentWord.word] = Math.max(0, App.errors[currentWord.word] - 1);
            if (App.errors[currentWord.word] === 0) {
                delete App.errors[currentWord.word];
            }
            saveData();
            renderErrorList(App.errors, App.selectedErrorWords, App.words);
        }
    } else {
        showNotification(`❌ 错误！正确答案是: ${currentWord.word}`, 'error');
        
        App.errors[currentWord.word] = (App.errors[currentWord.word] || 0) + 1;
        saveData();
        renderErrorList(App.errors, App.selectedErrorWords, App.words);
    }
    
    nextWord();
}

function skipWord() {
    if (!App.isDictating) return;
    
    const currentWord = App.currentSession[App.currentIndex];
    showNotification(`⏭️ 跳过！正确答案是: ${currentWord.word}`, 'info');
    
    App.errors[currentWord.word] = (App.errors[currentWord.word] || 0) + 1;
    saveData();
    renderErrorList(App.errors, App.selectedErrorWords, App.words);
    
    if (App.autoPlayTimer) {
        clearTimeout(App.autoPlayTimer);
        App.autoPlayTimer = null;
    }
    
    nextWord();
}

function previousWord() {
    if (!App.isDictating || App.currentIndex <= 0) return;

    App.currentIndex--;
    // 进入上一题时重置临时显示状态
    App.isTempShowingWord = false;
    const showWordBtn = document.getElementById('showWordBtn');
    if (showWordBtn) showWordBtn.classList.remove('active');
    playCurrentWord();
    updateStats(App.currentIndex, App.currentSession.length, App.correctCount);
    updateControlButtons(App.isDictating, App.currentIndex, App.currentSession.length, App.autoPlayTimer);
}

function togglePlayPause() {
    if (!App.isDictating) return;
    
    const btn = document.getElementById('playPauseBtn');
    
    if (App.autoPlayTimer) {
        clearTimeout(App.autoPlayTimer);
        App.autoPlayTimer = null;
        btn.innerHTML = '▶️ 播放';
    } else {
        btn.innerHTML = '⏸️ 暂停';
        playCurrentWord();
    }
}

function nextWord() {
    App.currentIndex++;

    // 进入下一题时重置临时显示状态
    App.isTempShowingWord = false;
    const showWordBtn = document.getElementById('showWordBtn');
    if (showWordBtn) showWordBtn.classList.remove('active');

    if (App.currentIndex >= App.currentSession.length) {
        stopDictation();
    } else {
        setTimeout(() => playCurrentWord(), 500);
    }

    updateStats(App.currentIndex, App.currentSession.length, App.correctCount);
    updateControlButtons(App.isDictating, App.currentIndex, App.currentSession.length, App.autoPlayTimer);
}

function handleEnter(event) {
    if (event.key === 'Enter' && App.isDictating) {
        submitAnswer();
    }
}

// ==================== 错题本 ====================

function addToErrorBook(word) {
    App.errors[word] = (App.errors[word] || 0) + 1;
    saveData();
    renderErrorList(App.errors, App.selectedErrorWords, App.words);
    showNotification(`已将"${word}"添加到错词本`, 'info');
}

function toggleErrorSelection(word) {
    if (App.selectedErrorWords.has(word)) {
        App.selectedErrorWords.delete(word);
    } else {
        App.selectedErrorWords.add(word);
    }
    renderErrorList(App.errors, App.selectedErrorWords, App.words);
    updateErrorCounts();
}

// ==================== 错题本全选切换 ====================

function toggleErrorSelectAll() {
    App.isErrorAllSelected = !App.isErrorAllSelected;

    const errorWords = Object.keys(App.errors).filter(word => App.errors[word] > 0);

    if (App.isErrorAllSelected) {
        // 全选：选中所有错词
        errorWords.forEach(word => App.selectedErrorWords.add(word));
        showNotification('已全选', 'info');
    } else {
        // 清空：取消所有选中
        App.selectedErrorWords.clear();
        showNotification('已取消全选', 'info');
    }

    renderErrorList(App.errors, App.selectedErrorWords, App.words);
    updateErrorCounts();

    // 更新按钮状态
    const selectAllBtn = document.getElementById('selectAllErrorsBtn');
    if (selectAllBtn) {
        selectAllBtn.classList.toggle('active', App.isErrorAllSelected);
    }
}

// ==================== 错题本排序 ====================

function toggleErrorSort() {
    App.isErrorSortedByAlpha = !App.isErrorSortedByAlpha;

    if (App.isErrorSortedByAlpha) {
        // 按首字母A-Z排序（不区分大小写）
        showNotification('已按字母顺序排列', 'info');
    } else {
        // 恢复默认排序：按错误次数降序，次数相同按添加时间升序
        showNotification('已恢复默认排序', 'info');
    }

    renderErrorList(App.errors, App.selectedErrorWords, App.words);

    // 更新按钮状态
    const sortBtn = document.getElementById('sortErrorsBtn');
    if (sortBtn) {
        sortBtn.classList.toggle('active', App.isErrorSortedByAlpha);
    }
}

function editErrorCount(word) {
    const currentCount = App.errors[word] || 0;
    const newCount = prompt(`修改 "${word}" 的错误次数（当前：${currentCount}次）`, currentCount);
    
    if (newCount === null) return;
    
    const count = parseInt(newCount);
    if (isNaN(count) || count < 0) {
        showNotification('请输入有效的数字', 'error');
        return;
    }
    
    if (count === 0) {
        delete App.errors[word];
        App.selectedErrorWords.delete(word);
    } else {
        App.errors[word] = count;
    }
    
    saveData();
    renderErrorList(App.errors, App.selectedErrorWords, App.words);
    updateErrorCounts();
    showNotification(`已更新 "${word}" 的错误次数`, 'success');
}

function deleteSelectedErrors() {
    if (App.selectedErrorWords.size === 0) {
        showNotification('请先选择要删除的错词', 'info');
        return;
    }
    
    if (!confirm(`确定删除选中的 ${App.selectedErrorWords.size} 个错词吗？`)) return;
    
    const wordsToDelete = Array.from(App.selectedErrorWords);
    
    wordsToDelete.forEach(word => {
        delete App.errors[word];
    });
    App.selectedErrorWords.clear();
    
    saveData();
    renderErrorList(App.errors, App.selectedErrorWords, App.words);
    updateErrorCounts();
    showNotification(`已删除 ${wordsToDelete.length} 个错词`, 'success');
}

function clearErrors() {
    if (!confirm('确定清空错词本吗？')) return;
    App.errors = {};
    saveData();
    renderErrorList(App.errors, App.selectedErrorWords, App.words);
    showNotification('错词本已清空', 'info');
}

function exportErrorBook() {
    if (Object.keys(App.errors).length === 0) {
        showNotification('错词本为空', 'error');
        return;
    }
    
    const format = prompt('选择导出格式 (1: TXT, 2: CSV, 3: JSON)', '1');
    let formatType = 'txt';
    if (format === '2') formatType = 'csv';
    else if (format === '3') formatType = 'json';
    
    // 如果有选中的错词，只导出选中的；否则导出全部
    const selectedWords = App.selectedErrorWords.size > 0
        ? Array.from(App.selectedErrorWords)
        : [];
    
    const result = DataManager.exportErrorBook(App.errors, formatType, selectedWords);
    
    if (result.count === 0) {
        showNotification('没有可导出的错词', 'error');
        return;
    }
    
    // 使用安全的日期格式
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const ext = formatType === 'csv' ? 'csv' : formatType === 'json' ? 'json' : 'txt';
    const selectedLabel = selectedWords.length > 0 ? `_已选${selectedWords.length}个` : `_共${result.count}个`;
    const filename = `错词本_${dateStr}${selectedLabel}.${ext}`;
    
    downloadFile(result.content, filename);
    showNotification(`错词本已导出 (${result.count}个)`, 'success');
}

function exportDictationRecord() {
    if (App.lastDictationSession.length === 0) {
        showNotification('没有可导出的听写记录', 'error');
        return;
    }
    
    const format = prompt('选择导出格式 (1: TXT, 2: CSV, 3: JSON)', '1');
    let formatType = 'txt';
    if (format === '2') formatType = 'csv';
    else if (format === '3') formatType = 'json';
    
    let content;
    const words = App.lastDictationSession;
    const modeLabel = App.currentMode === 'english' ? '英语' : '语文';
    // 使用安全的日期格式，避免文件名中的特殊字符
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
    const fullDateTime = `${dateStr} ${timeStr}`;
    
    // 处理单词对象（可能只是字符串或完整对象）
    const safeWords = words.map(w => typeof w === 'string' ? { word: w, meaning: '', pronunciation: '', partOfSpeech: '' } : w);
    
    if (formatType === 'txt') {
        // TXT格式：序号 单词 释义（每行一个）
        const lines = safeWords.map((w, i) => `${i + 1}. ${w.word}${w.meaning ? '  ' + w.meaning : ''}`);
        content = `听写记录 (${modeLabel}) - ${fullDateTime}\n${'='.repeat(40)}\n\n` + lines.join('\n');
    } else if (formatType === 'csv') {
        // CSV格式：序号,单词,释义,音标,词性
        const rows = [['序号', '单词', '释义', '音标', '词性']];
        safeWords.forEach((w, i) => {
            rows.push([i + 1, w.word, w.meaning || '', w.pronunciation || '', w.partOfSpeech || '']);
        });
        content = rows.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    } else {
        // JSON格式
        content = JSON.stringify({
            type: 'dictation_record',
            mode: App.currentMode,
            exportDate: fullDateTime,
            totalWords: safeWords.length,
            words: safeWords.map((w, i) => ({
                index: i + 1,
                word: w.word,
                meaning: w.meaning || '',
                pronunciation: w.pronunciation || '',
                partOfSpeech: w.partOfSpeech || ''
            }))
        }, null, 2);
    }
    
    const ext = formatType === 'csv' ? 'csv' : formatType === 'json' ? 'json' : 'txt';
    const filename = `听写记录_${modeLabel}_${dateStr}_${timeStr}.${ext}`;
    
    downloadFile(content, filename);
    showNotification(`听写记录已导出 (${safeWords.length}个单词)`, 'success');
}

// ==================== 导入导出 ====================

function exportWordList() {
    if (App.words.length === 0) {
        showNotification('词库为空', 'error');
        return;
    }
    
    const format = prompt('选择导出格式 (1: TXT, 2: CSV, 3: JSON)', '1');
    let formatType = 'txt';
    if (format === '2') formatType = 'csv';
    else if (format === '3') formatType = 'json';
    
    const result = DataManager.exportData(App.words, App.errors, formatType);
    
    // 使用安全的日期格式
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const ext = formatType === 'csv' ? 'csv' : formatType === 'json' ? 'json' : 'txt';
    const filename = `${App.currentMode === 'english' ? '英语' : '语文'}词库_${dateStr}.${ext}`;
    
    downloadFile(result.content, filename);
    showNotification(`词库已导出 (${result.count}个)`, 'success');
}

function downloadFile(content, filename) {
    // 确保内容是字符串类型
    const textContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    // 使用 Blob 创建下载链接，支持所有文件类型
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // 释放 Blob URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// ==================== 自定义词库 ====================

// 弹出保存自定义词库对话框
function promptSaveCustomBook() {
    const selectedIds = Array.from(App.selectedWords);

    if (selectedIds.length === 0) {
        showNotification('请先选择要保存的单词', 'error');
        return;
    }

    const customBooks = getCurrentCustomBooks();
    
    // 构建词库选项（按文件夹分组）
    const buildBookOptions = (parentId, depth = 0) => {
        const parent = customBooks[parentId];
        if (!parent || !parent.children) return '';
        
        let options = '';
        parent.children.forEach(childId => {
            const item = customBooks[childId];
            if (!item) return;
            
            if (item.type === 'book') {
                const indent = '　'.repeat(depth);
                options += `<option value="${childId}">${indent}追加到"${item.name}"（${item.words.length}个）</option>`;
            } else if (item.type === 'folder') {
                const indent = '　'.repeat(depth);
                options += `<optgroup label="${indent}📁 ${item.name}">`;
                options += buildBookOptions(childId, depth + 1);
                options += `</optgroup>`;
            }
        });
        return options;
    };
    
    const bookOptions = buildBookOptions('root');
    
    // 构建父文件夹选项
    const buildFolderOptions = (parentId, depth = 0) => {
        const parent = customBooks[parentId];
        if (!parent || !parent.children) return '';
        
        let options = '';
        parent.children.forEach(childId => {
            const item = customBooks[childId];
            if (!item || item.type !== 'folder') return;
            
            const indent = '　'.repeat(depth);
            options += `<option value="${childId}">${indent}${item.name}</option>`;
            options += buildFolderOptions(childId, depth + 1);
        });
        return options;
    };
    
    const folderOptions = buildFolderOptions('root');

    const selectHtml = `
        <p style="margin: 10px 0 5px;">保存位置：</p>
        <select id="customBookTarget" style="width: 100%; padding: 8px; margin-bottom: 10px;">
            <option value="">-- 新建词库 --</option>
            ${bookOptions ? `<optgroup label="追加到已有词库">${bookOptions}</optgroup>` : ''}
        </select>
        <p style="margin: 5px 0 5px;">保存到：</p>
        <select id="customBookParent" style="width: 100%; padding: 8px; margin-bottom: 10px;">
            <option value="root">根目录</option>
            ${folderOptions}
        </select>
        <p style="margin: 5px 0 5px;">词库名称：</p>
    `;
    
    const nameInputId = 'customBookName_' + Date.now();

    showCustomPrompt(
        `已选择 ${selectedIds.length} 个单词`,
        `${selectHtml}
        <input type="text" id="${nameInputId}" placeholder="输入词库名称" style="width: 100%; padding: 8px; margin-top: 5px;">`,
        function() {
            const targetValue = document.getElementById('customBookTarget')?.value || '';
            const parentId = document.getElementById('customBookParent')?.value || 'root';
            const name = document.getElementById(nameInputId)?.value || '';

            if (targetValue) {
                // 追加到已有词库
                appendToCustomWordBook(targetValue, selectedIds);
            } else {
                // 新建词库
                createCustomWordBook(name, selectedIds, parentId);
            }
            
            // 刷新自定义小词库显示
            renderCustomWordBooks();
            return true;
        }
    );
}

// 追加单词到已有词库
function appendToCustomWordBook(bookId, wordIds) {
    const customBooks = getCurrentCustomBooks();
    const book = customBooks[bookId];
    
    if (!book) {
        showNotification('未找到该词库', 'error');
        return false;
    }
    
    // 获取选中单词的完整数据
    const wordsToSave = wordIds.map(id => {
        const word = App.words.find(w => w.id === id);
        if (!word) return null;
        return {
            word: word.word,
            meaning: word.meaning || '',
            pronunciation: word.pronunciation || '',
            partOfSpeech: word.partOfSpeech || '',
            examples: word.examples || []
        };
    }).filter(w => w !== null);
    
    if (wordsToSave.length === 0) {
        showNotification('没有有效的单词可保存', 'error');
        return false;
    }
    
    // 去重追加
    const existingWords = new Set(book.words.map(w => w.word.toLowerCase()));
    const newWords = wordsToSave.filter(w => !existingWords.has(w.word.toLowerCase()));
    
    if (newWords.length === 0) {
        showNotification('选中的单词都已存在于该词库中', 'info');
        return false;
    }
    
    book.words.push(...newWords);
    saveData();
    showNotification(`已追加 ${newWords.length} 个单词到"${book.name}"`, 'success');
    return true;
}

// 显示自定义提示框
function showCustomPrompt(title, content, onConfirm) {
    const existingBackdrop = document.querySelector('.modal-backdrop');
    if (existingBackdrop) existingBackdrop.remove();
    const existingModal = document.querySelector('.custom-prompt-modal');
    if (existingModal) existingModal.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1000;';

    const modal = document.createElement('div');
    modal.className = 'custom-prompt-modal';
    modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:8px;min-width:350px;max-width:90%;z-index:1001;box-shadow:0 4px 20px rgba(0,0,0,0.2);';

    modal.innerHTML = `
        <h3 style="margin: 0 0 15px;">${title}</h3>
        <div id="customPromptContent">${content}</div>
        <div style="text-align: right; margin-top: 15px;">
            <button class="btn btn-secondary" onclick="closeCustomPrompt()">取消</button>
            <button class="btn btn-primary" id="customPromptConfirm">保存</button>
        </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    document.getElementById('customPromptConfirm').onclick = function() {
        if (onConfirm()) {
            closeCustomPrompt();
        }
    };

    backdrop.onclick = closeCustomPrompt;
}

function closeCustomPrompt() {
    const backdrop = document.querySelector('.modal-backdrop');
    const modal = document.querySelector('.custom-prompt-modal');
    if (backdrop) backdrop.remove();
    if (modal) modal.remove();
}

// 创建自定义小词库（从选中的单词创建，或追加到已有小词库）
function createCustomWordBook(name, wordIds, parentId = 'root') {
    if (!name || name.trim() === '') {
        showNotification('请输入小词库名称', 'error');
        return false;
    }

    if (!wordIds || wordIds.length === 0) {
        showNotification('请先选择要保存的单词', 'error');
        return false;
    }

    const customBooks = getCurrentCustomBooks();

    // 获取选中单词的完整数据
    const wordsToSave = wordIds.map(id => {
        const word = App.words.find(w => w.id === id);
        if (!word) return null;
        return {
            word: word.word,
            meaning: word.meaning || '',
            pronunciation: word.pronunciation || '',
            partOfSpeech: word.partOfSpeech || '',
            examples: word.examples || []
        };
    }).filter(w => w !== null);

    if (wordsToSave.length === 0) {
        showNotification('没有有效的单词可保存', 'error');
        return false;
    }

    // 创建新小词库
    const bookId = 'book_' + Date.now();
    customBooks[bookId] = {
        id: bookId,
        type: 'book',
        name: name.trim(),
        parent: parentId,
        children: [],
        words: wordsToSave,
        createdAt: new Date().toISOString()
    };
    
    // 添加到父节点的children
    if (customBooks[parentId]) {
        customBooks[parentId].children.push(bookId);
    }
    
    showNotification(`小词库"${name.trim()}"已创建，包含 ${wordsToSave.length} 个单词`, 'success');

    saveData();
    renderCustomWordBooks();
    return true;
}

// 从自定义小词库导入到主词库
function importCustomWordBook(bookId) {
    const customBooks = getCurrentCustomBooks();
    const book = customBooks[bookId];

    if (!book) {
        showNotification('未找到该小词库', 'error');
        return;
    }

    const existingWords = new Set(App.words.map(w => w.word.toLowerCase()));
    const newWords = book.words.filter(w => !existingWords.has(w.word.toLowerCase()));

    if (newWords.length === 0) {
        showNotification('该小词库的所有单词都已存在于词库中', 'info');
        return;
    }

    const idBase = App.nextId;
    App.nextId += newWords.length;

    const wordsToAdd = newWords.map((wordData, index) => ({
        id: idBase + index,
        word: wordData.word,
        meaning: wordData.meaning || '',
        pronunciation: wordData.pronunciation || '',
        partOfSpeech: wordData.partOfSpeech || '',
        examples: wordData.examples || [],
        addedAt: new Date().toISOString(),
        source: `custom_book:${bookId}`
    }));

    App.words.push(...wordsToAdd);
    saveData();
    renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
    updateCounts(App.words, App.selectedWords);

    showNotification(`已导入 ${newWords.length} 个单词到词库`, 'success');
}

// ==================== 树形词库管理 ====================

// 迁移旧扁平数据到树形结构
function migrateToTreeStructure(oldBooks) {
    // 如果已经包含 root 节点，说明已是新格式
    if (oldBooks.root && oldBooks.root.type === 'root') {
        return oldBooks;
    }
    
    // 构建新的树形结构
    const newBooks = {
        root: {
            id: 'root',
            type: 'root',
            name: '我的词库',
            children: []
        }
    };
    
    // 迁移旧数据
    Object.entries(oldBooks).forEach(([id, book]) => {
        if (book && book.id) {
            book.parent = 'root';
            book.children = book.children || [];
            newBooks[id] = book;
            newBooks.root.children.push(id);
        }
    });
    
    return newBooks;
}

// 获取当前模式的自定义词库树形结构
function getCurrentCustomBooks() {
    return App.currentMode === 'english' ? App.englishCustomBooks : App.chineseCustomBooks;
}

// 获取当前模式的展开状态
function getCurrentExpanded() {
    return App.expandedFolders[App.currentMode];
}

// 切换文件夹展开/折叠状态
function toggleFolderExpanded(folderId) {
    const expanded = getCurrentExpanded();
    if (expanded.has(folderId)) {
        expanded.delete(folderId);
    } else {
        expanded.add(folderId);
    }
    renderCustomWordBooks();
}

// 创建文件夹
function createFolder(name, parentId = 'root') {
    const customBooks = getCurrentCustomBooks();
    
    if (!name || name.trim() === '') {
        showNotification('请输入文件夹名称', 'error');
        return false;
    }
    
    // 检查是否已存在同名文件夹
    const existingNames = Object.values(customBooks)
        .filter(item => item.parent === parentId && item.type === 'folder')
        .map(item => item.name);
    if (existingNames.includes(name.trim())) {
        showNotification('该位置已存在同名文件夹', 'error');
        return false;
    }
    
    const folderId = 'folder_' + Date.now();
    customBooks[folderId] = {
        id: folderId,
        type: 'folder',
        name: name.trim(),
        parent: parentId,
        children: []
    };
    
    // 添加到父节点的children
    if (customBooks[parentId]) {
        customBooks[parentId].children.push(folderId);
    }
    
    // 默认展开新创建的文件夹
    getCurrentExpanded().add(folderId);
    
    saveData();
    renderCustomWordBooks();
    showNotification(`文件夹"${name.trim()}"已创建`, 'success');
    return true;
}

// 删除文件夹（递归删除所有子节点）
function deleteFolder(folderId) {
    const customBooks = getCurrentCustomBooks();
    const folder = customBooks[folderId];
    
    if (!folder || folder.type !== 'folder') {
        return false;
    }
    
    // 递归收集所有要删除的节点
    const toDelete = [];
    function collectIds(nodeId) {
        toDelete.push(nodeId);
        const node = customBooks[nodeId];
        if (node && node.children) {
            node.children.forEach(childId => collectIds(childId));
        }
    }
    collectIds(folderId);
    
    const confirmMsg = toDelete.length === 1 
        ? `确定要删除文件夹"${folder.name}"吗？`
        : `确定要删除文件夹"${folder.name}"及其所有内容（共${toDelete.length}项）吗？`;
    
    if (!confirm(confirmMsg)) {
        return false;
    }
    
    // 从父节点移除
    if (folder.parent && customBooks[folder.parent]) {
        const parent = customBooks[folder.parent];
        parent.children = parent.children.filter(id => id !== folderId);
    }
    
    // 删除所有节点
    toDelete.forEach(id => {
        delete customBooks[id];
        getCurrentExpanded().delete(id);
    });
    
    saveData();
    renderCustomWordBooks();
    showNotification('文件夹已删除', 'info');
    return true;
}

// 删除词库
function deleteCustomWordBook(bookId) {
    const customBooks = getCurrentCustomBooks();
    const book = customBooks[bookId];

    if (!book || book.type !== 'book') {
        return;
    }

    if (!confirm(`确定要删除词库"${book.name}"吗？\n词库中的单词不会被删除。`)) {
        return;
    }

    // 从父节点移除
    if (book.parent && customBooks[book.parent]) {
        const parent = customBooks[book.parent];
        parent.children = parent.children.filter(id => id !== bookId);
    }

    delete customBooks[bookId];
    saveData();
    renderCustomWordBooks();
    showNotification('词库已删除', 'info');
}

// 弹出创建文件夹对话框
function promptCreateFolder() {
    const customBooks = getCurrentCustomBooks();
    
    // 构建父文件夹选项（只能选根目录或一级文件夹）
    const folderOptions = Object.entries(customBooks)
        .filter(([id, item]) => item.type === 'root' || (item.type === 'folder' && item.parent === 'root'))
        .map(([id, item]) => `<option value="${id}">${item.name}</option>`)
        .join('');

    showCustomPrompt(
        '新建文件夹',
        `<p style="margin: 5px 0 5px;">保存位置：</p>
        <select id="folderParent" style="width: 100%; padding: 8px; margin-bottom: 10px;">
            <option value="root">根目录</option>
            ${folderOptions.replace('<option value="root">根目录</option>', '')}
        </select>
        <p style="margin: 5px 0 5px;">文件夹名称：</p>
        <input type="text" id="folderNameInput" placeholder="输入文件夹名称" style="width: 100%; padding: 8px;">`,
        function() {
            const parentId = document.getElementById('folderParent')?.value || 'root';
            const name = document.getElementById('folderNameInput')?.value || '';
            return createFolder(name, parentId);
        }
    );
}

// 移动词库/文件夹到指定位置
function moveItem(itemId, newParentId) {
    const customBooks = getCurrentCustomBooks();
    const item = customBooks[itemId];
    const newParent = customBooks[newParentId];
    
    if (!item || !newParent) {
        showNotification('无效的操作', 'error');
        return false;
    }
    
    // 不能移动到自己的子节点下
    function isDescendant(parentId, targetId) {
        const node = customBooks[parentId];
        if (!node || !node.children) return false;
        if (node.children.includes(targetId)) return true;
        return node.children.some(function(cid) { return isDescendant(cid, targetId); });
    }
    
    if (isDescendant(itemId, newParentId) || itemId === newParentId) {
        showNotification('不能移动到自身或子文件夹下', 'error');
        return false;
    }
    
    // 不能移动到book类型节点下
    if (newParent.type === 'book') {
        showNotification('不能移动到词库内', 'error');
        return false;
    }
    
    // 从原父节点移除
    if (item.parent && customBooks[item.parent]) {
        const oldParent = customBooks[item.parent];
        oldParent.children = oldParent.children.filter(id => id !== itemId);
    }
    
    // 添加到新父节点
    item.parent = newParentId;
    newParent.children.push(itemId);
    
    saveData();
    renderCustomWordBooks();
    showNotification(`已移动到"${newParent.name}"`, 'success');
    return true;
}

// 弹出移动位置对话框
function promptMoveItem(itemId) {
    const customBooks = getCurrentCustomBooks();
    const item = customBooks[itemId];
    
    if (!item) return;
    
    // 构建可选位置（排除自己和子节点）
    const availableParents = [];
    function collectParents(nodeId, depth, path) {
        const node = customBooks[nodeId];
        if (!node) return;
        
        // 排除自己
        if (nodeId === itemId) return;
        
        // 只允许移动到 root 或 folder 类型节点下（不能移动到 book 内）
        if (node.type === 'root' || node.type === 'folder') {
            availableParents.push({
                id: nodeId,
                name: (depth > 0 ? '  '.repeat(depth - 1) + '└ ' : '') + (node.type === 'root' ? '我的词库' : node.name),
                type: node.type
            });
        }
        
        if (node.children) {
            node.children.forEach(function(childId) { collectParents(childId, depth + 1, path + '/' + node.name); });
        }
    }
    collectParents('root', 0, '');
    
    const options = availableParents.map(p => 
        `<option value="${p.id}">${p.name}</option>`
    ).join('');
    
    const itemType = item.type === 'folder' ? '文件夹' : '词库';
    
    showCustomPrompt(
        `移动${itemType}`,
        `<p style="margin: 5px 0 5px;">选择新位置：</p>
        <select id="moveTargetParent" style="width: 100%; padding: 8px;">
            ${options}
        </select>`,
        function() {
            const newParentId = document.getElementById('moveTargetParent')?.value;
            if (newParentId) {
                return moveItem(itemId, newParentId);
            }
            return false;
        }
    );
}

// 获取词库所在文件夹路径
function getItemPath(itemId) {
    const customBooks = getCurrentCustomBooks();
    const path = [];
    let current = customBooks[itemId];

    while (current && current.parent) {
        if (current.parent !== 'root') {
            const parent = customBooks[current.parent];
            if (parent) {
                path.unshift(parent.name);
            }
        }
        current = customBooks[current.parent];
    }

    return path.join(' / ');
}

// 重命名文件夹或词库
function renameItem(itemId) {
    const customBooks = getCurrentCustomBooks();
    const item = customBooks[itemId];

    if (!item || item.type === 'root') {
        return;
    }

    const itemType = item.type === 'folder' ? '文件夹' : '词库';
    const currentName = item.name;

    showCustomPrompt(
        `重命名${itemType}`,
        `<p style="margin:5px 0;">当前名称：${escapeHtml(currentName)}</p>
        <p style="margin:5px 0 5px;">新名称：</p>
        <input type="text" id="renameItemInput" value="${escapeHtml(currentName)}" style="width:100%;padding:8px;">`,
        function() {
            const newName = document.getElementById('renameItemInput')?.value || '';
            if (!newName.trim()) {
                showNotification('名称不能为空', 'error');
                return false;
            }
            if (newName.trim() === currentName) {
                return true; // 没有变化，直接关闭
            }

            // 检查同名冲突
            const parent = customBooks[item.parent];
            if (parent && parent.children) {
                const siblings = parent.children.filter(id => id !== itemId);
                const nameConflict = siblings.some(id => {
                    const sibling = customBooks[id];
                    return sibling && sibling.name === newName.trim();
                });
                if (nameConflict) {
                    showNotification('该位置已存在同名项', 'error');
                    return false;
                }
            }

            item.name = newName.trim();
            saveData();
            renderCustomWordBooks();
            showNotification(`${itemType}"${newName.trim()}"已重命名`, 'success');
            return true;
        }
    );
}

// 向上移动项目（在同级列表中）
function moveItemUp(itemId) {
    const customBooks = getCurrentCustomBooks();
    const item = customBooks[itemId];

    if (!item || !item.parent) return;

    const parent = customBooks[item.parent];
    if (!parent || !parent.children) return;

    const index = parent.children.indexOf(itemId);
    if (index <= 0) return; // 已在最前面

    // 交换位置
    parent.children[index] = parent.children[index - 1];
    parent.children[index - 1] = itemId;

    saveData();
    renderCustomWordBooks();
}

// 向下移动项目（在同级列表中）
function moveItemDown(itemId) {
    const customBooks = getCurrentCustomBooks();
    const item = customBooks[itemId];

    if (!item || !item.parent) return;

    const parent = customBooks[item.parent];
    if (!parent || !parent.children) return;

    const index = parent.children.indexOf(itemId);
    if (index < 0 || index >= parent.children.length - 1) return; // 已在最后面

    // 交换位置
    parent.children[index] = parent.children[index + 1];
    parent.children[index + 1] = itemId;

    saveData();
    renderCustomWordBooks();
}

// ==================== 预设词库 ====================

function importPreset(presetKey) {
    if (typeof AllPresets === 'undefined') {
        showNotification('预设词库未加载，请刷新页面重试', 'error');
        return;
    }
    
    const preset = AllPresets[presetKey];
    if (!preset) {
        showNotification('未找到该预设词库', 'error');
        return;
    }
    
    const existingWords = new Set(App.words.map(w => w.word.toLowerCase()));
    const newWords = preset.words.filter(w => !existingWords.has(w.word.toLowerCase()));
    
    if (newWords.length === 0) {
        showNotification('该词库的所有单词都已存在', 'info');
        return;
    }
    
    const wordsToAdd = newWords.map((wordData, index) => ({
        id: Date.now() + index,
        word: wordData.word,
        meaning: wordData.meaning || '',
        pronunciation: wordData.pronunciation || '',
        partOfSpeech: wordData.partOfSpeech || '',
        addedAt: new Date().toISOString(),
        source: `preset:${presetKey}`
    }));
    
    App.words.push(...wordsToAdd);
    saveData();
    renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
    updateCounts(App.words, App.selectedWords);
    
    showNotification(`成功导入 ${wordsToAdd.length} 个单词（${preset.name}）`, 'success');
    
    setTimeout(() => {
        showNotification(`${preset.name} 已添加到词库`, 'info', 3000);
    }, 1000);
}

// ==================== 工具函数 ====================

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 预设词库折叠面板
function togglePresetSection(contentId, arrowId) {
    const content = document.getElementById(contentId);
    const arrow = document.getElementById(arrowId);
    if (content) {
        content.style.display = content.style.display === 'none' ? '' : 'none';
    }
    if (arrow) {
        arrow.textContent = content.style.display === 'none' ? '▶' : '▼';
    }
}

// 初始化预设词库折叠状态（默认折叠）
function initPresetSectionCollapse() {
    togglePresetSection('englishPresetBtns', 'englishPresetArrow');
}

// 初始化应用
window.addEventListener('DOMContentLoaded', initApp);