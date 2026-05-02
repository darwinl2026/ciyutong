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
    'see you tomorrow': '明天见',
    'watch': '看；观看',
    'read': '读；阅读',
    'write': '写；书写',
    'draw': '画；绘画',
    'sing': '唱；唱歌',
    'dance': '跳舞',
    'jump': '跳；跳跃',
    'run': '跑；跑步',
    'walk': '走；步行',
    'swim': '游泳',
    'climb': '爬；攀登',
    'ride': '骑；乘',
    'drive': '驾驶',
    'cook': '烹饪；做饭',
    'clean': '清洁；打扫',
    'wash': '洗；洗涤',
    'happy': '快乐的；幸福的',
    'sad': '悲伤的；难过的',
    'angry': '生气的',
    'tired': '疲劳的；累的',
    'hungry': '饥饿的',
    'thirsty': '口渴的',
    'full': '满的；饱的',
    'empty': '空的',
    'big': '大的',
    'small': '小的',
    'tall': '高的',
    'short': '矮的；短的',
    'long': '长的',
    'new': '新的',
    'old': '旧的；老的',
    'young': '年轻的',
    'house': '房子；房屋',
    'room': '房间',
    'kitchen': '厨房',
    'bedroom': '卧室',
    'bathroom': '浴室',
    'living room': '客厅',
    'window': '窗户',
    'door': '门',
    'floor': '地板；楼层',
    'wall': '墙',
    'table': '桌子',
    'bed': '床',
    'sofa': '沙发',
    'clock': '钟；时钟',
    'lamp': '灯',
    'rice': '米饭',
    'noodle': '面条',
    'bread': '面包',
    'cake': '蛋糕',
    'cookie': '饼干',
    'chocolate': '巧克力',
    'ice cream': '冰淇淋',
    'fruit': '水果',
    'vegetable': '蔬菜',
    'meat': '肉',
    'fish': '鱼',
    'egg': '鸡蛋',
    'milk': '牛奶',
    'water': '水',
    'juice': '果汁',
    'tea': '茶',
    'morning': '早晨；上午',
    'afternoon': '下午',
    'evening': '晚上',
    'night': '夜晚',
    'today': '今天',
    'yesterday': '昨天',
    'tomorrow': '明天',
    'weekday': '工作日',
    'weekend': '周末',
    'holiday': '假期；假日',
    'how old': '多少岁',
    'how many': '多少',
    'how much': '多少钱',
    'what time': '什么时间',
    'good morning': '早上好',
    'good afternoon': '下午好',
    'good evening': '晚上好',
    'good night': '晚安',
    'thank you': '谢谢',
    'you are welcome': '不客气',
    'excuse me': '打扰一下；对不起',
    'sorry': '对不起',
    'its ok': '没关系',
    'no problem': '没问题'
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
        englishGroups: {},
        chineseWords: [],
        chineseErrors: {},
        chineseGroups: {},
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
    },
    
    save(englishWords, englishErrors, englishGroups, chineseWords, chineseErrors, chineseGroups, settings, mode, englishCustomBooks, chineseCustomBooks) {
        localStorage.setItem('dictation_english_words', JSON.stringify(englishWords));
        localStorage.setItem('dictation_english_errors', JSON.stringify(englishErrors));
        localStorage.setItem('dictation_english_groups', JSON.stringify(englishGroups));
        localStorage.setItem('dictation_chinese_words', JSON.stringify(chineseWords));
        localStorage.setItem('dictation_chinese_errors', JSON.stringify(chineseErrors));
        localStorage.setItem('dictation_chinese_groups', JSON.stringify(chineseGroups));
        localStorage.setItem('dictation_settings', JSON.stringify(settings));
        localStorage.setItem('dictation_mode', mode);
        localStorage.setItem('dictation_english_custom_books', JSON.stringify(englishCustomBooks || {}));
        localStorage.setItem('dictation_chinese_custom_books', JSON.stringify(chineseCustomBooks || {}));
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
            inputMode: 'offline'
        };
        const savedSettings = JSON.parse(localStorage.getItem('dictation_settings') || '{}');
        return {
            englishWords: JSON.parse(localStorage.getItem('dictation_english_words') || '[]'),
            englishErrors: JSON.parse(localStorage.getItem('dictation_english_errors') || '{}'),
            englishGroups: JSON.parse(localStorage.getItem('dictation_english_groups') || '{}'),
            chineseWords: JSON.parse(localStorage.getItem('dictation_chinese_words') || '[]'),
            chineseErrors: JSON.parse(localStorage.getItem('dictation_chinese_errors') || '{}'),
            chineseGroups: JSON.parse(localStorage.getItem('dictation_chinese_groups') || '{}'),
            settings: { ...defaultSettings, ...savedSettings },
            mode: localStorage.getItem('dictation_mode') || 'english',
            englishCustomBooks: JSON.parse(localStorage.getItem('dictation_english_custom_books') || '{}'),
            chineseCustomBooks: JSON.parse(localStorage.getItem('dictation_chinese_custom_books') || '{}')
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
        // 词库导出：每行一个单词，按默认顺序
        return words.map(w => w.word).join('\n');
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

    // 备份导出（可选择包含哪些数据）
    backupExport(data) {
        return JSON.stringify({
            version: '1.0',
            backupDate: new Date().toISOString(),
            english: {
                words: data.englishWords || [],
                errors: data.englishErrors || {},
                customBooks: data.englishCustomBooks || {}
            },
            chinese: {
                words: data.chineseWords || [],
                errors: data.chineseErrors || {},
                customBooks: data.chineseCustomBooks || {}
            }
        }, null, 2);
    },

    // 备份导入（合并模式，返回合并后的数据）
    backupImport(backupData, existingData, options = {}) {
        const {
            englishWords = true,
            englishErrors = true,
            englishCustomBooks = true,
            chineseWords = true,
            chineseErrors = true,
            chineseCustomBooks = true,
            merge = true  // true=合并，false=替换
        } = options;

        const result = { ...existingData };

        if (englishWords) {
            if (merge) {
                // 合并：按id去重，保留新数据
                const existingIds = new Set((result.englishWords || []).map(w => w.id));
                const newWords = (backupData.english?.words || []).filter(w => !existingIds.has(w.id));
                result.englishWords = [...(result.englishWords || []), ...newWords];
            } else {
                result.englishWords = backupData.english?.words || [];
            }
        }

        if (englishErrors) {
            if (merge) {
                // 合并：错误次数取较大值
                const backupErrors = backupData.english?.errors || {};
                result.englishErrors = result.englishErrors || {};
                for (const [word, count] of Object.entries(backupErrors)) {
                    result.englishErrors[word] = Math.max(result.englishErrors[word] || 0, count);
                }
            } else {
                result.englishErrors = backupData.english?.errors || {};
            }
        }

        if (englishCustomBooks) {
            if (merge) {
                // 合并：按bookId合并，相同id的词库追加单词
                result.englishCustomBooks = result.englishCustomBooks || {};
                const backupBooks = backupData.english?.customBooks || {};
                for (const [bookId, book] of Object.entries(backupBooks)) {
                    if (result.englishCustomBooks[bookId]) {
                        // 已有词库，追加新单词（去重）
                        const existingWords = new Set(result.englishCustomBooks[bookId].words.map(w => w.word.toLowerCase()));
                        const newWords = (book.words || []).filter(w => !existingWords.has(w.word.toLowerCase()));
                        result.englishCustomBooks[bookId].words.push(...newWords);
                    } else {
                        // 新词库，直接添加
                        result.englishCustomBooks[bookId] = book;
                    }
                }
            } else {
                result.englishCustomBooks = backupData.english?.customBooks || {};
            }
        }

        if (chineseWords) {
            if (merge) {
                const existingIds = new Set((result.chineseWords || []).map(w => w.id));
                const newWords = (backupData.chinese?.words || []).filter(w => !existingIds.has(w.id));
                result.chineseWords = [...(result.chineseWords || []), ...newWords];
            } else {
                result.chineseWords = backupData.chinese?.words || [];
            }
        }

        if (chineseErrors) {
            if (merge) {
                const backupErrors = backupData.chinese?.errors || {};
                result.chineseErrors = result.chineseErrors || {};
                for (const [word, count] of Object.entries(backupErrors)) {
                    result.chineseErrors[word] = Math.max(result.chineseErrors[word] || 0, count);
                }
            } else {
                result.chineseErrors = backupData.chinese?.errors || {};
            }
        }

        if (chineseCustomBooks) {
            if (merge) {
                result.chineseCustomBooks = result.chineseCustomBooks || {};
                const backupBooks = backupData.chinese?.customBooks || {};
                for (const [bookId, book] of Object.entries(backupBooks)) {
                    if (result.chineseCustomBooks[bookId]) {
                        const existingWords = new Set(result.chineseCustomBooks[bookId].words.map(w => w.word.toLowerCase()));
                        const newWords = (book.words || []).filter(w => !existingWords.has(w.word.toLowerCase()));
                        result.chineseCustomBooks[bookId].words.push(...newWords);
                    } else {
                        result.chineseCustomBooks[bookId] = book;
                    }
                }
            } else {
                result.chineseCustomBooks = backupData.chinese?.customBooks || {};
            }
        }

        return result;
    }
};

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