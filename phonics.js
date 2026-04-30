/**
 * 自然拼读法模块 (phonics.js)
 * 包含字母组合发音规则学习
 */

/**
 * 音标发音映射表 - 将IPA音标映射到TTS可准确发音的英文单词
 * 作用：点击"听读"时，用这个映射来播放音标的正确发音
 */
const phonemePronunciations = {
    // 短元音
    '/æ/': 'cat',
    '/e/': 'bed',
    '/ɪ/': 'sit',
    '/ɒ/': 'hot',
    '/ʌ/': 'cup',
    // 长元音
    '/eɪ/': 'day',
    '/iː/': 'see',
    '/aɪ/': 'time',
    '/əʊ/': 'home',
    '/juː/': 'use',
    '/uː/': 'food',
    // 辅音组合
    '/bl/': 'blue',
    '/kl/': 'clock',
    '/fl/': 'flower',
    '/gl/': 'glass',
    '/pl/': 'play',
    '/pr/': 'pray',
    '/tr/': 'tree',
    '/dr/': 'drink',
    '/gr/': 'green',
    '/br/': 'brown',
    '/kr/': 'cry',
    '/fr/': 'frog',
    '/θr/': 'three',
    '/skr/': 'scratch',
    '/spl/': 'splash',
    // 字母组合
    '/tʃ/': 'chair',
    '/ʃ/': 'ship',
    '/ð/': 'this',
    '/θ/': 'think',
    '/w/': 'water',
    '/f/': 'fish',
    '/ŋ/': 'sing',
    '/k/': 'back',
    '/kw/': 'queen',
    // 特殊发音
    '/aʊ/': 'out',
    '/ɔɪ/': 'boy',
    '/ɜː/': 'bird',
};

/**
 * 自然拼读法规则库
 */
