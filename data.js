/**
 * 数据层 (data.js)
 * 负责数据管理、持久化、API调用等核心数据操作
 */

// 优化的小学生词汇释义库（简洁常用释义，参考牛津词典）
const OptimizedMeanings = {
    'boy': '男孩',
    'girl': '女孩',
    'child': '孩子；儿童',
    'children': '孩子们',
    'man': '男人',
    'woman': '女人',
    'people': '人们；人',
    'friend': '朋友',
    'family': '家庭；家人',
    'mother': '妈妈',
    'father': '爸爸',
    'mom': '妈妈',
    'dad': '爸爸',
    'sister': '姐妹',
    'brother': '兄弟',
    'grandmother': '奶奶；外婆',
    'grandfather': '爷爷；外公',
    'grandma': '奶奶',
    'grandpa': '爷爷',
    'aunt': '阿姨；姑姑',
    'uncle': '叔叔；舅舅',
    'cousin': '堂兄姐妹；表兄姐妹',
    'teacher': '老师',
    'doctor': '医生',
    'nurse': '护士',
    'driver': '司机',
    'farmer': '农民；农场主',
    'worker': '工人',
    'cook': '厨师',
    'plant': '植物；种植',
    'near': '靠近；在...附近',
    'supermarket': '超市',
    'around': '围绕；大约',
    'park': '公园',
    'sign': '标志；指示牌',
    'light': '灯；轻的',
    'mean': '意思是；意味着',
    'stop': '停止；停下',
    'wait': '等待；等候',
    'road': '道路；公路',
    'quiet': '安静的',
    'safe': '安全的',
    'better': '更好的',
    'dirty': '脏的',
    'flower': '花；花朵',
    'traffic': '交通',
    'special': '特殊的；特别的',
    'culture': '文化',
    'when': '什么时候；何时',
    'fly': '飞；飞行',
    'kite': '风筝',
    'parents': '父母；家长',
    'city': '城市',
    'bring': '带来；拿来',
    'umbrella': '雨伞；伞',
    'birthday': '生日',
    'photo': '照片；相片',
    'meal': '一餐；一顿饭',
    'trip': '旅行；出行',
    'card': '卡片；贺卡',
    'sport': '运动；体育运动',
    'sell': '卖；销售',
    'week': '星期；周',
    'right': '正确的；对的；右边',
    'hot': '热的；炎热的',
    'rainy': '下雨的；多雨的',
    'cold': '寒冷的；冷的',
    'windy': '多风的；有风的',
    'cool': '凉爽的；酷的',
    'cloudy': '多云的；阴天的',
    'warm': '温暖的；暖和的',
    'weather': '天气',
    'snowy': '下雪的；多雪的',
    'snowman': '雪人',
    'wear': '穿；戴',
    'usually': '通常；经常',
    'spring': '春天；春季',
    'summer': '夏天；夏季',
    'autumn': '秋天；秋季',
    'winter': '冬天；冬季',
    'grass': '草；草地',
    'season': '季节',
    'snow': '雪；下雪',
    'ride': '骑（马、自行车等）',
    'baby': '婴儿；幼崽',
    'bike': '自行车',
    'daytime': '白天；日间',
    'market': '市场；集市',
    'leaves': '树叶（复数）',
    'countryside': '乡村；农村',
    'cow': '奶牛；母牛',
    'pig': '猪',
    'horse': '马',
    'sheep': '绵羊（复数不变）',
    'top': '顶部；顶端',
    'hill': '小山；山丘',
    'river': '河流；河',
    'duck': '鸭子',
    'bee': '蜜蜂',
    'listen': '听；倾听',
    'sun': '太阳；阳光',
    'water': '水；浇水',
    'air': '空气',
    'lake': '湖泊；湖',
    'country': '乡村；国家',
    'badminton': '羽毛球',
    'volleyball': '排球',
    'basketball': '篮球',
    'ping-pong': '乒乓球',
    'join': '加入；参加',
    'club': '俱乐部',
    'tennis': '网球',
    'always': '总是；一直',
    'often': '经常；时常',
    'sometimes': '有时；偶尔',
    'win': '获胜；赢',
    'never': '从不；从未',
    'race': '赛跑；比赛',
    'well': '好；令人满意地',
    'kung fu': '功夫',
    'star': '明星；星星',
    'January': '一月',
    'February': '二月',
    'March': '三月',
    'April': '四月',
    'May': '五月',
    'June': '六月',
    'July': '七月',
    'August': '八月',
    'September': '九月',
    'October': '十月',
    'November': '十一月',
    'December': '十二月',
    'Monday': '星期一',
    'Tuesday': '星期二',
    'Wednesday': '星期三',
    'Thursday': '星期四',
    'Friday': '星期五',
    'Saturday': '星期六',
    'Sunday': '星期日',
    'take care of': '照顾',
    'be good at': '擅长',
    'the long jump': '跳远',
    'the high jump': '跳高',
    'come on': '加油；快点',
    'Children\'s Day': '儿童节',
    'apple': '苹果',
    'banana': '香蕉',
    'orange': '橙子',
    'pear': '梨',
    'grape': '葡萄',
    'watermelon': '西瓜',
    'strawberry': '草莓',
    'tomato': '番茄',
    'potato': '土豆',
    'carrot': '胡萝卜',
    'onion': '洋葱',
    'egg': '鸡蛋',
    'milk': '牛奶',
    'bread': '面包',
    'rice': '米饭',
    'noodle': '面条',
    'meat': '肉',
    'chicken': '鸡肉；鸡',
    'beef': '牛肉',
    'pork': '猪肉',
    'juice': '果汁',
    'tea': '茶',
    'coffee': '咖啡',
    'cake': '蛋糕',
    'cookie': '饼干',
    'ice cream': '冰淇淋',
    'school': '学校',
    'student': '学生',
    'class': '班级',
    'classroom': '教室',
    'desk': '课桌',
    'chair': '椅子',
    'book': '书',
    'pen': '钢笔',
    'pencil': '铅笔',
    'ruler': '尺子',
    'eraser': '橡皮',
    'bag': '书包',
    'homework': '家庭作业',
    'lesson': '课程',
    'test': '测验',
    'exam': '考试',
    'red': '红色',
    'blue': '蓝色',
    'green': '绿色',
    'yellow': '黄色',
    'black': '黑色',
    'white': '白色',
    'brown': '棕色',
    'purple': '紫色',
    'pink': '粉色',
    'grey': '灰色',
    'one': '一',
    'two': '二',
    'three': '三',
    'four': '四',
    'five': '五',
    'six': '六',
    'seven': '七',
    'eight': '八',
    'nine': '九',
    'ten': '十',
    'cat': '猫',
    'dog': '狗',
    'bird': '鸟',
    'rabbit': '兔子',
    'monkey': '猴子',
    'tiger': '老虎',
    'lion': '狮子',
    'elephant': '大象',
    'giraffe': '长颈鹿',
    'panda': '熊猫',
    'bear': '熊',
    'wolf': '狼',
    'fox': '狐狸',
    'deer': '鹿',
    'snake': '蛇',
    'turtle': '乌龟',
    'frog': '青蛙',
    'butterfly': '蝴蝶',
    'ant': '蚂蚁',
    'spider': '蜘蛛',
    'policeman': '警察',
    'fireman': '消防员',
    'engineer': '工程师',
    'scientist': '科学家',
    'artist': '艺术家',
    'musician': '音乐家',
    'singer': '歌手',
    'dancer': '舞者',
    'actor': '演员',
    'head': '头',
    'hair': '头发',
    'face': '脸',
    'eye': '眼睛',
    'ear': '耳朵',
    'nose': '鼻子',
    'mouth': '嘴巴',
    'tooth': '牙齿',
    'neck': '脖子',
    'shoulder': '肩膀',
    'arm': '手臂',
    'hand': '手',
    'finger': '手指',
    'leg': '腿',
    'foot': '脚',
    'knee': '膝盖',
    'toe': '脚趾',
    'run': '跑步',
    'jump': '跳跃',
    'walk': '走路',
    'swim': '游泳',
    'sing': '唱歌',
    'dance': '跳舞',
    'read': '阅读',
    'write': '写字',
    'draw': '画画',
    'paint': '涂色',
    'play': '玩耍',
    'study': '学习',
    'work': '工作',
    'sleep': '睡觉',
    'eat': '吃',
    'drink': '喝',
    'clean': '清洁',
    'wash': '洗',
    'buy': '购买',
    'help': '帮助',
    'love': '爱',
    'like': '喜欢',
    'want': '想要',
    'need': '需要',
    'think': '思考',
    'know': '知道',
    'learn': '学习',
    'teach': '教授',
    'in': '在...里面',
    'on': '在...上面',
    'under': '在...下面',
    'behind': '在...后面',
    'in front of': '在...前面',
    'between': '在...之间',
    'next to': '在...旁边',
    'above': '在...上方',
    'below': '在...下方',
    'left': '左边',
    'today': '今天',
    'yesterday': '昨天',
    'tomorrow': '明天',
    'morning': '早上',
    'afternoon': '下午',
    'evening': '晚上',
    'night': '夜晚',
    'time': '时间',
    'clock': '时钟',
    'watch': '手表',
    'hour': '小时',
    'minute': '分钟',
    'second': '秒',
    'year': '年',
    'month': '月',
    'car': '汽车',
    'bus': '公交车',
    'train': '火车',
    'bicycle': '自行车',
    'plane': '飞机',
    'ship': '轮船',
    'boat': '小船',
    'motorcycle': '摩托车',
    'taxi': '出租车',
    'subway': '地铁',
    'sunny': '晴朗的',
    'foggy': '有雾的',
    'stormy': '暴风雨的',
    'happy': '快乐的',
    'sad': '悲伤的',
    'angry': '生气的',
    'scared': '害怕的',
    'tired': '疲劳的',
    'hungry': '饥饿的',
    'thirsty': '口渴的',
    'excited': '兴奋的',
    'bored': '无聊的',
    'good morning': '早上好',
    'good afternoon': '下午好',
    'good evening': '晚上好',
    'good night': '晚安',
    'thank you': '谢谢',
    'you\'re welcome': '不客气',
    'I\'m sorry': '对不起',
    'excuse me': '打扰一下',
    'how are you': '你好吗',
    'what\'s your name': '你叫什么名字',
    'my name is': '我的名字是',
    'how old are you': '你多大了',
    'where are you from': '你来自哪里',
    'what time is it': '几点了',
    'how many': '多少',
    'how much': '多少钱',
    'what color': '什么颜色',
    'what day': '星期几',
    'can I help you': '我能帮你吗',
    'let\'s go': '我们走吧',
    'see you later': '再见',
    'see you tomorrow': '明天见'
};

