/**
 * UI层 (ui.js)
 * 负责所有用户界面渲染和交互
 */

/**
 * 显示通知消息
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;

    if (notification.hideTimer) {
        clearTimeout(notification.hideTimer);
    }

    notification.classList.remove('hidden');

    notification.hideTimer = setTimeout(() => {
        notification.classList.add('hidden');
    }, duration);
}

/**
 * 渲染树形词库列表
 */
function renderCustomWordBooks() {
    // 渲染英语小词库
    const englishContainer = document.getElementById('customWordBooks');
    if (englishContainer) {
        const tree = App.englishCustomBooks || {};
        const expanded = App.expandedFolders?.english || new Set();
        englishContainer.innerHTML = renderTreeNode('root', tree, expanded, 'english');
    }

    // 渲染语文小词库
    const chineseContainer = document.getElementById('chineseCustomWordBooks');
    if (chineseContainer) {
        const tree = App.chineseCustomBooks || {};
        const expanded = App.expandedFolders?.chinese || new Set();
        chineseContainer.innerHTML = renderTreeNode('root', tree, expanded, 'chinese');
    }
}

/**
 * 递归渲染树形节点
 */
function renderTreeNode(nodeId, tree, expanded, mode) {
    const node = tree[nodeId];
    if (!node) return '';

    const isExpanded = expanded.has(nodeId);
    
    // 递归渲染子节点
    let childrenHtml = '';
    if (node.children && node.children.length > 0) {
        childrenHtml = node.children.map(childId => {
            const child = tree[childId];
            if (!child) return '';
            
            if (child.type === 'folder') {
                return renderTreeNode(childId, tree, expanded, mode);
            } else if (child.type === 'book') {
                return renderBookItem(childId, tree, mode);
            }
            return '';
        }).join('');
    }

    // 根节点特殊处理
    if (nodeId === 'root') {
        return `<div class="tree-root">${childrenHtml}</div>`;
    }

    // 文件夹节点
    if (node.type === 'folder') {
        return `
            <div class="tree-folder" style="margin: 4px 0;">
                <div class="tree-folder-header" style="display:flex;align-items:center;gap:4px;">
                    <span class="tree-toggle" onclick="toggleFolderExpanded('${nodeId}')" style="cursor:pointer;user-select:none;width:20px;display:inline-block;">
                        ${isExpanded ? '▼' : '▶'}
                    </span>
                    <span style="color:#f59e0b;">📁</span>
                    <span style="font-size:13px;">${escapeHtml(node.name)}</span>
                    <span style="color:#888;font-size:0.8em;">(${node.children.length}项)</span>
                    <span style="margin-left:auto;display:flex;align-items:center;gap:4px;" class="tree-actions">
                        <button onclick="renameItem('${nodeId}')" title="重命名" class="tree-action-btn" style="height:26px;width:26px;padding:0;border-radius:6px;border:0.5px solid #ccc;background:#f5f5f5;color:#666;font-size:11px;cursor:pointer;">✏</button>
                        <button onclick="moveItemUp('${nodeId}')" title="上移" class="tree-action-btn" style="height:26px;width:26px;padding:0;border-radius:6px;border:0.5px solid #ccc;background:#f5f5f5;color:#666;font-size:11px;cursor:pointer;">↑</button>
                        <button onclick="moveItemDown('${nodeId}')" title="下移" class="tree-action-btn" style="height:26px;width:26px;padding:0;border-radius:6px;border:0.5px solid #ccc;background:#f5f5f5;color:#666;font-size:11px;cursor:pointer;">↓</button>
                        <button onclick="promptMoveItem('${nodeId}')" title="移动到" class="tree-action-btn" style="height:26px;width:26px;padding:0;border-radius:6px;border:0.5px solid #ccc;background:#f5f5f5;color:#666;font-size:11px;cursor:pointer;">↗</button>
                        <button onclick="promptCreateFolderAt('${nodeId}')" title="新建子文件夹" class="tree-action-btn" style="height:26px;padding:0 8px;border-radius:6px;border:0.5px solid #ccc;background:#fff;color:#555;font-size:12px;cursor:pointer;">+</button>
                        <span class="tree-actions-sep" style="width:1px;height:18px;background:#e0e0e0;margin:0 2px;display:none;"></span>
                        <button onclick="deleteFolder('${nodeId}')" title="删除" class="tree-action-btn" style="height:26px;width:26px;padding:0;border-radius:6px;border:0.5px solid #e8a0a0;background:#fce8e8;color:#c44;font-size:11px;cursor:pointer;">✕</button>
                        <button class="tree-more-btn" onclick="toggleTreeMore(this)" title="更多操作" style="height:26px;width:26px;padding:0;border-radius:6px;border:0.5px solid #ccc;background:#fff;color:#666;font-size:12px;cursor:pointer;">⋮</button>
                    </span>
                </div>
                <div class="tree-folder-content" style="margin-left:24px;${isExpanded ? '' : 'display:none;'}">
                    ${childrenHtml}
                </div>
            </div>
        `;
    }

    return childrenHtml;
}

/**
 * 渲染词库项
 */