const PhonicsRules = {
    // 单元音和短元音
    shortVowels: {
        'a': {
            pattern: 'a',
            sounds: [
                { sound: '/æ/', pronunciation: 'cat', examples: ['apple', 'cat', 'bag', 'hat', 'map', 'dad', 'mad', 'pan', 'can', 'fan'] }
            ],
            description: '元音字母 a 在重读闭音节中发 /æ/ 音'
        },
        'e': {
            pattern: 'e',
            sounds: [
                { sound: '/e/', pronunciation: 'bed', examples: ['egg', 'bed', 'red', 'pen', 'ten', 'leg', 'get', 'pet', 'wet', 'net'] }
            ],
            description: '元音字母 e 在重读闭音节中发 /e/ 音'
        },
        'i': {
            pattern: 'i',
            sounds: [
                { sound: '/ɪ/', pronunciation: 'sit', examples: ['in', 'big', 'sit', 'pig', 'six', 'bit', 'fish', 'milk', 'gift', 'wing'] }
            ],
            description: '元音字母 i 在重读闭音节中发 /ɪ/ 音'
        },
        'o': {
            pattern: 'o',
            sounds: [
                { sound: '/ɒ/', pronunciation: 'hot', examples: ['on', 'hot', 'dog', 'log', 'pot', 'top', 'mop', 'box', 'fox', 'sock'] }
            ],
            description: '元音字母 o 在重读闭音节中发 /ɒ/ 音'
        },
        'u': {
            pattern: 'u',
            sounds: [
                { sound: '/ʌ/', pronunciation: 'cup', examples: ['up', 'cup', 'bus', 'nut', 'cut', 'run', 'fun', 'sun', 'mud', 'duck'] }
            ],
            description: '元音字母 u 在重读闭音节中发 /ʌ/ 音'
        }
    },
    
    // 长元音和元音组合
    longVowels: {
        'a_e': {
            pattern: 'a_e (magic e)',
            sounds: [
                { sound: '/eɪ/', pronunciation: 'make', examples: ['make', 'cake', 'take', 'name', 'game', 'save', 'lake', 'wake', 'bake', 'came'] }
            ],
            description: '辅音+e结构，a发长音/eɪ/'
        },
        'e_e': {
            pattern: 'e_e (magic e)',
            sounds: [
                { sound: '/iː/', pronunciation: 'these', examples: ['these', 'theme', 'eve', 'complete', 'athlete'] }
            ],
            description: '辅音+e结构，e发长音/iː/'
        },
        'i_e': {
            pattern: 'i_e (magic e)',
            sounds: [
                { sound: '/aɪ/', pronunciation: 'like', examples: ['like', 'bike', 'time', 'nine', 'kite', 'fine', 'five', 'mine', 'nice', 'hide'] }
            ],
            description: '辅音+e结构，i发长音/aɪ/'
        },
        'o_e': {
            pattern: 'o_e (magic e)',
            sounds: [
                { sound: '/əʊ/', pronunciation: 'home', examples: ['home', 'hope', 'note', 'code', 'bone', 'phone', 'rose', 'hole', 'pole', 'role'] }
            ],
            description: '辅音+e结构，o发长音/əʊ/'
        },
        'u_e': {
            pattern: 'u_e (magic e)',
            sounds: [
                { sound: '/juː/', pronunciation: 'use', examples: ['use', 'cube', 'pure', 'mute', 'huge', 'cute', 'tube', 'June', 'fune', 'rule'] }
            ],
            description: '辅音+e结构，u发长音/juː/'
        },
        'ai': {
            pattern: 'ai',
            sounds: [
                { sound: '/eɪ/', pronunciation: 'rain', examples: ['rain', 'tail', 'mail', 'paint', 'train', 'wait', 'fail', 'sail', 'bail', 'main'] }
            ],
            description: 'ai 组合发 /eɪ/ 音'
        },
        'ay': {
            pattern: 'ay',
            sounds: [
                { sound: '/eɪ/', pronunciation: 'day', examples: ['day', 'say', 'way', 'play', 'stay', 'may', 'lay', 'pay', 'ray', 'gray'] }
            ],
            description: 'ay 组合发 /eɪ/ 音'
        },
        'ee': {
            pattern: 'ee',
            sounds: [
                { sound: '/iː/', pronunciation: 'see', examples: ['see', 'tree', 'feel', 'sleep', 'green', 'feet', 'meet', 'week', 'sheep', 'three'] }
            ],
            description: 'ee 组合发 /iː/ 音'
        },
        'ea': {
            pattern: 'ea',
            sounds: [
                { sound: '/iː/', pronunciation: 'sea', examples: ['sea', 'tea', 'read', 'eat', 'meat', 'beat', 'heat', 'real', 'leaf', 'dream'] }
            ],
            description: 'ea 组合发 /iː/ 音'
        },
        'oa': {
            pattern: 'oa',
            sounds: [
                { sound: '/əʊ/', pronunciation: 'boat', examples: ['boat', 'coat', 'road', 'soap', 'goat', 'load', 'toad', 'coach', 'roach', 'moat'] }
            ],
            description: 'oa 组合发 /əʊ/ 音'
        },
        'ow': {
            pattern: 'ow (长o)',
            sounds: [
                { sound: '/əʊ/', pronunciation: 'low', examples: ['low', 'show', 'know', 'grow', 'throw', 'flow', 'snow', 'blow', 'slow', 'window'] }
            ],
            description: 'ow 组合在单词末尾时常发 /əʊ/ 音'
        }
    },
    
    // 辅音组合
    consonantBlends: {
        'bl': {
            pattern: 'bl',
            sounds: [{ sound: '/bl/', pronunciation: 'blue', examples: ['blue', 'blown', 'blanket', 'blog', 'blast', 'bleed', 'blink', 'block', 'blood', 'bloom'] }],
            description: 'bl 组合发 /bl/ 音'
        },
        'cl': {
            pattern: 'cl',
            sounds: [{ sound: '/kl/', pronunciation: 'clock', examples: ['clock', 'class', 'clean', 'close', 'clever', 'cloud', 'club', 'click', 'clap', 'claw'] }],
            description: 'cl 组合发 /kl/ 音'
        },
        'fl': {
            pattern: 'fl',
            sounds: [{ sound: '/fl/', pronunciation: 'flower', examples: ['flower', 'flag', 'floor', 'flood', 'flesh', 'float', 'flip', 'flash', 'flame', 'flame'] }],
            description: 'fl 组合发 /fl/ 音'
        },
        'gl': {
            pattern: 'gl',
            sounds: [{ sound: '/gl/', pronunciation: 'glass', examples: ['glass', 'glad', 'glow', 'globe', 'glove', 'glue', 'gleam', 'glance', 'glide', 'glint'] }],
            description: 'gl 组合发 /gl/ 音'
        },
        'pl': {
            pattern: 'pl',
            sounds: [{ sound: '/pl/', pronunciation: 'play', examples: ['play', 'plane', 'planet', 'plant', 'plate', 'plum', 'plus', 'plank', 'plop', 'plod'] }],
            description: 'pl 组合发 /pl/ 音'
        },
        'pr': {
            pattern: 'pr',
            sounds: [{ sound: '/pr/', pronunciation: 'pray', examples: ['pray', 'pretty', 'prince', 'prize', 'present', 'press', 'print', 'proud', 'pram', 'probe'] }],
            description: 'pr 组合发 /pr/ 音'
        },
        'tr': {
            pattern: 'tr',
            sounds: [{ sound: '/tr/', pronunciation: 'tree', examples: ['tree', 'train', 'try', 'true', 'truck', 'trip', 'track', 'trust', 'trade', 'trap'] }],
            description: 'tr 组合发 /tr/ 音'
        },
        'dr': {
            pattern: 'dr',
            sounds: [{ sound: '/dr/', pronunciation: 'drink', examples: ['drink', 'drive', 'drop', 'draw', 'dress', 'dream', 'dry', 'drum', 'drag', 'drug'] }],
            description: 'dr 组合发 /dr/ 音'
        },
        'gr': {
            pattern: 'gr',
            sounds: [{ sound: '/gr/', pronunciation: 'green', examples: ['green', 'grow', 'grape', 'grass', 'grand', 'grade', 'gray', 'grave', 'grip', 'groan'] }],
            description: 'gr 组合发 /gr/ 音'
        },
        'br': {
            pattern: 'br',
            sounds: [{ sound: '/br/', pronunciation: 'brown', examples: ['brown', 'bread', 'brother', 'bring', 'bright', 'brush', 'break', 'brain', 'brick', 'broom'] }],
            description: 'br 组合发 /br/ 音'
        },
        'cr': {
            pattern: 'cr',
            sounds: [{ sound: '/kr/', pronunciation: 'cry', examples: ['cry', 'cream', 'crop', 'cross', 'crowd', 'crown', 'crash', 'crisp', 'crib', 'crust'] }],
            description: 'cr 组合发 /kr/ 音'
        },
        'fr': {
            pattern: 'fr',
            sounds: [{ sound: '/fr/', pronunciation: 'frog', examples: ['frog', 'fright', 'free', 'fresh', 'frame', 'fruit', 'from', 'friend', 'front', 'frost'] }],
            description: 'fr 组合发 /fr/ 音'
        },
        'thr': {
            pattern: 'thr',
            sounds: [{ sound: '/θr/', pronunciation: 'three', examples: ['three', 'thread', 'throat', 'throne', 'throw', 'thrill', 'throb', 'thrash', 'thrift', 'throne'] }],
            description: 'thr 组合发 /θr/ 音'
        },
        'scr': {
            pattern: 'scr',
            sounds: [{ sound: '/skr/', pronunciation: 'scratch', examples: ['scratch', 'screen', 'screw', 'script', 'scroll', 'scrub', 'screen', 'scream', 'scrape', 'scrawl'] }],
            description: 'scr 组合发 /skr/ 音'
        },
        'spl': {
            pattern: 'spl',
            sounds: [{ sound: '/spl/', pronunciation: 'splash', examples: ['splash', 'split', 'splendid', 'splice', 'splint', 'splinter', 'splurge', 'spoilage'] }],
            description: 'spl 组合发 /spl/ 音'
        }
    },
    
    // 字母组合
    letterCombinations: {
        'ch': {
            pattern: 'ch',
            sounds: [
                { sound: '/tʃ/', pronunciation: 'chair', examples: ['chair', 'child', 'cheese', 'cherry', 'chicken', 'choose', 'chop', 'chat', 'check', 'chest'] }
            ],
            description: 'ch 组合发 /tʃ/ 音'
        },
        'sh': {
            pattern: 'sh',
            sounds: [
                { sound: '/ʃ/', pronunciation: 'ship', examples: ['she', 'ship', 'shop', 'shell', 'shirt', 'short', 'shower', 'shape', 'shake', 'shiny'] }
            ],
            description: 'sh 组合发 /ʃ/ 音'
        },
        'th': {
            pattern: 'th',
            sounds: [
                { sound: '/ð/', pronunciation: 'this', examples: ['this', 'that', 'the', 'they', 'there', 'there', 'them', 'these', 'those', 'father'] },
                { sound: '/θ/', pronunciation: 'think', examples: ['think', 'three', 'thumb', 'thick', 'thin', 'thank', 'thirsty', 'thirty', 'thirteen', 'throne'] }
            ],
            description: 'th 组合发 /ð/ (this) 或 /θ/ (think) 音'
        },
        'wh': {
            pattern: 'wh',
            sounds: [
                { sound: '/w/', pronunciation: 'what', examples: ['what', 'when', 'where', 'why', 'white', 'wheel', 'whip', 'whale', 'wheat', 'whisper'] }
            ],
            description: 'wh 组合发 /w/ 音'
        },
        'ph': {
            pattern: 'ph',
            sounds: [
                { sound: '/f/', pronunciation: 'phone', examples: ['phone', 'photo', 'elephant', 'dolphin', 'alphabet', 'paragraph', 'phonics', 'pharmacy'] }
            ],
            description: 'ph 组合发 /f/ 音'
        },
        'ng': {
            pattern: 'ng',
            sounds: [
                { sound: '/ŋ/', pronunciation: 'sing', examples: ['sing', 'ring', 'king', 'long', 'song', 'spring', 'strong', 'young', 'morning', 'evening'] }
            ],
            description: 'ng 组合发 /ŋ/ 音'
        },
        'ck': {
            pattern: 'ck',
            sounds: [
                { sound: '/k/', pronunciation: 'back', examples: ['back', 'black', 'clock', 'duck', 'truck', 'sock', 'rock', 'pick', 'stick', 'quick'] }
            ],
            description: 'ck 组合发 /k/ 音'
        },
        'qu': {
            pattern: 'qu',
            sounds: [
                { sound: '/kw/', pronunciation: 'queen', examples: ['queen', 'quick', 'quiet', 'quiz', 'quarter', 'quilt', 'quarrel', 'quote', 'quest', 'quack'] }
            ],
            description: 'qu 组合发 /kw/ 音'
        }
    },
    
    // 特殊发音
    specialSounds: {
        'ou': {
            pattern: 'ou',
            sounds: [
                { sound: '/aʊ/', pronunciation: 'out', examples: ['out', 'about', 'mouth', 'cloud', 'sound', 'count', 'ground', 'found', 'round', 'house'] }
            ],
            description: 'ou 组合发 /aʊ/ 音'
        },
        'ow': {
            pattern: 'ow (ow音)',
            sounds: [
                { sound: '/aʊ/', pronunciation: 'cow', examples: ['cow', 'how', 'now', 'brown', 'down', 'town', 'flower', 'tower', 'power', 'shower'] }
            ],
            description: 'ow 组合发 /aʊ/ 音'
        },
        'oi': {
            pattern: 'oi/oy',
            sounds: [
                { sound: '/ɔɪ/', pronunciation: 'boy', examples: ['boy', 'toy', 'enjoy', 'oil', 'coin', 'point', 'voice', 'join', 'coin', 'moist'] }
            ],
            description: 'oi/oy 组合发 /ɔɪ/ 音'
        },
        'ir': {
            pattern: 'ir/ur/er',
            sounds: [
                { sound: '/ɜː/', pronunciation: 'bird', examples: ['bird', 'girl', 'shirt', 'skirt', 'birthday', 'nurse', 'purse', 'turn', 'purple', 'hamburger'] }
            ],
            description: 'ir/ur/er 组合发 /ɜː/ 音'
        },
        'or': {
            pattern: 'or/our',
            sounds: [
                { sound: '/ɔː/', pronunciation: 'or', examples: ['or', 'for', 'short', 'horse', 'more', 'score', 'door', 'floor', 'store', 'before'] }
            ],
            description: 'or/our 组合发 /ɔː/ 音'
        },
        'ar': {
            pattern: 'ar',
            sounds: [
                { sound: '/ɑː/', pronunciation: 'car', examples: ['car', 'far', 'star', 'card', 'park', 'dark', 'farm', 'arm', 'art', 'party'] }
            ],
            description: 'ar 组合发 /ɑː/ 音'
        },
        'air': {
            pattern: 'air/are',
            sounds: [
                { sound: '/eə/', pronunciation: 'air', examples: ['air', 'chair', 'hair', 'pair', 'fair', 'stair', 'care', 'share', 'bare', 'dare'] }
            ],
            description: 'air/are 组合发 /eə/ 音'
        },
        'ear': {
            pattern: 'ear',
            sounds: [
                { sound: '/ɪə/', pronunciation: 'ear', examples: ['ear', 'hear', 'dear', 'near', 'fear', 'clear', 'year', 'tear', 'learn', 'pearl'] }
            ],
            description: 'ear 组合发 /ɪə/ 音'
        },
        'oo': {
            pattern: 'oo (长音)',
            sounds: [
                { sound: '/uː/', pronunciation: 'moon', examples: ['moon', 'zoo', 'food', 'room', 'school', 'pool', 'cool', 'tool', 'tooth', 'spoon'] }
            ],
            description: 'oo 组合发 /uː/ 长音'
        },
        'oo_short': {
            pattern: 'oo (短音)',
            sounds: [
                { sound: '/ʊ/', pronunciation: 'book', examples: ['book', 'cook', 'look', 'good', 'foot', 'wood', 'wool', 'stood', 'hood', 'shook'] }
            ],
            description: 'oo 组合发 /ʊ/ 短音'
        }
    }
};