// 翻译API配置
const TranslationAPI = {
    apis: [
        {
            name: 'Youdao Dictionary',
            url: (text) => `https://apii.dict.cn/mini.php?q=${encodeURIComponent(text)}`,
            parse: async (data, text) => {
                if (data && typeof data === 'string') {
                    const meaningMatch = data.match(/<b>([^<]+)<\/b>([^<]*)/);
                    if (meaningMatch) {
                        const fullMeaning = meaningMatch[2].trim();
                        const mainMeaning = fullMeaning.split('；')[0].split(';')[0].trim();
                        return mainMeaning || fullMeaning;
                    }
                }
                return '';
            }
        },
        {
            name: 'Google Translate',
            url: (text) => `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`,
            parse: (data) => {
                let translation = '';
                if (data && data[0] && Array.isArray(data[0])) {
                    data[0].forEach(item => {
                        if (item && item[0]) translation += item[0];
                    });
                }
                return translation;
            }
        },
        {
            name: 'Bing Translator (Free)',
            url: (text) => `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh-CN`,
            parse: (data) => {
                if (data && data.responseData && data.responseData.translatedText) {
                    return data.responseData.translatedText;
                }
                return '';
            }
        }
    ],
    
    async translateWithFallback(text, cache) {
        if (cache[text]) {
            return cache[text];
        }
        
        if (OptimizedMeanings[text]) {
            cache[text] = OptimizedMeanings[text];
            return OptimizedMeanings[text];
        }
        
        const isSingleWord = /^[a-zA-Z\s-]+$/.test(text) && text.split(/\s+/).length <= 2;
        
        for (let i = 0; i < this.apis.length; i++) {
            const api = this.apis[i];
            
            if (isSingleWord && api.name === 'Google Translate') {
                continue;
            }
            
            try {
                const response = await fetch(api.url(text));
                if (!response.ok) continue;
                
                const data = await (api.name === 'Youdao Dictionary' ? response.text() : response.json());
                const translation = await (api.name === 'Youdao Dictionary' ? api.parse(data, text) : api.parse(data));
                
                if (translation && translation.length > 0) {
                    cache[text] = translation;
                    return translation;
                }
            } catch (error) {
                console.warn(`${api.name} 翻译失败:`, error);
                continue;
            }
        }
        
        return '';
    }
};