function renderBookItem(bookId, tree, mode) {
    const book = tree[bookId];
    if (!book || book.type !== 'book') return '';

    const wordCount = book.words ? book.words.length : 0;

    return `
        <div class="tree-book-item" style="display:flex;align-items:center;gap:6px;margin:3px 0;padding:2px 0;">
            <span style="color:#10b981;">📖</span>
            <button class="tree-book-name" onclick="importCustomWordBook('${bookId}')" title="导入到词库">
                ${escapeHtml(book.name)} (${wordCount})
            </button>
            <span style="display:flex;gap:4px;margin-left:auto;" class="tree-actions">
                <button onclick="renameItem('${bookId}')" title="重命名" class="tree-action-btn" style="height:26px;width:26px;padding:0;border-radius:6px;border:0.5px solid #ccc;background:#f5f5f5;color:#666;font-size:11px;cursor:pointer;">✏</button>
                <button onclick="moveItemUp('${bookId}')" title="上移" class="tree-action-btn" style="height:26px;width:26px;padding:0;border-radius:6px;border:0.5px solid #ccc;background:#f5f5f5;color:#666;font-size:11px;cursor:pointer;">↑</button>
                <button onclick="moveItemDown('${bookId}')" title="下移" class="tree-action-btn" style="height:26px;width:26px;padding:0;border-radius:6px;border:0.5px solid #ccc;background:#f5f5f5;color:#666;font-size:11px;cursor:pointer;">↓</button>
                <button onclick="promptMoveItem('${bookId}')" title="移动到" class="tree-action-btn" style="height:26px;width:26px;padding:0;border-radius:6px;border:0.5px solid #ccc;background:#f5f5f5;color:#666;font-size:11px;cursor:pointer;">↗</button>
                <span class="tree-actions-sep" style="width:1px;height:18px;background:#e0e0e0;margin:0 2px;display:none;"></span>
                <button onclick="deleteCustomWordBook('${bookId}')" title="删除" class="tree-action-btn" style="height:26px;width:26px;padding:0;border-radius:6px;border:0.5px solid #e8a0a0;background:#fce8e8;color:#c44;font-size:11px;cursor:pointer;">✕</button>
                <button class="tree-more-btn" onclick="toggleTreeMore(this)" title="更多操作" style="height:26px;width:26px;padding:0;border-radius:6px;border:0.5px solid #ccc;background:#fff;color:#666;font-size:12px;cursor:pointer;">⋮</button>
            </span>
        </div>
    `;
}

/**
 * 切换树形节点更多操作菜单
 */
function toggleTreeMore(btn) {
    const actions = btn.closest('.tree-actions');
    const actionBtns = actions.querySelectorAll('.tree-action-btn');
    const seps = actions.querySelectorAll('.tree-actions-sep');
    const isExpanding = !btn.classList.contains('tree-expanded');

    if (isExpanding) {
        // 展开
        btn.classList.add('tree-expanded');
        btn.style.background = '#e6f1fb';
        btn.style.borderColor = '#4285f4';
        btn.style.color = '#185fa5';
        actionBtns.forEach(b => b.classList.add('tree-expanded'));
        seps.forEach(s => s.classList.add('tree-expanded'));
    } else {
        // 折叠
        btn.classList.remove('tree-expanded');
        btn.style.background = '#fff';
        btn.style.borderColor = '#ccc';
        btn.style.color = '#666';
        actionBtns.forEach(b => b.classList.remove('tree-expanded'));
        seps.forEach(s => s.classList.remove('tree-expanded'));
    }
}

/**
 * HTML转义
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 弹出在指定位置创建文件夹的对话框
 */
function promptCreateFolderAt(parentId) {
    const customBooks = App.currentMode === 'english' ? App.englishCustomBooks : App.chineseCustomBooks;
    const parent = customBooks[parentId];
    
    if (!parent) return;
    
    const parentName = parent.type === 'root' ? '根目录' : parent.name;
    
    showCustomPrompt(
        '新建文件夹',
        `<p style="margin:5px 0;">保存位置：<strong>${escapeHtml(parentName)}</strong></p>
        <p style="margin:5px 0 5px;">文件夹名称：</p>
        <input type="text" id="folderNameInput" placeholder="输入文件夹名称" style="width:100%;padding:8px;">`,
        function() {
            const name = document.getElementById('folderNameInput')?.value || '';
            return createFolder(name, parentId);
        }
    );
}


/**
 * 搜索单词（实时过滤）
 * 搜索范围：主词库 + 当前模式下所有小词库
 *   主词库命中的词正常显示在列表里（可勾选/编辑/删除）
 *   小词库命中的词单独挂在列表末尾，标注所属小词库，可一键导入
 */
let currentWordSearch = ''; // 当前搜索关键词
let currentBookSearchHits = []; // 本次搜索在「主词库以外」的小词库中命中的词条

function handleWordSearch(query) {
    currentWordSearch = (query || '').trim().toLowerCase();

    if (currentWordSearch === '') {
        renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
        return;
    }

    // 过滤匹配词（匹配词语或释义）
    const filteredWords = App.words.filter(w =>
        (w.word || '').toLowerCase().includes(currentWordSearch) ||
        (w.meaning && String(w.meaning).toLowerCase().includes(currentWordSearch))
    );

    // 精确匹配优先排序
    filteredWords.sort((a, b) => {
        const aExact = (a.word || '').toLowerCase() === currentWordSearch;
        const bExact = (b.word || '').toLowerCase() === currentWordSearch;
        if (aExact && !bExact) return -1;  // a精确在前
        if (!aExact && bExact) return 1;   // b精确在前
        return 0;
    });

    // renderWordList 内部会自动带上小词库命中区
    renderWordList(filteredWords, App.selectedWords, App.errors, App.currentMode);

    // 主词库和小词库都没命中时才提示
    if (filteredWords.length === 0 && currentBookSearchHits.length === 0) {
        showNotification(`未找到匹配"${query}"的词`, 'info');
    }
}

/**
 * 在「主词库以外」的所有小词库中搜索
 * 同一个词出现在多本小词库时合并为一条，记录全部来源。
 * 已存在于主词库的词不重复展示（主词库列表里已经有了）。
 * @param {string} query 关键词
 * @returns {Array<{word:string,meaning:string,examples:Array,pronunciation:string,partOfSpeech:string,bookIds:Array<string>,bookNames:Array<string>}>}
 */
