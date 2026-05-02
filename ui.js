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
 * 渲染自定义小词库列表
 */
function renderCustomWordBooks() {
    // 渲染英语小词库
    const englishContainer = document.getElementById('customWordBooks');
    if (englishContainer) {
        const englishBooks = App.englishCustomBooks || {};
        const bookIds = Object.keys(englishBooks);

        if (bookIds.length === 0) {
            englishContainer.innerHTML = '';
        } else {
            englishContainer.innerHTML = bookIds.map(bookId => {
                const book = englishBooks[bookId];
                return `
                    <div class="custom-book-item" style="display: inline-block; margin: 3px;">
                        <button class="btn btn-small btn-info" onclick="importCustomWordBook('${bookId}')" title="导入到词库">
                            📚 ${book.name} (${book.words.length})
                        </button>
                        <button class="btn btn-small btn-danger" onclick="deleteCustomWordBook('${bookId}')" title="删除小词库" style="padding: 2px 6px;">×</button>
                    </div>
                `;
            }).join('');
        }
    }

    // 渲染语文小词库
    const chineseContainer = document.getElementById('chineseCustomWordBooks');
    if (chineseContainer) {
        const chineseBooks = App.chineseCustomBooks || {};
        const bookIds = Object.keys(chineseBooks);

        if (bookIds.length === 0) {
            chineseContainer.innerHTML = '';
        } else {
            chineseContainer.innerHTML = bookIds.map(bookId => {
                const book = chineseBooks[bookId];
                return `
                    <div class="custom-book-item" style="display: inline-block; margin: 3px;">
                        <button class="btn btn-small btn-info" onclick="importCustomWordBook('${bookId}')" title="导入到词库">
                            📚 ${book.name} (${book.words.length})
                        </button>
                        <button class="btn btn-small btn-danger" onclick="deleteCustomWordBook('${bookId}')" title="删除小词库" style="padding: 2px 6px;">×</button>
                    </div>
                `;
            }).join('');
        }
    }
}


/**
 * 搜索单词（实时过滤）
 */
let currentWordSearch = ''; // 当前搜索关键词

function handleWordSearch(query) {
    currentWordSearch = query.trim().toLowerCase();
    
    // 切换模式时清空搜索
    if (!currentWordSearch && App.words.length > 0) {
        renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
        return;
    }
    
    if (currentWordSearch === '') {
        renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
    } else {
        // 过滤匹配单词（匹配单词或释义）
        const filteredWords = App.words.filter(w => 
            w.word.toLowerCase().includes(currentWordSearch) ||
            (w.meaning && w.meaning.toLowerCase().includes(currentWordSearch))
        );
        renderWordList(filteredWords, App.selectedWords, App.errors, App.currentMode);
        
        // 显示搜索结果提示
        if (filteredWords.length === 0) {
            showNotification(`未找到匹配"${query}"的单词`, 'info');
        }
    }
}

/**
 * 渲染单词列表
 */