/**
 * 数据管理器
 */
const DataManager = {
    defaultData: {
        currentMode: 'english',
        englishWords: [],
        englishErrors: {},
        chineseWords: [],
        chineseErrors: {},
        settings: {
            range: 'all',
            order: 'sequential',
            playCount: 2,
            intervalTime: 5,
            speechRate: 0.85,
            showMeaning: false,
            showWord: false,
            showExamples: false,
            showPinyin: false,
            inputMode: 'offline'
        }
    },
    
    save(englishWords, englishErrors, chineseWords, chineseErrors, settings, mode, englishCustomBooks, chineseCustomBooks, tombstones) {
        const t = tombstones || {};
        localStorage.setItem('dictation_english_words', JSON.stringify(englishWords));
        localStorage.setItem('dictation_english_errors', JSON.stringify(englishErrors));
        localStorage.setItem('dictation_chinese_words', JSON.stringify(chineseWords));
        localStorage.setItem('dictation_chinese_errors', JSON.stringify(chineseErrors));
        localStorage.setItem('dictation_settings', JSON.stringify(settings));
        localStorage.setItem('dictation_mode', mode);
        localStorage.setItem('dictation_english_custom_books', JSON.stringify(englishCustomBooks || {}));
        localStorage.setItem('dictation_chinese_custom_books', JSON.stringify(chineseCustomBooks || {}));
        // 删除记录（墓碑）：供跨设备同步识别"已删除"，不参与界面展示
        localStorage.setItem('dictation_english_deleted_words', JSON.stringify(t.englishDeletedWords || {}));
        localStorage.setItem('dictation_chinese_deleted_words', JSON.stringify(t.chineseDeletedWords || {}));
        localStorage.setItem('dictation_english_deleted_errors', JSON.stringify(t.englishDeletedErrors || {}));
        localStorage.setItem('dictation_chinese_deleted_errors', JSON.stringify(t.chineseDeletedErrors || {}));
    },

    load() {
        const defaultSettings = {
            range: 'all',
            order: 'sequential',
            playCount: 2,
            intervalTime: 5,
            speechRate: 0.8,
            showMeaning: false,
            showWord: false,
            showExamples: false,
            showPinyin: false,
            inputMode: 'offline'
        };
        const savedSettings = JSON.parse(localStorage.getItem('dictation_settings') || '{}');
        return {
            englishWords: JSON.parse(localStorage.getItem('dictation_english_words') || '[]'),
            englishErrors: JSON.parse(localStorage.getItem('dictation_english_errors') || '{}'),
            chineseWords: JSON.parse(localStorage.getItem('dictation_chinese_words') || '[]'),
            chineseErrors: JSON.parse(localStorage.getItem('dictation_chinese_errors') || '{}'),
            settings: { ...defaultSettings, ...savedSettings },
            mode: localStorage.getItem('dictation_mode') || 'english',
            englishCustomBooks: JSON.parse(localStorage.getItem('dictation_english_custom_books') || '{}'),
            chineseCustomBooks: JSON.parse(localStorage.getItem('dictation_chinese_custom_books') || '{}'),
            // 删除记录（墓碑）
            englishDeletedWords: JSON.parse(localStorage.getItem('dictation_english_deleted_words') || '{}'),
            chineseDeletedWords: JSON.parse(localStorage.getItem('dictation_chinese_deleted_words') || '{}'),
            englishDeletedErrors: JSON.parse(localStorage.getItem('dictation_english_deleted_errors') || '{}'),
            chineseDeletedErrors: JSON.parse(localStorage.getItem('dictation_chinese_deleted_errors') || '{}')
        };
    },
    
    exportData(words, errors, format = 'txt') {
        if (format === 'csv') {
            return { content: this.exportToCSV(words, errors), count: words.length };
        } else if (format === 'json') {
            return { content: this.exportToJSON(words, errors), count: words.length };
        } else {
            return { content: this.exportToTXT(words, errors), count: words.length };
        }
    },
    
    exportToCSV(words, errors) {
        const headers = ['单词/词语', '释义', '音标', '词性', '错误次数', '添加时间'];
        const rows = words.map(w => [
            w.word,
            w.meaning || '',
            w.pronunciation || '',
            w.partOfSpeech || '',
            errors[w.word] || 0,
            w.addedAt || ''
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        
        return '\uFEFF' + csvContent;
    },
    
    exportToJSON(words, errors) {
        const data = {
            exportDate: new Date().toISOString(),
            words: words,
            errors: errors
        };
        return JSON.stringify(data, null, 2);
    },
    
    exportToTXT(words, errors) {
        // 词库导出：每行一个单词和释义，格式为 "单词 释义"
        return words.map(w => {
            const word = w.word || '';
            const meaning = w.meaning || '';
            return meaning ? `${word} ${meaning}` : word;
        }).join('\n');
    },
    
    exportErrorBook(errors, format = 'txt', selectedWords = []) {
        // 如果有选中单词，只导出选中的；否则导出全部
        let errorList;
        if (selectedWords.length > 0) {
            const selectedSet = new Set(selectedWords.map(w => w.toLowerCase()));
            errorList = Object.entries(errors)
                .filter(([word, count]) => count > 0 && selectedSet.has(word.toLowerCase()))
                .sort((a, b) => b[1] - a[1]);
        } else {
            errorList = Object.entries(errors)
                .filter(([word, count]) => count > 0)
                .sort((a, b) => b[1] - a[1]);
        }
        
        if (errorList.length === 0) {
            return { content: '', count: 0 };
        }
        
        if (format === 'csv') {
            const headers = ['单词/词语', '错误次数'];
            const rows = errorList.map(([word, count]) => [word, count]);
            const csvContent = [headers, ...rows]
                .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
                .join('\n');
            return { content: '\uFEFF' + csvContent, count: errorList.length };
        } else if (format === 'json') {
            return { content: JSON.stringify(errorList, null, 2), count: errorList.length };
        } else {
            let content = '英语听写错词本\n';
            content += '导出时间: ' + new Date().toLocaleString() + '\n';
            content += '═'.repeat(40) + '\n\n';
            errorList.forEach(([word, count]) => {
                content += `${word} (错误 ${count} 次)\n`;
            });
            return { content, count: errorList.length };
        }
    },

    // ==================== 词条合并（按词，v2.0） ====================

    /** 词条时间基准：优先 updatedAt，其次 addedAt；返回毫秒数，无法解析则 0 */
    wordTimestamp(w) {
        if (!w) return 0;
        const raw = w.updatedAt || w.addedAt;
        if (!raw) return 0;
        const t = Date.parse(raw);
        return isNaN(t) ? 0 : t;
    },

    /** 按小写词建立索引：word -> 词条 */
    indexByWord(list) {
        const map = new Map();
        (Array.isArray(list) ? list : []).forEach(w => {
            if (w && typeof w.word === 'string' && w.word.trim()) {
                map.set(w.word.trim().toLowerCase(), w);
            }
        });
        return map;
    },

    /** 取若干词条列表中最大的数字 id（用于推算 nextId，避免新词撞 id） */
    maxWordId() {
        let max = 0;
        for (let i = 0; i < arguments.length; i++) {
            const list = arguments[i];
            (Array.isArray(list) ? list : []).forEach(w => {
                if (w && typeof w.id === 'number' && isFinite(w.id) && w.id > max) max = w.id;
            });
        }
        return max;
    },

    /** 合并两组删除记录（墓碑）：同一个词取较新的删除时间 */
    mergeTombstones(a, b) {
        const out = {};
        const put = (src) => {
            if (!src || typeof src !== 'object') return;
            Object.keys(src).forEach(k => {
                const t = src[k];
                if (typeof t !== 'string' || !t) return;
                if (!out[k] || Date.parse(t) > Date.parse(out[k])) out[k] = t;
            });
        };
        put(a);
        put(b);
        return out;
    },

    /**
     * 按「词」合并两组词条（不再按 id）。
     *  - 两边都有   → 内容取时间较新者，id 保留本地的
     *  - 云端有本地无 → 若墓碑显示已删则跳过，否则加入并分配新 id
     *  - 本地有云端无 → 保留本地；除非墓碑显示云端删除且删除时间更新
     */
    mergeWordList(localWords, remoteWords, localTomb, remoteTomb, allocId) {
        const stats = { added: 0, updated: 0, deleted: 0 };
        const remoteMap = this.indexByWord(remoteWords);
        const tomb = this.mergeTombstones(localTomb, remoteTomb);
        const out = [];
        const seen = new Set();

        (Array.isArray(localWords) ? localWords : []).forEach(lw => {
            if (!lw || typeof lw.word !== 'string') return;
            const key = lw.word.trim().toLowerCase();
            if (!key || seen.has(key)) return;
            seen.add(key);

            const rw = remoteMap.get(key);
            if (rw) {
                if (this.wordTimestamp(rw) > this.wordTimestamp(lw)) {
                    out.push(Object.assign({}, lw, rw, { id: lw.id }));
                    stats.updated++;
                } else {
                    out.push(lw);
                }
                return;
            }
            const delT = tomb[key];
            if (delT && Date.parse(delT) > this.wordTimestamp(lw)) {
                stats.deleted++;
            } else {
                out.push(lw);
            }
        });

        (Array.isArray(remoteWords) ? remoteWords : []).forEach(rw => {
            if (!rw || typeof rw.word !== 'string') return;
            const key = rw.word.trim().toLowerCase();
            if (!key || seen.has(key)) return;
            seen.add(key);

            const delT = tomb[key];
            if (delT && Date.parse(delT) > this.wordTimestamp(rw)) return;

            const copy = Object.assign({}, rw);
            copy.id = allocId();
            out.push(copy);
            stats.added++;
        });

        // 清理失效墓碑：词条已重新存在且比删除时间更新 → 墓碑作废（避免无限增长）
        const liveTomb = {};
        const outMap = this.indexByWord(out);
        Object.keys(tomb).forEach(k => {
            const w = outMap.get(k);
            if (w && this.wordTimestamp(w) > Date.parse(tomb[k])) return;
            liveTomb[k] = tomb[k];
        });

        return { words: out, tombstones: liveTomb, stats: stats };
    },

    /** 合并两组错词本：次数取较大值；墓碑中的词一律移除 */
    mergeErrorMap(localErrors, remoteErrors, localTomb, remoteTomb) {
        const tomb = this.mergeTombstones(localTomb, remoteTomb);
        const out = {};
        let removed = 0;
        const keys = new Set();
        Object.keys(localErrors || {}).forEach(k => keys.add(k));
        Object.keys(remoteErrors || {}).forEach(k => keys.add(k));
        keys.forEach(k => {
            const val = Math.max((localErrors && localErrors[k]) || 0, (remoteErrors && remoteErrors[k]) || 0);
            if (val <= 0) return;
            if (tomb[k]) { removed++; return; }
            out[k] = val;
        });
        return { errors: out, tombstones: tomb, stats: { removed: removed } };
    },

    /** 建立「名称路径 -> 节点 id」索引，用于跨设备识别同一本小词库 */
    buildPathIndex(books) {
        const index = new Map();
        if (!books || typeof books !== 'object') return index;
        const walk = (id, prefix) => {
            const node = books[id];
            if (!node) return;
            const name = node.type === 'root' ? '' : String(node.name || '');
            const path = prefix ? (prefix + '/' + name) : name;
            if (id !== 'root') index.set(path, id);
            (Array.isArray(node.children) ? node.children : []).forEach(cid => walk(cid, path));
        };
        walk('root', '');
        return index;
    },

    /**
     * 合并小词库树：按「名称路径」识别同一本词库（不按 id，两台设备各自新建的同名词库也算同一本）。
     * 保留本地节点的 id 与结构，云端独有节点会被新建进来。
     */
    mergeCustomBooks(localBooks, remoteBooks, allocNodeId) {
        const result = JSON.parse(JSON.stringify(localBooks || {}));
        if (!result.root) {
            result.root = { id: 'root', type: 'root', name: '我的词库', children: [] };
        } else if (!Array.isArray(result.root.children)) {
            result.root.children = [];
        }
        const stats = { nodes: 0, addedWords: 0, updatedWords: 0 };
        if (!remoteBooks || typeof remoteBooks !== 'object') {
            return { books: result, stats: stats };
        }

        const mergeNode = (remoteId, parentPath) => {
            const rNode = remoteBooks[remoteId];
            if (!rNode) return;
            const name = String(rNode.name || '');
            const path = parentPath ? (parentPath + '/' + name) : name;

            const index = this.buildPathIndex(result);
            let localId = index.get(path);

            if (!localId) {
                const parentLocalId = parentPath ? (index.get(parentPath) || 'root') : 'root';
                const parent = result[parentLocalId] || result.root;
                localId = allocNodeId(rNode.type);
                result[localId] = rNode.type === 'folder'
                    ? { id: localId, type: 'folder', name: rNode.name, parent: parentLocalId, children: [] }
                    : { id: localId, type: 'book', name: rNode.name, parent: parentLocalId, words: [] };
                if (!Array.isArray(parent.children)) parent.children = [];
                parent.children.push(localId);
                stats.nodes++;
            }

            const localNode = result[localId];

            if (rNode.type === 'book' && Array.isArray(rNode.words)) {
                if (!Array.isArray(localNode.words)) localNode.words = [];
                rNode.words.forEach(rw => {
                    if (!rw || typeof rw.word !== 'string' || !rw.word.trim()) return;
                    const key = rw.word.trim().toLowerCase();
                    const pos = localNode.words.findIndex(w => w && typeof w.word === 'string' && w.word.trim().toLowerCase() === key);
                    if (pos >= 0) {
                        if (this.wordTimestamp(rw) > this.wordTimestamp(localNode.words[pos])) {
                            localNode.words[pos] = Object.assign({}, localNode.words[pos], rw);
                            stats.updatedWords++;
                        }
                    } else {
                        localNode.words.push(Object.assign({}, rw));
                        stats.addedWords++;
                    }
                });
            }

            (Array.isArray(rNode.children) ? rNode.children : []).forEach(cid => mergeNode(cid, path));
        };

        const rRoot = remoteBooks.root;
        if (rRoot && Array.isArray(rRoot.children)) {
            rRoot.children.forEach(cid => mergeNode(cid, ''));
        }

        return { books: result, stats: stats };
    },

    // 备份导出（v2.0：附带删除记录，供跨设备同步使用）
    backupExport(data) {
        return JSON.stringify({
            version: '2.0',
            backupDate: new Date().toISOString(),
            english: {
                words: data.englishWords || [],
                errors: data.englishErrors || {},
                customBooks: data.englishCustomBooks || {},
                deletedWords: data.englishDeletedWords || {},
                deletedErrors: data.englishDeletedErrors || {}
            },
            chinese: {
                words: data.chineseWords || [],
                errors: data.chineseErrors || {},
                customBooks: data.chineseCustomBooks || {},
                deletedWords: data.chineseDeletedWords || {},
                deletedErrors: data.chineseDeletedErrors || {}
            }
        }, null, 2);
    },

    /**
     * 备份 / 云端数据导入。
     * merge=true → 按词合并（谁都不丢）；merge=false → 用备份数据整体替换。
     * 兼容 version 1.0（无删除记录字段）。
     * @returns 合并后的数据（含 nextId）与 stats
     */
    backupImport(backupData, existingData, options) {
        const opt = Object.assign({
            englishWords: true, englishErrors: true, englishCustomBooks: true,
            chineseWords: true, chineseErrors: true, chineseCustomBooks: true,
            merge: true
        }, options || {});

        const en = (backupData && backupData.english) || {};
        const ch = (backupData && backupData.chinese) || {};

        const result = Object.assign({}, existingData);
        const stats = {
            english: { added: 0, updated: 0, deleted: 0 },
            chinese: { added: 0, updated: 0, deleted: 0 },
            nodes: 0
        };

        const usedNodeIds = new Set(Object.keys(result.englishCustomBooks || {}).concat(Object.keys(result.chineseCustomBooks || {})));
        const usedWordIds = new Set();
        [result.englishWords, result.chineseWords, en.words, ch.words].forEach(list => {
            (Array.isArray(list) ? list : []).forEach(w => { if (w && w.id !== undefined) usedWordIds.add(w.id); });
        });
        const makeNodeId = (type) => {
            const prefix = type === 'folder' ? 'folder_' : 'book_';
            let base = Date.now();
            let id = prefix + base;
            while (usedNodeIds.has(id)) { id = prefix + (++base); }
            usedNodeIds.add(id);
            return id;
        };
        const makeWordId = () => {
            let id = this.maxWordId(result.englishWords, result.chineseWords) + 1;
            while (usedWordIds.has(id)) { id++; }
            usedWordIds.add(id);
            return id;
        };

        if (opt.englishWords) {
            if (opt.merge) {
                const r = this.mergeWordList(
                    result.englishWords || [], en.words || [],
                    result.englishDeletedWords || {}, en.deletedWords || {}, makeWordId
                );
                result.englishWords = r.words;
                result.englishDeletedWords = r.tombstones;
                stats.english = r.stats;
            } else {
                result.englishWords = (en.words || []).slice();
                result.englishDeletedWords = Object.assign({}, en.deletedWords || {});
            }
        }

        if (opt.englishErrors) {
            if (opt.merge) {
                const r = this.mergeErrorMap(
                    result.englishErrors || {}, en.errors || {},
                    result.englishDeletedErrors || {}, en.deletedErrors || {}
                );
                result.englishErrors = r.errors;
                result.englishDeletedErrors = r.tombstones;
            } else {
                result.englishErrors = Object.assign({}, en.errors || {});
                result.englishDeletedErrors = Object.assign({}, en.deletedErrors || {});
            }
        }

        if (opt.englishCustomBooks) {
            if (opt.merge) {
                const r = this.mergeCustomBooks(result.englishCustomBooks || {}, en.customBooks || {}, makeNodeId);
                result.englishCustomBooks = r.books;
                stats.nodes += r.stats.nodes;
            } else {
                result.englishCustomBooks = JSON.parse(JSON.stringify(en.customBooks || {}));
            }
        }

        if (opt.chineseWords) {
            if (opt.merge) {
                const r = this.mergeWordList(
                    result.chineseWords || [], ch.words || [],
                    result.chineseDeletedWords || {}, ch.deletedWords || {}, makeWordId
                );
                result.chineseWords = r.words;
                result.chineseDeletedWords = r.tombstones;
                stats.chinese = r.stats;
            } else {
                result.chineseWords = (ch.words || []).slice();
                result.chineseDeletedWords = Object.assign({}, ch.deletedWords || {});
            }
        }

        if (opt.chineseErrors) {
            if (opt.merge) {
                const r = this.mergeErrorMap(
                    result.chineseErrors || {}, ch.errors || {},
                    result.chineseDeletedErrors || {}, ch.deletedErrors || {}
                );
                result.chineseErrors = r.errors;
                result.chineseDeletedErrors = r.tombstones;
            } else {
                result.chineseErrors = Object.assign({}, ch.errors || {});
                result.chineseDeletedErrors = Object.assign({}, ch.deletedErrors || {});
            }
        }

        if (opt.chineseCustomBooks) {
            if (opt.merge) {
                const r = this.mergeCustomBooks(result.chineseCustomBooks || {}, ch.customBooks || {}, makeNodeId);
                result.chineseCustomBooks = r.books;
                stats.nodes += r.stats.nodes;
            } else {
                result.chineseCustomBooks = JSON.parse(JSON.stringify(ch.customBooks || {}));
            }
        }

        result.nextId = this.maxWordId(result.englishWords, result.chineseWords) + 1;
        result.stats = stats;
        return result;
    }
};

/**
 * 云同步管理器（GitHub 仓库作为云端存储）
 * - 读写走 api.github.com（已实测支持跨域 + PUT + Authorization 预检）
 * - 中文必须用 TextEncoder/TextDecoder，直接 atob 会乱码
 */
const SyncManager = {
    CONFIG_KEY: 'dictation_sync_config',
    SNAPSHOT_KEY: 'dictation_sync_snapshot',
    LAST_SYNC_KEY: 'dictation_sync_last',
    API: 'https://api.github.com',
    SIZE_LIMIT_KB: 800,

    getConfig() {
        try {
            return JSON.parse(localStorage.getItem(this.CONFIG_KEY) || '{}') || {};
        } catch (e) {
            return {};
        }
    },

    saveConfig(cfg) {
        const cur = this.getConfig();
        const next = Object.assign({}, cur, cfg || {});
        localStorage.setItem(this.CONFIG_KEY, JSON.stringify(next));
        return next;
    },

    clearConfig() {
        localStorage.removeItem(this.CONFIG_KEY);
    },

    isConfigured() {
        const c = this.getConfig();
        return !!(c.repo && c.token);
    },

    getLastSync() {
        return localStorage.getItem(this.LAST_SYNC_KEY) || '';
    },

    setLastSync(ts) {
        localStorage.setItem(this.LAST_SYNC_KEY, ts || new Date().toISOString());
    },

    filePath() {
        const c = this.getConfig();
        return c.path || 'data/words.json';
    },

    /** 从当前网址推断仓库（部署在用户名.github.io/仓库名 时可自动识别） */
    guessRepo() {
        try {
            const m = /^([^.]+)\.github\.io$/i.exec(location.hostname);
            if (m) {
                const seg = location.pathname.split('/').filter(Boolean);
                return { owner: m[1], repo: seg[0] || '' };
            }
        } catch (e) {}
        return { owner: '', repo: '' };
    },

    /** UTF-8 安全的 base64 编码 */
    encodeBase64(str) {
        if (typeof TextEncoder !== 'undefined' && typeof btoa === 'function') {
            const bytes = new TextEncoder().encode(str);
            let bin = '';
            for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
            return btoa(bin);
        }
        return Buffer.from(str, 'utf8').toString('base64');
    },

    /** UTF-8 安全的 base64 解码（必须走 TextDecoder，否则中文乱码） */
    decodeBase64(b64) {
        const clean = String(b64).replace(/[\r\n\s]/g, '');
        if (typeof TextDecoder !== 'undefined' && typeof atob === 'function') {
            const bin = atob(clean);
            const bytes = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
            return new TextDecoder('utf-8').decode(bytes);
        }
        return Buffer.from(clean, 'base64').toString('utf8');
    },

    contentUrl() {
        const c = this.getConfig();
        return this.API + '/repos/' + c.repo + '/contents/' + this.filePath();
    },

    headers() {
        const c = this.getConfig();
        return {
            'Authorization': 'Bearer ' + c.token,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json'
        };
    },

    /**
     * 读取云端数据。
     * @returns {Promise<{ok:boolean, empty?:boolean, data?:object, sha?:string|null, message?:string, code?:string}>}
     */
    async pull() {
        if (!this.isConfigured()) {
            return { ok: false, code: 'noconfig', message: '尚未配置仓库和 Token' };
        }
        try {
            const res = await fetch(this.contentUrl(), { headers: this.headers(), cache: 'no-store' });
            if (res.status === 404) return { ok: true, empty: true, data: null, sha: null };
            if (res.status === 401) return { ok: false, code: 'auth', message: 'Token 无效或已过期，请重新生成' };
            if (res.status === 403) {
                const remain = res.headers.get('X-RateLimit-Remaining');
                return {
                    ok: false, code: 'forbidden',
                    message: remain === '0' ? 'GitHub 接口调用已超限，请稍后再试' : 'Token 权限不足（需要 Contents 读写权限）'
                };
            }
            if (!res.ok) return { ok: false, code: 'http', message: '读取失败（HTTP ' + res.status + '）' };

            const json = await res.json();
            if (!json || json.encoding !== 'base64' || !json.content) {
                return { ok: false, code: 'toolarge', message: '云端文件过大或格式不支持，请改用「备份数据」手动传输' };
            }
            const text = this.decodeBase64(json.content);
            let parsed;
            try {
                parsed = JSON.parse(text);
            } catch (e) {
                return { ok: false, code: 'corrupt', message: '云端数据格式异常，已中止（未改动本地数据）' };
            }
            return { ok: true, data: parsed, sha: json.sha };
        } catch (e) {
            return { ok: false, code: 'network', message: '网络不通，稍后再试' };
        }
    },

    /**
     * 校验仓库是否可访问。
     * 必要性：GitHub 对「仓库不存在」和「文件不存在」都返回 404，
     * 只靠 pull() 无法区分，会把填错的仓库名误报成「连接成功」。
     */
    async verify() {
        if (!this.isConfigured()) {
            return { ok: false, code: 'noconfig', message: '尚未配置仓库和 Token' };
        }
        try {
            const res = await fetch(this.API + '/repos/' + this.getConfig().repo, {
                headers: this.headers(), cache: 'no-store'
            });
            if (res.status === 401) return { ok: false, code: 'auth', message: 'Token 无效或已过期，请重新生成' };
            if (res.status === 403) {
                const remain = res.headers.get('X-RateLimit-Remaining');
                return {
                    ok: false, code: 'forbidden',
                    message: remain === '0' ? 'GitHub 接口调用已超限，请稍后再试' : 'Token 权限不足（需要 Contents 读写权限）'
                };
            }
            if (res.status === 404) {
                return { ok: false, code: 'notfound', message: '仓库不存在，或 Token 无权访问该仓库，请检查用户名和仓库名' };
            }
            if (!res.ok) return { ok: false, code: 'http', message: '校验失败（HTTP ' + res.status + '）' };

            const json = await res.json();
            return { ok: true, private: !!json.private, defaultBranch: json.default_branch || 'main' };
        } catch (e) {
            return { ok: false, code: 'network', message: '网络不通，稍后再试' };
        }
    },

    /**
     * 上传数据（首次创建自动处理；版本冲突自动重试一次）。
     */
    async push(obj, sha, commitMessage) {
        if (!this.isConfigured()) {
            return { ok: false, code: 'noconfig', message: '尚未配置仓库和 Token' };
        }
        const text = JSON.stringify(obj, null, 2);
        const sizeKB = Math.round(text.length / 1024);
        if (sizeKB > this.SIZE_LIMIT_KB) {
            return {
                ok: false, code: 'toolarge',
                message: '数据约 ' + sizeKB + ' KB，接近 GitHub 接口上限。请改用「备份数据」下载文件后手动上传'
            };
        }

        const body = {
            message: commitMessage || ('同步词库 ' + new Date().toLocaleString()),
            content: this.encodeBase64(text)
        };
        if (sha) body.sha = sha;

        try {
            let res = await fetch(this.contentUrl(), {
                method: 'PUT', headers: this.headers(), body: JSON.stringify(body)
            });

            if (res.status === 409 || res.status === 422) {
                const again = await fetch(this.contentUrl(), { headers: this.headers(), cache: 'no-store' });
                if (again.ok) {
                    const j = await again.json();
                    body.sha = j.sha;
                    res = await fetch(this.contentUrl(), {
                        method: 'PUT', headers: this.headers(), body: JSON.stringify(body)
                    });
                }
            }

            if (res.status === 401) return { ok: false, code: 'auth', message: 'Token 无效或已过期，请重新生成' };
            if (res.status === 403) return { ok: false, code: 'forbidden', message: 'Token 权限不足（需要 Contents 读写权限）' };
            if (res.status === 404) return { ok: false, code: 'notfound', message: '仓库不存在或 Token 无权访问，请检查仓库名' };
            if (!res.ok) return { ok: false, code: 'http', message: '上传失败（HTTP ' + res.status + '）' };

            const json = await res.json();
            const newSha = json && json.content ? json.content.sha : null;
            return { ok: true, sha: newSha, sizeKB: sizeKB };
        } catch (e) {
            return { ok: false, code: 'network', message: '网络不通，稍后再试' };
        }
    },

    /** 同步快照（用于「撤销上次同步」） */
    takeSnapshot(jsonStr) {
        try { localStorage.setItem(this.SNAPSHOT_KEY, jsonStr); } catch (e) {}
    },

    getSnapshot() {
        return localStorage.getItem(this.SNAPSHOT_KEY);
    },

    clearSnapshot() {
        localStorage.removeItem(this.SNAPSHOT_KEY);
    }
};

window.SyncManager = SyncManager;

/**
 * 获取单词数据
 */
async function fetchWordData(word) {
    if (OptimizedMeanings[word]) {
        return {
            meaning: OptimizedMeanings[word],
            pronunciation: '',
            partOfSpeech: ''
        };
    }
    
    try {
        const youdaoUrl = `https://apii.dict.cn/mini.php?q=${encodeURIComponent(word)}`;
        const youdaoResponse = await fetch(youdaoUrl);
        if (youdaoResponse.ok) {
            const html = await youdaoResponse.text();
            const meaningMatch = html.match(/<b>([^<]+)<\/b>([^<]*)/);
            if (meaningMatch) {
                const fullMeaning = meaningMatch[2].trim();
                const mainMeaning = fullMeaning.split('；')[0].split(';')[0].trim();
                if (mainMeaning && mainMeaning.length > 0 && mainMeaning.length < 15) {
                    return {
                        meaning: mainMeaning,
                        pronunciation: '',
                        partOfSpeech: ''
                    };
                }
            }
        }
    } catch (youdaoError) {
        console.warn(`有道词典查询失败: ${word}`, youdaoError);
    }
    
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (response.ok) {
            const data = await response.json();
            if (data && data[0]) {
                const wordData = data[0];
                const meaning = wordData.meanings?.[0];
                const phonetic = wordData.phonetic || wordData.phonetics?.find(p => p.text)?.text;
                
                const simplePosMap = {
                    'noun': '名',
                    'verb': '动',
                    'adjective': '形',
                    'adverb': '副'
                };
                
                let partOfSpeech = '';
                if (meaning?.partOfSpeech) {
                    partOfSpeech = simplePosMap[meaning.partOfSpeech] || meaning.partOfSpeech.charAt(0).toUpperCase();
                }
                
                let chineseMeaning = '';
                try {
                    const translateUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|zh-CN`;
                    const translateResponse = await fetch(translateUrl);
                    if (translateResponse.ok) {
                        const translateData = await translateResponse.json();
                        if (translateData && translateData.responseData && translateData.responseData.translatedText) {
                            const translation = translateData.responseData.translatedText;
                            if (translation && translation.length > 0 && translation.length < 20 && translation !== word) {
                                chineseMeaning = translation;
                            }
                        }
                    }
                } catch (translateError) {
                    console.warn(`翻译失败: ${word}`, translateError);
                }
                
                return {
                    meaning: chineseMeaning || '',
                    pronunciation: phonetic ? `/${phonetic.replace(/[\[\]]/g, '')}/` : '',
                    partOfSpeech: partOfSpeech
                };
            }
        }
    } catch (apiError) {
        console.warn(`无法获取单词 "${word}" 的详细信息`, apiError);
    }
    
    return { 
        meaning: '', 
        pronunciation: '', 
        partOfSpeech: '' 
    };
}

// 导出模块
window.DataManager = DataManager;
window.OptimizedMeanings = OptimizedMeanings;
window.TranslationAPI = TranslationAPI;
window.fetchWordData = fetchWordData;