function collectBookSearchHits(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return [];

    const mainWordKeys = new Set(App.words.map(w => (w.word || '').toLowerCase()));
    const hitMap = new Map();

    Object.values(getCurrentCustomBooks()).forEach(node => {
        if (!Array.isArray(node.words)) return;  // 文件夹节点没有 words
        node.words.forEach(w => {
            if (!w || typeof w.word !== 'string') return;
            const word = w.word.trim();
            if (!word) return;

            const key = word.toLowerCase();
            if (mainWordKeys.has(key)) return;  // 主词库已有 → 不重复展示

            const meaning = w.meaning || '';
            const matched = key.includes(q) || String(meaning).toLowerCase().includes(q);
            if (!matched) return;

            let hit = hitMap.get(key);
            if (!hit) {
                hit = {
                    word: word,
                    meaning: '',
                    examples: [],
                    pronunciation: w.pronunciation || '',
                    partOfSpeech: w.partOfSpeech || '',
                    bookIds: [],
                    bookNames: []
                };
                hitMap.set(key, hit);
            }
            if (!hit.bookNames.includes(node.name)) hit.bookNames.push(node.name);
            if (!hit.bookIds.includes(node.id)) hit.bookIds.push(node.id);
            // 多本小词库内容不一致时，补齐缺失的释义/例句
            if (!hit.meaning && meaning) hit.meaning = meaning;
            if (hit.examples.length === 0 && Array.isArray(w.examples) && w.examples.length) {
                hit.examples = w.examples.slice();
            }
        });
    });

    const hits = Array.from(hitMap.values());
    // 前缀匹配优先，其余按拼音/字母序
    hits.sort((a, b) => {
        const aw = a.word.toLowerCase();
        const bw = b.word.toLowerCase();
        const aStarts = aw.startsWith(q);
        const bStarts = bw.startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return aw.localeCompare(bw, 'zh-Hans-CN');
    });
    return hits;
}

/**
 * 渲染「其它小词库命中」区块（追加到单词列表末尾）
 */
function renderBookSearchHits(hits) {
    if (!hits || hits.length === 0) return;

    const container = document.getElementById('wordList');
    if (!container) return;

    const rows = hits.map((hit, index) => {
        const meaning = hit.meaning
            ? ` <span class="book-hit-meaning">${escapeHtml(hit.meaning)}</span>`
            : '';
        const books = hit.bookNames.map(n => escapeHtml(n)).join(' / ');
        return `
        <div class="book-hit-item">
            <span class="book-hit-dot"></span>
            <span class="book-hit-text">${escapeHtml(hit.word)}${meaning}</span>
            <span class="book-hit-books">在 ${books}</span>
            <button class="btn btn-small btn-primary book-hit-import" onclick="importBookHit(${index})">导入</button>
        </div>`;
    }).join('');

    container.insertAdjacentHTML('beforeend', `
        <div class="book-hit-divider">其它小词库命中 ${hits.length} 个 · 只读，点「导入」加入主词库</div>
        ${rows}`);
}

/**
 * 把某条小词库命中导入主词库（小词库中保留原词条）
 * @param {number} index currentBookSearchHits 下标
 */
function importBookHit(index) {
    const hit = currentBookSearchHits[index];
    if (!hit) return;

    if (App.words.some(w => (w.word || '').toLowerCase() === hit.word.toLowerCase())) {
        showNotification(`「${hit.word}」已在主词库中`, 'info');
        return;
    }

    App.words.push({
        id: App.nextId++,
        word: hit.word,
        meaning: hit.meaning || '',
        pronunciation: hit.pronunciation || '',
        partOfSpeech: hit.partOfSpeech || '',
        examples: (hit.examples || []).slice(),
        addedAt: new Date().toISOString(),
        source: hit.bookIds.length ? `custom_book:${hit.bookIds[0]}` : 'custom_book'
    });

    saveData();
    updateCounts(App.words, App.selectedWords);
    showNotification(`已导入「${hit.word}」到词库`, 'success');

    // 刷新：导入后该词转入主词库区，自动从小词库命中区移除
    const input = document.getElementById('wordSearchInput');
    handleWordSearch(input ? input.value : currentWordSearch);
}

/**
 * 渲染单词列表
 */
function renderWordList(words, selectedWords, errors, currentMode) {
    const container = document.getElementById('wordList');
    
    if (!words || words.length === 0) {
        const emptyText = currentWordSearch ? '主词库中无匹配词语' : '暂无单词，请添加或导入';
        container.innerHTML = `<p style="text-align: center; color: #6c757d; padding: 40px;">${emptyText}</p>`;
        // 主词库没命中，但小词库可能有 → 继续往下走，展示命中区
        currentBookSearchHits = currentWordSearch ? collectBookSearchHits(currentWordSearch) : [];
        renderBookSearchHits(currentBookSearchHits);
        return;
    }
    
    container.innerHTML = words.map(word => {
        const safeWord = escapeHtml(word.word);
        const safeMeaning = escapeHtml(word.meaning || '');
        const jsWord = String(word.word).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        const hasErrors = errors && errors[word.word] > 0;
        const examples = word.examples || [];
        const exampleCount = examples.length;
        const examplePreview = exampleCount > 0
            ? examples.join(' / ').substring(0, 30) + (examples.join(' / ').length > 30 ? '…' : '')
            : '';

        return `
        <div class="word-item ${hasErrors ? 'has-errors' : ''}" onclick="toggleWordDetail(this, event)">
            <!-- 第1行：单词 + 释义 + 按钮（始终显示） -->
            <div class="word-main-row">
                <input type="checkbox" class="word-checkbox"
                       ${selectedWords.has(word.id) ? 'checked' : ''}
                       onchange="toggleWordSelection(${word.id})">
                <div class="word-text">${safeWord} <span class="word-meaning-inline">${safeMeaning}</span>${hasErrors ? `<span class="word-error-badge">错${errors[word.word]}次</span>` : ''}</div>
                <div class="word-actions">
                    <button class="btn btn-small btn-icon" onclick="playWord('${jsWord}', App.currentMode)" title="朗读">🔈</button>
                    <button class="btn btn-small btn-icon" onclick="addToErrorBook('${jsWord}')" title="加入错题本">📝</button>
                    <button class="btn btn-small btn-icon btn-delete-word" onclick="deleteWord(${word.id})" title="删除">✕</button>
                </div>
            </div>
            <!-- 第2行：释义（仅展开时显示） -->
            <div class="word-meaning-row word-detail-extra" id="meaningRow_${word.id}">
                <span class="meaning-edit" onclick="startEditMeaning(${word.id})" title="点击编辑释义">释义: ${safeMeaning || '(无)'}</span>
            </div>
            <!-- 第3行：例句（仅展开时显示） -->
            <div class="word-example-row word-detail-extra" id="exampleRow_${word.id}">
                <span class="example-display" onclick="startEditExamples(${word.id})" title="点击编辑例句">
                    📝 例句: ${exampleCount > 0 ? escapeHtml(examplePreview) : '(无)'}
                    ${exampleCount > 0 ? `<span style="color: var(--md-primary);">(${exampleCount}句)</span>` : ''}
                </span>
            </div>
        </div>
    `;
    }).join('');

    // 搜索时附带展示「其它小词库」命中的词条
    currentBookSearchHits = currentWordSearch ? collectBookSearchHits(currentWordSearch) : [];
    renderBookSearchHits(currentBookSearchHits);
}