/**
 * 自然拼读法管理器
 */
const PhonicsManager = {
    /**
     * 获取所有规则分类
     */
    getCategories() {
        return [
            { id: 'shortVowels', name: '短元音', icon: '🔤', color: '#e74c3c' },
            { id: 'longVowels', name: '长元音', icon: '🔠', color: '#3498db' },
            { id: 'consonantBlends', name: '辅音组合', icon: '🔗', color: '#27ae60' },
            { id: 'letterCombinations', name: '字母组合', icon: '📝', color: '#9b59b6' },
            { id: 'specialSounds', name: '特殊发音', icon: '✨', color: '#f39c12' }
        ];
    },
    
    /**
     * 获取指定分类的规则
     */
    getRulesByCategory(categoryId) {
        const rules = PhonicsRules[categoryId];
        if (!rules) return [];
        
        return Object.entries(rules).map(([key, rule]) => ({
            id: key,
            ...rule
        }));
    },
    
    /**
     * 获取所有规则
     */
    getAllRules() {
        const allRules = [];
        
        Object.entries(PhonicsRules).forEach(([category, rules]) => {
            Object.entries(rules).forEach(([key, rule]) => {
                allRules.push({
                    id: key,
                    category,
                    ...rule
                });
            });
        });
        
        return allRules;
    },
    
    /**
     * 搜索规则
     */
    searchRules(query) {
        const allRules = this.getAllRules();
        const lowerQuery = query.toLowerCase();
        
        return allRules.filter(rule => {
            // 匹配模式
            if (rule.pattern.toLowerCase().includes(lowerQuery)) return true;
            // 匹配描述
            if (rule.description.toLowerCase().includes(lowerQuery)) return true;
            // 匹配音标
            if (rule.sounds.some(s => s.sound.includes(lowerQuery))) return true;
            // 匹配示例
            if (rule.sounds.some(s => s.examples.some(e => e.toLowerCase().includes(lowerQuery)))) return true;
            
            return false;
        });
    },
    
    /**
     * 获取随机练习
     */
    getRandomPractice(count = 10) {
        const allRules = this.getAllRules();
        const shuffled = allRules.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(count, shuffled.length));
        
        return selected.map(rule => {
            const randomSound = rule.sounds[Math.floor(Math.random() * rule.sounds.length)];
            const randomExample = randomSound.examples[Math.floor(Math.random() * randomSound.examples.length)];
            
            return {
                ruleId: rule.id,
                pattern: rule.pattern,
                description: rule.description,
                targetSound: randomSound.sound,
                word: randomExample
            };
        });
    },
    
    /**
     * 生成练习题目
     */
    generateExercises(ruleId, count = 5) {
        const allRules = this.getAllRules();
        const rule = allRules.find(r => r.id === ruleId);
        
        if (!rule) return [];
        
        return rule.sounds.flatMap(sound => 
            sound.examples.slice(0, count).map(example => ({
                word: example,
                expectedSound: sound.sound,
                pattern: rule.pattern,
                description: rule.description
            }))
        ).slice(0, count);
    }
};