function renderWordList(words, selectedWords, errors, currentMode) {
    const container = document.getElementById('wordList');
    
    if (!words || words.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 40px;">暂无单词，请添加或导入</p>';
        return;
    }
    
    container.innerHTML = words.map(word => {
        const escapedWord = word.word.replace(/'/g, "\\'");
        const escapedMeaning = (word.meaning || '').replace(/'/g, "\\'");
        const hasErrors = errors && errors[word.word] > 0;
        const examples = word.examples || [];
        const exampleCount = examples.length;
        const examplePreview = exampleCount > 0
            ? examples.join(' / ').substring(0, 30) + (examples.join(' / ').length > 30 ? '…' : '')
            : '';

        return `
        <div class="word-item ${hasErrors ? 'has-errors' : ''}" onclick="toggleWordDetail(this, event)">
            <input type="checkbox" class="word-checkbox"
                   ${selectedWords.has(word.id) ? 'checked' : ''}
                   onchange="toggleWordSelection(${word.id})">
            <div class="word-info">
                <div class="word-text">${word.word} <span class="word-meaning-inline">${word.meaning || ''}</span></div>
                <div class="word-details word-detail-extra">
                    ${word.partOfSpeech || ''}
                    <span class="meaning-edit" style="color: #2c3e50; font-weight: 500; cursor: pointer;" onclick="startEditMeaning(${word.id}, this)" title="点击编辑释义">释义: ${word.meaning || '(无)'}</span>
                    ${hasErrors ? `<span style="color: #e74c3c;"> (错${errors[word.word]}次)</span>` : ''}
                </div>
                ${word.groupId ? `<div class="word-group-tag word-detail-extra">分组: ${word.groupId}</div>` : ''}
                <div class="word-example-row word-detail-extra" id="exampleRow_${word.id}">
                    <span class="example-display" style="color: #666; font-size: 0.85rem; cursor: pointer;" onclick="startEditExamples(${word.id})" title="点击编辑例句">
                        📝 例句: ${exampleCount > 0 ? examplePreview : '(无)'}
                        ${exampleCount > 0 ? `<span style="color: #007bff;">(${exampleCount}句)</span>` : ''}
                    </span>
                </div>
                ${hasErrors ? `<span class="word-error-badge">错${errors[word.word]}次</span>` : ''}
            </div>
            <div class="word-actions">
                <button class="btn btn-small btn-secondary" onclick="playWord('${escapedWord}')">🔊</button>
                <button class="btn btn-small btn-warning" onclick="addToErrorBook('${escapedWord}')">错词</button>
                <button class="btn btn-small btn-danger btn-delete-word" onclick="deleteWord(${word.id})">✕</button>
            </div>
            <span class="word-expand-hint">›</span>
        </div>
    `;
    }).join('');
}

// 点击释义开始编辑
function startEditMeaning(wordId, spanElement) {
    const currentMeaning = App.words.find(w => w.id === wordId)?.meaning || '';
    const escapedMeaning = currentMeaning.replace(/"/g, '&quot;');

    spanElement.innerHTML = `<input type="text" class="meaning-input" value="${escapedMeaning}" onblur="finishEditMeaning(${wordId}, this)" onkeydown="if(event.key==='Enter')this.blur()}" style="padding: 2px 4px; border: 1px solid #007bff; border-radius: 3px; width: 200px;">`;
    const input = spanElement.querySelector('input');
    input.focus();
    input.select();
}

// 编辑释义完成（失焦或按Enter时触发）
function finishEditMeaning(wordId, inputElement) {
    const newMeaning = inputElement.value.trim();
    editWordMeaning(wordId, newMeaning);
}

// 点击例句开始编辑（行内展开textarea）
function startEditExamples(wordId) {
    const word = App.words.find(w => w.id === wordId);
    if (!word) return;

    const examples = word.examples || [];
    const currentText = examples.join('\n');
    const escapedText = currentText.replace(/"/g, '&quot;').replace(/'/g, "\\'");

    const exampleRow = document.getElementById(`exampleRow_${wordId}`);
    if (!exampleRow) return;

    exampleRow.innerHTML = `
        <div style="margin-top: 5px;">
            <textarea class="example-input" rows="3" style="width: 100%; padding: 5px; border: 1px solid #007bff; border-radius: 4px; resize: vertical; font-size: 0.85rem;" placeholder="输入例句（每行一条例句）">${escapedText}</textarea>
            <div style="margin-top: 5px; text-align: right;">
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
    saveData();
    renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
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
        return;
    }
    
    const allSelected = errorWords.length > 0 && errorWords.every(([word]) => selectedErrorWords.has(word));
    
    container.innerHTML = `
        <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" ${allSelected ? 'checked' : ''} onchange="selectAllErrors()">
                <span>全选 (${errorWords.length}个错词)</span>
            </label>
        </div>
        <div class="error-list-items">
            ${errorWords.map(([word, count]) => `
                <div class="error-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px; border-bottom: 1px solid #eee;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" ${selectedErrorWords.has(word) ? 'checked' : ''} onchange="toggleErrorSelection('${word.replace(/'/g, "\\'")}')">
                        <span style="font-weight: 500;">${word}</span>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button class="btn btn-small btn-secondary" onclick="playWord('${word.replace(/'/g, "\\'")}')">🔊</button>
                        <button class="btn btn-small btn-warning" onclick="editErrorCount('${word.replace(/'/g, "\\'")}')">${count}</button>
                        <button class="btn btn-small btn-danger" onclick="{ App.errors['${word.replace(/'/g, "\\'")}'] = 0; delete App.errors['${word.replace(/'/g, "\\'")}']; App.selectedErrorWords.delete('${word.replace(/'/g, "\\'")}'); saveData(); renderErrorList(); }">删除</button>
                    </div>
                </div>
            `).join('')}
        </div>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #eee; display: flex; gap: 10px; justify-content: center;">
            <button class="btn btn-small btn-danger" onclick="deleteSelectedErrors()">删除选中</button>
            <button class="btn btn-small btn-secondary" onclick="clearErrors()">清空全部</button>
        </div>
    `;
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
            ? '输入英文单词，每行一个（如：\napple\nbook\ncat）'
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
    
    // 更新分组区域
    const groupSection = document.getElementById('groupSection');
    if (groupSection) {
        groupSection.classList.toggle('hidden', !isEnglish);
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
        DataManager.save(
            App.englishWords, App.englishErrors, App.englishGroups,
            App.chineseWords, App.chineseErrors, App.chineseGroups,
            App.settings, App.currentMode
        );
    }

    // 同步播放间隔select状态
    const intervalTimeEl = document.getElementById('intervalTime');
    const intervalOptions = Array.from(intervalTimeEl.options).map(o => o.value);
    if (intervalOptions.includes(String(App.settings.intervalTime))) {
        intervalTimeEl.value = String(App.settings.intervalTime);
    } else if (intervalOptions.length > 0) {
        intervalTimeEl.value = intervalOptions[0];
        App.settings.intervalTime = parseInt(intervalOptions[0]);
        DataManager.save(
            App.englishWords, App.englishErrors, App.englishGroups,
            App.chineseWords, App.chineseErrors, App.chineseGroups,
            App.settings, App.currentMode
        );
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
        DataManager.save(
            App.englishWords, App.englishErrors, App.englishGroups,
            App.chineseWords, App.chineseErrors, App.chineseGroups,
            App.settings, App.currentMode
        );
    }

    // 同步显示选项checkbox状态
    document.getElementById('showMeaning').checked = App.settings.showMeaning;
    document.getElementById('showWord').checked = App.settings.showWord;
    document.getElementById('showExamples').checked = App.settings.showExamples;
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
            DataManager.save(
                App.englishWords, App.englishErrors, App.englishGroups,
                App.chineseWords, App.chineseErrors, App.chineseGroups,
                App.settings, App.currentMode,
                App.englishCustomBooks, App.chineseCustomBooks
            );
        });
    });
    
    document.querySelectorAll('input[name="order"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            App.settings.order = e.target.value;
            DataManager.save(
                App.englishWords, App.englishErrors, App.englishGroups,
                App.chineseWords, App.chineseErrors, App.chineseGroups,
                App.settings, App.currentMode,
                App.englishCustomBooks, App.chineseCustomBooks
            );
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
            }
            DataManager.save(
                App.englishWords, App.englishErrors, App.englishGroups,
                App.chineseWords, App.chineseErrors, App.chineseGroups,
                App.settings, App.currentMode,
                App.englishCustomBooks, App.chineseCustomBooks
            );
        });
    });
    
    document.getElementById('playCount').addEventListener('change', (e) => {
        App.settings.playCount = parseInt(e.target.value);
        DataManager.save(
            App.englishWords, App.englishErrors, App.englishGroups,
            App.chineseWords, App.chineseErrors, App.chineseGroups,
            App.settings, App.currentMode,
            App.englishCustomBooks, App.chineseCustomBooks
        );
    });
    
    document.getElementById('intervalTime').addEventListener('change', (e) => {
        App.settings.intervalTime = parseInt(e.target.value);
        DataManager.save(
            App.englishWords, App.englishErrors, App.englishGroups,
            App.chineseWords, App.chineseErrors, App.chineseGroups,
            App.settings, App.currentMode,
            App.englishCustomBooks, App.chineseCustomBooks
        );
    });
    
    document.getElementById('speechRate').addEventListener('change', (e) => {
        App.settings.speechRate = parseFloat(e.target.value);
        DataManager.save(
            App.englishWords, App.englishErrors, App.englishGroups,
            App.chineseWords, App.chineseErrors, App.chineseGroups,
            App.settings, App.currentMode,
            App.englishCustomBooks, App.chineseCustomBooks
        );
    });
    
    document.getElementById('showMeaning').addEventListener('change', (e) => {
        App.settings.showMeaning = e.target.checked;
        DataManager.save(
            App.englishWords, App.englishErrors, App.englishGroups,
            App.chineseWords, App.chineseErrors, App.chineseGroups,
            App.settings, App.currentMode,
            App.englishCustomBooks, App.chineseCustomBooks
        );
    });
    
    document.getElementById('showWord').addEventListener('change', (e) => {
        App.settings.showWord = e.target.checked;
        DataManager.save(
            App.englishWords, App.englishErrors, App.englishGroups,
            App.chineseWords, App.chineseErrors, App.chineseGroups,
            App.settings, App.currentMode,
            App.englishCustomBooks, App.chineseCustomBooks
        );
    });

    document.getElementById('showExamples').addEventListener('change', (e) => {
        App.settings.showExamples = e.target.checked;
        DataManager.save(
            App.englishWords, App.englishErrors, App.englishGroups,
            App.chineseWords, App.chineseErrors, App.chineseGroups,
            App.settings, App.currentMode,
            App.englishCustomBooks, App.chineseCustomBooks
        );
    });
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
    const checkboxes = document.querySelectorAll('#backupModal input[type="checkbox"]');
    const options = {
        englishWords: document.getElementById('bk_englishWords').checked,
        englishErrors: document.getElementById('bk_englishErrors').checked,
        englishCustomBooks: document.getElementById('bk_englishCustomBooks').checked,
        chineseWords: document.getElementById('bk_chineseWords').checked,
        chineseErrors: document.getElementById('bk_chineseErrors').checked,
        chineseCustomBooks: document.getElementById('bk_chineseCustomBooks').checked
    };

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
        chineseWords: App.chineseWords,
        chineseErrors: App.chineseErrors,
        chineseCustomBooks: App.chineseCustomBooks
    };

    const result = DataManager.backupImport(backupData, existingData, options);

    // 更新App数据
    App.englishWords = result.englishWords || [];
    App.englishErrors = result.englishErrors || {};
    App.englishCustomBooks = result.englishCustomBooks || {};
    App.chineseWords = result.chineseWords || [];
    App.chineseErrors = result.chineseErrors || {};
    App.chineseCustomBooks = result.chineseCustomBooks || {};

    // 保存到localStorage
    saveData();

    // 刷新UI
    renderWordList(App.words, App.selectedWords, App.errors, App.currentMode);
    renderCustomWordBooks();
    renderErrorList(App.errors, App.selectedErrorWords, App.words);
    updateCounts();

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

// 导出UI模块
window.UIManager = {
    showNotification,
    renderWordList,
    renderGroupList,
    renderErrorList,
    updateStats,
    updateCounts,
    updateModeUI,
    updateControlButtons,
    setupEventListeners,
    showCreateGroupDialog,
    addWordToGroup,
    removeWordFromGroup,
    deleteGroup,
    toggleGroupExpand,
    practiceGroup
};