// 点击释义开始编辑（与例句编辑一致的UI）
function startEditMeaning(wordId) {
    const currentMeaning = App.words.find(w => w.id === wordId)?.meaning || '';
    const escapedMeaning = escapeHtml(currentMeaning);

    const meaningRow = document.getElementById(`meaningRow_${wordId}`);
    if (!meaningRow) return;

    meaningRow.innerHTML = `
        <div style="margin-top: 4px;">
            <textarea class="meaning-input" rows="2" style="width: 100%; padding: 5px; border: 1px solid #007bff; border-radius: 4px; resize: vertical; font-size: 0.85rem;" placeholder="输入释义">${escapedMeaning}</textarea>
            <div style="margin-top: 5px; text-align: right;">
                <button class="btn btn-small btn-secondary" onclick="cancelEditMeaning(${wordId})">取消</button>
                <button class="btn btn-small btn-primary" onclick="finishEditMeaning(${wordId})">保存</button>
            </div>
        </div>
    `;
    meaningRow.querySelector('textarea').focus();
}

// 取消编辑释义
function cancelEditMeaning(wordId) {
    renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
}

// 编辑释义完成
function finishEditMeaning(wordId) {
    const meaningRow = document.getElementById(`meaningRow_${wordId}`);
    if (!meaningRow) return;

    const textarea = meaningRow.querySelector('textarea');
    if (!textarea) return;

    const newMeaning = textarea.value.trim();
    editWordMeaning(wordId, newMeaning);
}

// 点击例句开始编辑（行内展开textarea）
function startEditExamples(wordId) {
    const word = App.words.find(w => w.id === wordId);
    if (!word) return;

    const examples = word.examples || [];
    const currentText = examples.join('\n');
    const escapedText = escapeHtml(currentText);

    const exampleRow = document.getElementById(`exampleRow_${wordId}`);
    if (!exampleRow) return;

    exampleRow.innerHTML = `
        <div style="margin-top: 5px;">
            <textarea class="example-input" rows="2" style="width: 100%; padding: 8px; border: 1px solid #007bff; border-radius: 4px; resize: vertical; font-size: 0.9rem; box-sizing: border-box;" placeholder="输入例句（每行一条例句）">${escapedText}</textarea>
            <div style="margin-top: 8px; text-align: right;">
                <button class="btn btn-small btn-secondary" onclick="cancelEditExamples(${wordId})">取消</button>
                <button class="btn btn-small btn-primary" onclick="finishEditExamples(${wordId})">保存</button>
            </div>
        </div>
    `;
    exampleRow.querySelector('textarea').focus();
}

// 取消编辑例句
function cancelEditExamples(wordId) {
    renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
}

// 编辑例句完成
function finishEditExamples(wordId) {
    const exampleRow = document.getElementById(`exampleRow_${wordId}`);
    if (!exampleRow) return;

    const textarea = exampleRow.querySelector('textarea');
    if (!textarea) return;

    const newText = textarea.value.trim();
    // 按换行分割，去除空行
    const newExamples = newText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    editWordExamples(wordId, newExamples);
}

// 保存例句到单词对象
function editWordExamples(wordId, examples) {
    const word = App.words.find(w => w.id === wordId);
    if (!word) return;

    word.examples = examples;
    word.updatedAt = new Date().toISOString();
    // 同步刷新小词库里的同名词条副本
    backfillCustomBookCopies([word]);
    saveData();
    renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
    renderCustomWordBooks();
}

/**
 * 渲染错题列表
 */