/**
 * 渲染自然拼读法学习界面
 */
function renderPhonicsLearn() {
    const container = document.getElementById('phonicsContent');
    const categories = PhonicsManager.getCategories();
    
    let html = `
        <div class="phonics-header">
            <h3>📚 自然拼读法</h3>
            <p class="phonics-intro">学习字母和字母组合的发音规则</p>
        </div>
        
        <div class="phonics-search">
            <input type="text" id="phonicsSearchInput" placeholder="搜索音标、例词或规则..."
                   oninput="searchPhonics(this.value)">
        </div>
        
        <div class="phonics-tabs">
            ${categories.map(cat => `
                <button class="phonics-tab" data-category="${cat.id}" 
                        onclick="switchPhonicsCategory('${cat.id}')"
                        style="--tab-color: ${cat.color}">
                    ${cat.icon} ${cat.name}
                </button>
            `).join('')}
        </div>
        
        <div id="phonicsRulesContainer" class="phonics-rules-container">
            <!-- 规则内容将在这里渲染 -->
        </div>
    `;
    
    container.innerHTML = html;
    
    // 默认显示第一个分类
    switchPhonicsCategory('shortVowels');
}

/**
 * 切换拼读法分类
 */
function switchPhonicsCategory(categoryId) {
    // 更新标签高亮
    document.querySelectorAll('.phonics-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === categoryId);
    });
    
    const rules = PhonicsManager.getRulesByCategory(categoryId);
    const container = document.getElementById('phonicsRulesContainer');
    
    container.innerHTML = rules.map(rule => `
        <div class="phonics-rule-card">
            <div class="phonics-rule-header">
                <span class="phonics-pattern">${rule.pattern}</span>
                <button class="btn btn-small btn-secondary" onclick="playPhonicsRule('${rule.id}')">🔊 听读</button>
            </div>
            <p class="phonics-description">${rule.description}</p>
            <div class="phonics-sounds">
                ${rule.sounds.map(sound => `
                    <div class="phonics-sound-item">
                        <div class="phonics-sound-label">发音: <strong>${sound.sound}</strong></div>
                        <div class="phonics-examples">
                            ${sound.examples.map(word => `
                                <span class="phonics-example" onclick="playPhonicsWord('${word}')">${word}</span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="phonics-actions">
                <button class="btn btn-small" onclick="practicePhonicsRule('${rule.id}')">练习这个规则</button>
            </div>
        </div>
    `).join('');
}

/**
 * 播放拼读规则示例 - 播放音标发音
 */
function playPhonicsRule(ruleId) {
    const allRules = PhonicsManager.getAllRules();
    const rule = allRules.find(r => r.id === ruleId);

    if (!rule) return;

    // 播放音标发音（使用pronunciation字段指定的单词）
    if (rule.sounds.length > 0) {
        const soundObj = rule.sounds[0];
        // 优先使用pronunciation字段，否则使用映射表，最后使用第一个例词
        let wordToPlay = soundObj.pronunciation;
        if (!wordToPlay) {
            wordToPlay = phonemePronunciations[soundObj.sound];
        }
        if (!wordToPlay) {
            wordToPlay = soundObj.examples[0];
        }
        playWord(wordToPlay, 'english', 0.8);
    }
}

/**
 * 播放拼读单词
 */
function playPhonicsWord(word) {
    playWord(word, 'english', 0.8);
}

/**
 * 搜索拼读规则
 */
function searchPhonics(query) {
    if (!query || query.length < 1) {
        switchPhonicsCategory('shortVowels');
        return;
    }
    
    const results = PhonicsManager.searchRules(query);
    const container = document.getElementById('phonicsRulesContainer');
    
    if (results.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 20px;">没有找到匹配的结果</p>';
        return;
    }
    
    container.innerHTML = results.map(rule => `
        <div class="phonics-rule-card">
            <div class="phonics-rule-header">
                <span class="phonics-pattern">${rule.pattern}</span>
                <span class="phonics-category-tag">${rule.category}</span>
            </div>
            <p class="phonics-description">${rule.description}</p>
            <div class="phonics-sounds">
                ${rule.sounds.map(sound => `
                    <div class="phonics-sound-item">
                        <div class="phonics-sound-label">发音: <strong>${sound.sound}</strong></div>
                        <div class="phonics-examples">
                            ${sound.examples.slice(0, 5).map(word => `
                                <span class="phonics-example" onclick="playPhonicsWord('${word}')">${word}</span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

/**
 * 练习指定规则
 */
function practicePhonicsRule(ruleId) {
    const exercises = PhonicsManager.generateExercises(ruleId, 5);
    
    if (exercises.length === 0) {
        showNotification('无法生成练习', 'error');
        return;
    }
    
    // 保存练习数据
    App.currentPhonicsPractice = {
        exercises,
        currentIndex: 0,
        correctCount: 0
    };
    
    // 显示练习模式
    document.getElementById('phonicsContent').innerHTML = `
        <div class="phonics-practice">
            <div class="phonics-practice-header">
                <h4>🎯 拼读练习</h4>
                <button class="btn btn-small" onclick="exitPhonicsPractice()">退出练习</button>
            </div>
            <div id="phonicsExerciseContent"></div>
        </div>
    `;
    
    showNextPhonicsExercise();
}

/**
 * 显示下一个拼读练习
 */
function showNextPhonicsExercise() {
    const practice = App.currentPhonicsPractice;
    if (!practice) return;
    
    if (practice.currentIndex >= practice.exercises.length) {
        // 练习完成
        const accuracy = Math.round((practice.correctCount / practice.exercises.length) * 100);
        document.getElementById('phonicsExerciseContent').innerHTML = `
            <div class="phonics-result">
                <h4>🎉 练习完成！</h4>
                <p>正确率: ${accuracy}%</p>
                <p>答对: ${practice.correctCount} / ${practice.exercises.length}</p>
                <div class="phonics-result-actions">
                    <button class="btn" onclick="practicePhonicsRule('${practice.exercises[0].pattern}')">再练一次</button>
                    <button class="btn btn-secondary" onclick="exitPhonicsPractice()">返回</button>
                </div>
            </div>
        `;
        return;
    }
    
    const exercise = practice.exercises[practice.currentIndex];
    
    document.getElementById('phonicsExerciseContent').innerHTML = `
        <div class="phonics-exercise-card">
            <div class="phonics-progress">
                进度: ${practice.currentIndex + 1} / ${practice.exercises.length}
            </div>
            <div class="phonics-exercise-word" onclick="playPhonicsWord('${exercise.word}')">
                ${exercise.word}
                <span class="play-hint">🔊 点击听发音</span>
            </div>
            <p class="phonics-hint">提示: ${exercise.description}</p>
            <p class="phonics-sound-question">这个单词的发音是什么？</p>
            <div class="phonics-sound-options">
                ${practice.exercises.slice(0, 4).map((ex, i) => `
                    <button class="phonics-option" onclick="checkPhonicsAnswer('${ex.expectedSound}', '${exercise.expectedSound}')">
                        ${ex.expectedSound}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * 检查拼读答案
 */
function checkPhonicsAnswer(selected, correct) {
    const practice = App.currentPhonicsPractice;
    if (!practice) return;
    
    const exercise = practice.exercises[practice.currentIndex];
    
    if (selected === correct) {
        practice.correctCount++;
        showNotification('✅ 正确！', 'success');
    } else {
        showNotification(`❌ 正确答案是: ${correct}`, 'error');
    }
    
    practice.currentIndex++;
    
    setTimeout(() => {
        showNextPhonicsExercise();
    }, 1000);
}

/**
 * 退出拼读练习
 */
function exitPhonicsPractice() {
    App.currentPhonicsPractice = null;
    renderPhonicsLearn();
}

/**
 * 获取拼读统计数据
 */
function getPhonicsStats() {
    const allRules = PhonicsManager.getAllRules();
    return {
        totalRules: allRules.length,
        categories: PhonicsManager.getCategories().length,
        examples: allRules.reduce((sum, r) => sum + r.sounds.reduce((s, sound) => s + sound.examples.length, 0), 0)
    };
}

// 导出模块
window.PhonicsManager = PhonicsManager;
window.PhonicsRules = PhonicsRules;
window.renderPhonicsLearn = renderPhonicsLearn;
window.switchPhonicsCategory = switchPhonicsCategory;
window.playPhonicsRule = playPhonicsRule;
window.playPhonicsWord = playPhonicsWord;
window.searchPhonics = searchPhonics;
window.practicePhonicsRule = practicePhonicsRule;
window.showNextPhonicsExercise = showNextPhonicsExercise;
window.checkPhonicsAnswer = checkPhonicsAnswer;
window.exitPhonicsPractice = exitPhonicsPractice;