function renderErrorList(errors, selectedErrorWords, words) {
    const container = document.getElementById('errorList');

    // 获取错误单词列表并排序
    let errorWords = Object.entries(errors)
        .filter(([word, count]) => count > 0);

    if (App.isErrorSortedByAlpha) {
        // 按首字母A-Z排序（不区分大小写）
        errorWords.sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase()));
    } else {
        // 默认排序：按错误次数降序，次数相同按添加时间升序
        errorWords.sort((a, b) => {
            const [wordA, countA] = a;
            const [wordB, countB] = b;
            // 首先按错误次数降序
            if (countB !== countA) {
                return countB - countA;
            }
            // 次数相同，按添加时间升序（早添加的排前面）
            const wordObjA = words.find(w => w.word === wordA);
            const wordObjB = words.find(w => w.word === wordB);
            const timeA = wordObjA?.addedAt ? new Date(wordObjA.addedAt).getTime() : 0;
            const timeB = wordObjB?.addedAt ? new Date(wordObjB.addedAt).getTime() : 0;
            return timeA - timeB;
        });
    }
    
    if (errorWords.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 20px;">暂无错词</p>';
        updateErrorCounts();
        return;
    }
    
    container.innerHTML = `
        ${errorWords.map(([word, count]) => {
            const jsWord = String(word).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            return `
            <div class="error-item">
                <input type="checkbox" class="error-checkbox" ${selectedErrorWords.has(word) ? 'checked' : ''} onchange="toggleErrorSelection('${jsWord}')">
                <span class="error-word">${escapeHtml(word)}</span>
                <div class="error-actions">
                    <button class="btn btn-small btn-icon" onclick="playWord('${jsWord}', App.currentMode)" style="width:26px;height:26px;padding:0;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;background:#f5f5f5;color:#666;border:none;">🔈</button>
                    <button class="btn btn-small btn-icon" onclick="editErrorCount('${jsWord}')" style="width:28px;height:28px;padding:0;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:bold;background:#fff;color:#856404;border:2px solid #f39c12;">${count}</button>
                    <button class="btn btn-small btn-icon btn-delete-word" onclick="deleteErrorWord('${jsWord}')" style="width:26px;height:26px;padding:0;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;background:#f5f5f5;color:#666;border:none;">✕</button>
                </div>
            </div>
        `;
        }).join('')}
    `;

    // 更新错词本统计
    updateErrorCounts();
}

/**
 * 更新统计信息
 */
function updateStats(currentIndex, total, correctCount) {
    const current = currentIndex + 1;
    const accuracy = currentIndex > 0 ? Math.round((correctCount / currentIndex) * 100) : 0;
    const progress = total > 0 ? (currentIndex / total) * 100 : 0;
    
    document.getElementById('currentNumber').textContent = current > total ? total : current;
    document.getElementById('totalNumber').textContent = total;
    document.getElementById('correctNumber').textContent = correctCount;
    document.getElementById('accuracyRate').textContent = accuracy + '%';
    document.getElementById('progressFill').style.width = progress + '%';
}

/**
 * 更新计数显示
 */
function updateCounts(words, selectedWords) {
    document.getElementById('totalWordCount').textContent = words ? words.length : 0;
    document.getElementById('selectedCount').textContent = selectedWords ? selectedWords.size : 0;
}

/**
 * 更新错词本计数显示
 */
function updateErrorCounts() {
    const errors = App.errors;
    const selectedErrorWords = App.selectedErrorWords;

    // 计算错词总数（错误次数 > 0 的单词）
    const totalErrors = Object.values(errors).filter(count => count > 0).length;
    document.getElementById('totalErrorCount').textContent = totalErrors;
    document.getElementById('selectedErrorCount').textContent = selectedErrorWords ? selectedErrorWords.size : 0;
}

/**
 * 更新模式切换UI
 */
function updateModeUI(currentMode, settings) {
    // 更新Tab高亮
    document.querySelectorAll('.mode-tab').forEach(tab => {
        if (tab.dataset.mode === currentMode) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    const isEnglish = currentMode === 'english';

    // 更新标题
    const title = document.querySelector('.app-title');
    if (title) {
        title.textContent = isEnglish ? '🎓 英语词语听写' : '🎓 语文词语听写';
    }

    // 更新副标题
    const subtitle = document.querySelector('.app-subtitle');
    if (subtitle) {
        subtitle.textContent = isEnglish ? '杨杨的英语听写训练系统' : '杨杨的语文听写训练系统';
    }

    const bulkImport = document.getElementById('bulkImport');
    if (bulkImport) {
        bulkImport.placeholder = isEnglish
            ? '支持自定义英文+释义+例句，每行一个，示例：\napple苹果\nlemon 柠檬\nbanana,香蕉\nGood morning.早上好\napple|苹果|I like apples.'
            : '输入词语，每行一个（如：\n春天\n花朵\n可爱）';
    }

    const answerInput = document.getElementById('answerInput');
    if (answerInput) {
        answerInput.placeholder = isEnglish ? '输入听到的单词' : '输入听到的词语';
    }

    // 更新快速导入按钮 - 显示/隐藏英语预设区域
    const englishPresets = document.getElementById('englishPresets');
    if (englishPresets) {
        englishPresets.classList.toggle('hidden', !isEnglish);
    }
    
    // 更新语文预设区域（小词库）
    const chinesePresets = document.getElementById('chinesePresets');
    if (chinesePresets) {
        chinesePresets.style.display = isEnglish ? 'none' : 'block';
    }

    // 拼音选项仅在语文模块显示
    const showPinyinLabel = document.getElementById('showPinyinLabel');
    if (showPinyinLabel) {
        showPinyinLabel.style.display = isEnglish ? 'none' : 'flex';
    }

    // 「缺释义词」导出按钮仅语文模块显示
    const exportMissingMeaningBtn = document.getElementById('exportMissingMeaningBtn');
    if (exportMissingMeaningBtn) {
        exportMissingMeaningBtn.style.display = isEnglish ? 'none' : '';
    }
    // 切到英语模式时隐藏显示屏中的拼音行
    if (isEnglish) {
        const pinyinEl = document.getElementById('displayPinyin');
        if (pinyinEl) {
            pinyinEl.textContent = '';
            pinyinEl.style.display = 'none';
        }
    }
    
    // 同步听写范围radio button状态
    document.querySelectorAll('input[name="range"]').forEach(radio => {
        radio.checked = radio.value === App.settings.range;
    });

    // 同步播放顺序radio button状态
    document.querySelectorAll('input[name="order"]').forEach(radio => {
        radio.checked = radio.value === App.settings.order;
    });

    // 同步输入模式radio button状态
    document.querySelectorAll('input[name="inputMode"]').forEach(radio => {
        radio.checked = radio.value === App.settings.inputMode;
    });


    // 同步播放次数select状态（从HTML读取实际选项，动态验证）
    const playCountEl = document.getElementById('playCount');
    const playCountOptions = Array.from(playCountEl.options).map(o => o.value);
    if (playCountOptions.includes(String(App.settings.playCount))) {
        playCountEl.value = String(App.settings.playCount);
    } else if (playCountOptions.length > 0) {
        // 保存的值不在HTML选项中，使用第一个选项
        playCountEl.value = playCountOptions[0];
        App.settings.playCount = parseInt(playCountOptions[0]);
        saveData();
    }

    // 同步播放间隔select状态
    const intervalTimeEl = document.getElementById('intervalTime');
    const intervalOptions = Array.from(intervalTimeEl.options).map(o => o.value);
    if (intervalOptions.includes(String(App.settings.intervalTime))) {
        intervalTimeEl.value = String(App.settings.intervalTime);
    } else if (intervalOptions.length > 0) {
        intervalTimeEl.value = intervalOptions[0];
        App.settings.intervalTime = parseInt(intervalOptions[0]);
        saveData();
    }

    // 同步朗读速度select状态（从HTML读取实际选项，动态验证）
    const speechRateEl = document.getElementById('speechRate');
    const speechRateOptions = Array.from(speechRateEl.options).map(o => o.value);
    if (speechRateOptions.includes(String(App.settings.speechRate))) {
        speechRateEl.value = String(App.settings.speechRate);
    } else if (speechRateOptions.length > 0) {
        // 保存的值不在HTML选项中，使用第一个选项
        speechRateEl.value = speechRateOptions[0];
        App.settings.speechRate = parseFloat(speechRateOptions[0]);
        saveData();
    }

    // 同步显示选项checkbox状态
    document.getElementById('showMeaning').checked = App.settings.showMeaning;
    document.getElementById('showWord').checked = App.settings.showWord;
    document.getElementById('showExamples').checked = App.settings.showExamples;
    const showPinyinEl = document.getElementById('showPinyin');
    if (showPinyinEl) showPinyinEl.checked = !!App.settings.showPinyin;
}

/**
 * 更新听写控制按钮状态
 */
function updateControlButtons(isDictating, currentIndex, totalLength, autoPlayTimer) {
    if (!isDictating) {
        document.getElementById('prevBtn').disabled = true;
        document.getElementById('playPauseBtn').disabled = true;
        document.getElementById('nextBtn').disabled = true;
        document.getElementById('repeatBtn').disabled = true;
        return;
    }
    
    document.getElementById('prevBtn').disabled = currentIndex <= 0;
    
    document.getElementById('playPauseBtn').disabled = false;
    document.getElementById('playPauseBtn').innerHTML = autoPlayTimer ? '⏸️ 暂停' : '▶️ 播放';
    
    document.getElementById('nextBtn').disabled = currentIndex >= totalLength - 1;
    
    document.getElementById('repeatBtn').disabled = false;
}

/**
 * 设置事件监听器
 */
function setupEventListeners(settings) {
    // 听写模式变更
    document.querySelectorAll('input[name="range"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            App.settings.range = e.target.value;
            saveData();
        });
    });
    
    document.querySelectorAll('input[name="order"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            App.settings.order = e.target.value;
            saveData();
        });
    });
    
    document.querySelectorAll('input[name="inputMode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            App.settings.inputMode = e.target.value;
            const input = document.getElementById('answerInput');
            if (e.target.value === 'offline') {
                input.style.display = 'none';
            } else {
                input.style.display = 'block';
                input.style.margin = '0 auto';
            }
            saveData();
        });
    });
    
    document.getElementById('playCount').addEventListener('change', (e) => {
        App.settings.playCount = parseInt(e.target.value);
        saveData();
    });
    
    document.getElementById('intervalTime').addEventListener('change', (e) => {
        App.settings.intervalTime = parseInt(e.target.value);
        saveData();
    });
    
    document.getElementById('speechRate').addEventListener('change', (e) => {
        App.settings.speechRate = parseFloat(e.target.value);
        saveData();
    });
    
    document.getElementById('showMeaning').addEventListener('change', (e) => {
        App.settings.showMeaning = e.target.checked;
        saveData();
    });
    
    document.getElementById('showWord').addEventListener('change', (e) => {
        App.settings.showWord = e.target.checked;
        saveData();
    });

    document.getElementById('showExamples').addEventListener('change', (e) => {
        App.settings.showExamples = e.target.checked;
        saveData();
    });

    document.getElementById('showPinyin').addEventListener('change', (e) => {
        App.settings.showPinyin = e.target.checked;
        saveData();
    });

    // 初始化输入框显示状态（根据保存的inputMode设置）
    const input = document.getElementById('answerInput');
    if (App.settings.inputMode === 'offline') {
        input.style.display = 'none';
    } else {
        input.style.display = 'block';
        input.style.margin = '0 auto';
    }
}





// 悬浮导航按钮状态：true=在顶部，false=在底部
let isAtTop = true;

// 悬浮导航按钮点击
function toggleFloatNav() {
    const btn = document.getElementById('floatNavBtn');
    const icon = btn.querySelector('.float-nav-icon');
    const line = btn.querySelector('.float-nav-line');
    if (isAtTop) {
        // 滚动到底部
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        icon.textContent = '▲';
        line.textContent = '─';
    } else {
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
        icon.textContent = '▼';
        line.textContent = '─';
    }
    isAtTop = !isAtTop;
}

// 显示备份选项弹窗
function showBackupModal() {
    const modal = document.getElementById('backupModal');
    if (!modal) return;

    // 重置所有checkbox为选中状态
    modal.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);

    modal.classList.remove('hidden');
    modal.querySelector('.modal-content').style.display = 'block';
}

// 关闭备份弹窗
function closeBackupModal() {
    const modal = document.getElementById('backupModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// 执行备份导出
function doBackupExport() {
    const data = {
        englishWords: App.englishWords,
        englishErrors: App.englishErrors,
        englishCustomBooks: App.englishCustomBooks,
        chineseWords: App.chineseWords,
        chineseErrors: App.chineseErrors,
        chineseCustomBooks: App.chineseCustomBooks
    };

    const json = DataManager.backupExport(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dictation_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    closeBackupModal();
    showNotification('备份文件已下载', 'success');
}

// 执行备份导入
function importBackupFromFile() {
    const input = document.getElementById('backupFileInput');
    if (!input) {
        // 如果没有隐藏的file input，创建一个
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.id = 'backupFileInput';
        fileInput.style.display = 'none';
        fileInput.onchange = (e) => handleBackupFileSelect(e.target.files[0]);
        document.body.appendChild(fileInput);
        fileInput.click();
    } else {
        input.click();
    }
}

function handleBackupFileSelect(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const backupData = JSON.parse(e.target.result);
            if (!backupData.version || !backupData.english || !backupData.chinese) {
                showNotification('无效的备份文件格式', 'error');
                return;
            }

            // 显示导入预览弹窗
            showImportPreviewModal(backupData);
        } catch (err) {
            showNotification('文件读取失败：' + err.message, 'error');
        }
    };
    reader.readAsText(file);
}

// 显示导入预览弹窗
function showImportPreviewModal(backupData) {
    const modal = document.getElementById('importPreviewModal');
    if (!modal) return;

    // 显示备份文件信息
    const info = modal.querySelector('.backup-info');
    if (info) {
        const bk = backupData;
        info.innerHTML = `
            <p><strong>备份日期：</strong>${new Date(bk.backupDate).toLocaleString()}</p>
            <p><strong>英语：</strong>${bk.english?.words?.length || 0}个单词，${Object.keys(bk.english?.errors || {}).length}条错词，${Object.keys(bk.english?.customBooks || {}).length}个小词库</p>
            <p><strong>语文：</strong>${bk.chinese?.words?.length || 0}个词语，${Object.keys(bk.chinese?.errors || {}).length}条错词，${Object.keys(bk.chinese?.customBooks || {}).length}个小词库</p>
        `;
    }

    // 保存备份数据到modal
    modal.dataset.backupData = JSON.stringify(backupData);

    modal.classList.remove('hidden');
    modal.querySelector('.modal-content').style.display = 'block';
}

// 关闭导入预览弹窗
function closeImportPreviewModal() {
    const modal = document.getElementById('importPreviewModal');
    if (modal) {
        modal.classList.add('hidden');
        delete modal.dataset.backupData;
    }
}

// 执行导入（合并模式）
function doImportMerge() {
    doImportWithMode(true);
}

// 执行导入（替换模式）
function doImportReplace() {
    doImportWithMode(false);
}

function doImportWithMode(merge) {
    const modal = document.getElementById('importPreviewModal');
    if (!modal || !modal.dataset.backupData) return;

    const backupData = JSON.parse(modal.dataset.backupData);

    const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
    const options = {
        englishWords: document.getElementById('imp_englishWords').checked,
        englishErrors: document.getElementById('imp_englishErrors').checked,
        englishCustomBooks: document.getElementById('imp_englishCustomBooks').checked,
        chineseWords: document.getElementById('imp_chineseWords').checked,
        chineseErrors: document.getElementById('imp_chineseErrors').checked,
        chineseCustomBooks: document.getElementById('imp_chineseCustomBooks').checked,
        merge: merge
    };

    const existingData = {
        englishWords: App.englishWords,
        englishErrors: App.englishErrors,
        englishCustomBooks: App.englishCustomBooks,
        englishDeletedWords: App.englishDeletedWords,
        englishDeletedErrors: App.englishDeletedErrors,
        chineseWords: App.chineseWords,
        chineseErrors: App.chineseErrors,
        chineseCustomBooks: App.chineseCustomBooks,
        chineseDeletedWords: App.chineseDeletedWords,
        chineseDeletedErrors: App.chineseDeletedErrors
    };

    const result = DataManager.backupImport(backupData, existingData, options);

    // 更新App数据
    App.englishWords = result.englishWords || [];
    App.englishErrors = result.englishErrors || {};
    App.englishCustomBooks = result.englishCustomBooks || {};
    App.englishDeletedWords = result.englishDeletedWords || {};
    App.englishDeletedErrors = result.englishDeletedErrors || {};
    App.chineseWords = result.chineseWords || [];
    App.chineseErrors = result.chineseErrors || {};
    App.chineseCustomBooks = result.chineseCustomBooks || {};
    App.chineseDeletedWords = result.chineseDeletedWords || {};
    App.chineseDeletedErrors = result.chineseDeletedErrors || {};

    // 修正 id 计数器：导入后词条 id 可能变大，否则后续新导入的词会撞 id
    App.nextId = DataManager.maxWordId(App.englishWords, App.chineseWords) + 1;

    // 保存到localStorage
    saveData();

    // 刷新UI
    renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
    renderCustomWordBooks();
    renderErrorList(App.errors, App.selectedErrorWords, App.words);
    updateCounts(App.words, App.selectedWords);
    updateErrorCounts();

    closeImportPreviewModal();
    showNotification('数据导入成功', 'success');
}

// 手机端点击展开/收起单词详情
function toggleWordDetail(item, event) {
    // 不处理复选框、按钮、输入框的点击
    const tag = event.target.tagName;
    if (tag === 'INPUT' || tag === 'BUTTON' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (event.target.closest('.word-actions')) return;
    if (event.target.classList.contains('meaning-edit')) return;
    if (event.target.classList.contains('example-display')) return;
    
    item.classList.toggle('expanded');
}

// ==================== 云同步界面 ====================

/** 把 owner / repo 拼成 owner/repo */
function joinRepo(owner, repo) {
    const o = String(owner || '').trim().replace(/^\/+|\/+$/g, '');
    const r = String(repo || '').trim().replace(/^\/+|\/+$/g, '');
    if (!o || !r) return '';
    return o + '/' + r;
}

/** 取输入框的值（元素不存在时返回空串） */
function syncInputValue(id) {
    const el = document.getElementById(id);
    return el ? String(el.value || '') : '';
}

/** 刷新「云端地址」预览 */
function updateSyncUrlPreview() {
    const el = document.getElementById('syncUrlPreview');
    if (!el) return;
    const full = joinRepo(syncInputValue('syncOwnerInput'), syncInputValue('syncRepoInput'));
    if (!full) { el.textContent = '—'; return; }
    const path = (syncInputValue('syncPathInput') || 'data/words.json').replace(/^\/+/, '');
    el.textContent = 'https://github.com/' + full + '/blob/' + path;
}

/** 打开云同步设置弹窗 */
function showSyncConfigModal() {
    const modal = document.getElementById('syncConfigModal');
    if (!modal) return;

    const cfg = (typeof SyncManager !== 'undefined') ? SyncManager.getConfig() : {};
    let owner = cfg.owner || '';
    let repo = cfg.repoName || '';

    // 兼容只保存了 "owner/repo" 的旧配置
    if ((!owner || !repo) && cfg.repo && cfg.repo.indexOf('/') > -1) {
        const seg = cfg.repo.split('/');
        owner = owner || seg[0];
        repo = repo || seg.slice(1).join('/');
    }
    // 部署在 GitHub Pages 时，可自动识别出当前仓库
    if (!owner || !repo) {
        const g = (typeof SyncManager !== 'undefined') ? SyncManager.guessRepo() : {};
        owner = owner || g.owner || '';
        repo = repo || g.repo || '';
    }

    const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
    setVal('syncOwnerInput', owner);
    setVal('syncRepoInput', repo);
    setVal('syncTokenInput', cfg.token || '');
    setVal('syncPathInput', cfg.path || 'data/words.json');

    ['syncOwnerInput', 'syncRepoInput', 'syncPathInput'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.oninput = updateSyncUrlPreview;
    });
    updateSyncUrlPreview();

    modal.classList.remove('hidden');
    const content = modal.querySelector('.modal-content');
    if (content) content.style.display = 'block';
}

/** 关闭云同步设置弹窗 */
function closeSyncConfigModal() {
    const modal = document.getElementById('syncConfigModal');
    if (modal) modal.classList.add('hidden');
}

/** 保存同步设置并测试连接 */
async function saveSyncConfigFromModal() {
    const owner = syncInputValue('syncOwnerInput').trim();
    const repo = syncInputValue('syncRepoInput').trim();
    const token = syncInputValue('syncTokenInput').trim();
    let path = syncInputValue('syncPathInput').trim() || 'data/words.json';
    path = path.replace(/^\/+/, '');

    if (!owner || !repo) { showNotification('请填写 GitHub 用户名和仓库名', 'error'); return; }
    if (!token) { showNotification('请填写 Personal Access Token', 'error'); return; }

    SyncManager.saveConfig({
        owner: owner,
        repoName: repo,
        repo: joinRepo(owner, repo),
        token: token,
        path: path
    });

    const btn = (typeof event !== 'undefined' && event && event.target) ? event.target : null;
    if (btn) btn.disabled = true;
    showNotification('正在测试连接…', 'info', 3000);

    const res = await SyncManager.verify();
    if (btn) btn.disabled = false;

    if (!res.ok) {
        showNotification('连接失败：' + res.message, 'error', 7000);
        return;   // 不关闭弹窗，方便修改
    }

    const p = await SyncManager.pull();
    const tail = (p.ok && p.empty) ? '，云端暂无数据，请点「上传到云端」创建' : '';
    showNotification('连接成功' + (res.private ? '（私有仓库）' : '（公开仓库）') + tail, 'success', 5000);

    updateSyncUrlPreview();
    renderSyncStatus();
    closeSyncConfigModal();
}

/** 清除本机保存的同步设置 */
function clearSyncConfig() {
    if (!confirm('清除本机保存的同步设置？\nToken 会被删除，云端数据不受影响。')) return;

    SyncManager.clearConfig();
    ['syncOwnerInput', 'syncRepoInput', 'syncTokenInput'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const pathEl = document.getElementById('syncPathInput');
    if (pathEl) pathEl.value = 'data/words.json';

    updateSyncUrlPreview();
    renderSyncStatus();
    closeSyncConfigModal();
    showNotification('同步设置已清除', 'success');
}

/** 刷新数据管理区的同步状态文字 */
function renderSyncStatus() {
    const el = document.getElementById('syncStatusText');
    if (!el) return;

    if (typeof SyncManager === 'undefined' || !SyncManager.isConfigured()) {
        el.textContent = '未配置。点「同步设置」填入 GitHub 仓库和 Token 后，各设备打开本工具会自动同步。';
        el.style.color = '#6c757d';
        return;
    }

    const cfg = SyncManager.getConfig();
    const last = SyncManager.getLastSync();
    let when = '尚未同步';
    if (last) {
        const d = new Date(last);
        when = isNaN(d.getTime()) ? '未知' : d.toLocaleString('zh-CN');
    }
    el.textContent = '已配置：' + cfg.repo + '（' + (cfg.path || 'data/words.json') + '）｜ 上次同步：' + when;
    el.style.color = '#4285F4';
}

/** 强制对齐云端（用云端数据覆盖本机） */
async function doForceAlign() {
    if (!SyncManager.isConfigured()) {
        showNotification('请先完成同步设置', 'info');
        return;
    }
    closeSyncConfigModal();
    await doCloudSync(true);
}

