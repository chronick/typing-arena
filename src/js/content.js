// TypeRacer Arena - Content Library

export const CATEGORIES = [
  {
    id: 'classics',
    name: 'Literary Classics',
    icon: '📚',
    unlockLevel: 1,
    description: 'Famous works of literature'
  },
  {
    id: 'poetry',
    name: 'Poetry',
    icon: '🎭',
    unlockLevel: 3,
    description: 'Classic poems and verses'
  },
  {
    id: 'code',
    name: 'Code',
    icon: '💻',
    unlockLevel: 5,
    description: 'Famous algorithms and snippets'
  },
  {
    id: 'random',
    name: 'Random Words',
    icon: '🎲',
    unlockLevel: 8,
    description: 'Random word combinations'
  },
  {
    id: 'humor',
    name: 'Humor',
    icon: '😂',
    unlockLevel: 12,
    description: 'Funny phrases and tongue twisters'
  },
  {
    id: 'modern',
    name: 'Modern',
    icon: '🌐',
    unlockLevel: 15,
    description: 'Contemporary prose'
  }
];

// Content organized by category and difficulty
const CONTENT = {
  classics: {
    easy: [
      { text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.", source: "Pride and Prejudice - Jane Austen" },
      { text: "Call me Ishmael. Some years ago, having little or no money in my purse, I thought I would sail about a little and see the watery part of the world.", source: "Moby Dick - Herman Melville" },
      { text: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.", source: "A Tale of Two Cities - Charles Dickens" },
      { text: "All happy families are alike; each unhappy family is unhappy in its own way.", source: "Anna Karenina - Leo Tolstoy" },
      { text: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.", source: "The Great Gatsby - F. Scott Fitzgerald" },
      { text: "It was a bright cold day in April, and the clocks were striking thirteen.", source: "1984 - George Orwell" }
    ],
    medium: [
      { text: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness.", source: "A Tale of Two Cities - Charles Dickens" },
      { text: "Whether I shall turn out to be the hero of my own life, or whether that station will be held by anybody else, these pages must show. To begin my life with the beginning of my life, I record that I was born.", source: "David Copperfield - Charles Dickens" },
      { text: "Two households, both alike in dignity, in fair Verona, where we lay our scene, from ancient grudge break to new mutiny, where civil blood makes civil hands unclean.", source: "Romeo and Juliet - William Shakespeare" },
      { text: "Mr. and Mrs. Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much. They were the last people you'd expect to be involved in anything strange or mysterious.", source: "Harry Potter - J.K. Rowling" }
    ],
    hard: [
      { text: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way.", source: "A Tale of Two Cities - Charles Dickens" },
      { text: "You don't know about me without you have read a book by the name of The Adventures of Tom Sawyer; but that ain't no matter. That book was made by Mr. Mark Twain, and he told the truth, mainly. There was things which he stretched, but mainly he told the truth. That is nothing. I never seen anybody but lied one time or another.", source: "Adventures of Huckleberry Finn - Mark Twain" }
    ],
    expert: [
      { text: "Stately, plump Buck Mulligan came from the stairhead, bearing a bowl of lather on which a mirror and a razor lay crossed. A yellow dressinggown, ungirdled, was sustained gently behind him on the mild morning air. He held the bowl aloft and intoned: Introibo ad altare Dei. Halted, he peered down the dark winding stairs and called out coarsely: Come up, Kinch! Come up, you fearful jesuit!", source: "Ulysses - James Joyce" },
      { text: "In the late summer of that year we lived in a house in a village that looked across the river and the plain to the mountains. In the bed of the river there were pebbles and boulders, dry and white in the sun, and the water was clear and swiftly moving and blue in the channels. Troops went by the house and down the road and the dust they raised powdered the leaves of the trees.", source: "A Farewell to Arms - Ernest Hemingway" }
    ]
  },
  poetry: {
    easy: [
      { text: "Two roads diverged in a yellow wood, and sorry I could not travel both and be one traveler, long I stood.", source: "The Road Not Taken - Robert Frost" },
      { text: "I wandered lonely as a cloud that floats on high over vales and hills.", source: "Daffodils - William Wordsworth" },
      { text: "Shall I compare thee to a summer's day? Thou art more lovely and more temperate.", source: "Sonnet 18 - William Shakespeare" },
      { text: "Hope is the thing with feathers that perches in the soul, and sings the tune without the words, and never stops at all.", source: "Hope - Emily Dickinson" },
      { text: "Do not go gentle into that good night. Rage, rage against the dying of the light.", source: "Do Not Go Gentle - Dylan Thomas" }
    ],
    medium: [
      { text: "Once upon a midnight dreary, while I pondered, weak and weary, over many a quaint and curious volume of forgotten lore, while I nodded, nearly napping, suddenly there came a tapping, as of someone gently rapping, rapping at my chamber door.", source: "The Raven - Edgar Allan Poe" },
      { text: "If you can keep your head when all about you are losing theirs and blaming it on you, if you can trust yourself when all men doubt you, but make allowance for their doubting too.", source: "If - Rudyard Kipling" },
      { text: "I celebrate myself, and sing myself, and what I assume you shall assume, for every atom belonging to me as good belongs to you. I loaf and invite my soul, I lean and loaf at my ease observing a spear of summer grass.", source: "Song of Myself - Walt Whitman" }
    ],
    hard: [
      { text: "Once upon a midnight dreary, while I pondered, weak and weary, over many a quaint and curious volume of forgotten lore, while I nodded, nearly napping, suddenly there came a tapping, as of someone gently rapping, rapping at my chamber door. 'Tis some visitor,' I muttered, 'tapping at my chamber door; only this, and nothing more.'", source: "The Raven - Edgar Allan Poe" },
      { text: "Tyger Tyger, burning bright, in the forests of the night; what immortal hand or eye, could frame thy fearful symmetry? In what distant deeps or skies, burnt the fire of thine eyes? On what wings dare he aspire? What the hand, dare seize the fire?", source: "The Tyger - William Blake" }
    ],
    expert: [
      { text: "I met a traveller from an antique land, who said: Two vast and trunkless legs of stone stand in the desert. Near them, on the sand, half sunk a shattered visage lies, whose frown, and wrinkled lip, and sneer of cold command, tell that its sculptor well those passions read which yet survive, stamped on these lifeless things.", source: "Ozymandias - Percy Bysshe Shelley" }
    ]
  },
  code: {
    easy: [
      { text: "function hello() { console.log('Hello, World!'); } hello();", source: "Hello World - JavaScript" },
      { text: "for i in range(10): print(i)", source: "Loop - Python" },
      { text: "const sum = (a, b) => a + b; console.log(sum(2, 3));", source: "Arrow Function - JavaScript" },
      { text: "if x > 10: print('big') else: print('small')", source: "Conditional - Python" },
      { text: "let arr = [1, 2, 3]; arr.map(x => x * 2);", source: "Map - JavaScript" }
    ],
    medium: [
      { text: "function fizzbuzz(n) { for (let i = 1; i <= n; i++) { if (i % 15 === 0) console.log('FizzBuzz'); else if (i % 3 === 0) console.log('Fizz'); else if (i % 5 === 0) console.log('Buzz'); else console.log(i); } }", source: "FizzBuzz - JavaScript" },
      { text: "def fibonacci(n): if n <= 1: return n; return fibonacci(n-1) + fibonacci(n-2)", source: "Fibonacci - Python" },
      { text: "const binarySearch = (arr, target) => { let left = 0, right = arr.length - 1; while (left <= right) { const mid = Math.floor((left + right) / 2); if (arr[mid] === target) return mid; if (arr[mid] < target) left = mid + 1; else right = mid - 1; } return -1; }", source: "Binary Search - JavaScript" }
    ],
    hard: [
      { text: "function quickSort(arr) { if (arr.length <= 1) return arr; const pivot = arr[Math.floor(arr.length / 2)]; const left = arr.filter(x => x < pivot); const middle = arr.filter(x => x === pivot); const right = arr.filter(x => x > pivot); return [...quickSort(left), ...middle, ...quickSort(right)]; }", source: "QuickSort - JavaScript" },
      { text: "def merge_sort(arr): if len(arr) <= 1: return arr; mid = len(arr) // 2; left = merge_sort(arr[:mid]); right = merge_sort(arr[mid:]); return merge(left, right)", source: "Merge Sort - Python" }
    ],
    expert: [
      { text: "const debounce = (fn, delay) => { let timeoutId; return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => fn.apply(this, args), delay); }; }; const debouncedSearch = debounce((query) => fetch(`/api/search?q=${query}`), 300);", source: "Debounce Pattern - JavaScript" },
      { text: "class LRUCache { constructor(capacity) { this.capacity = capacity; this.cache = new Map(); } get(key) { if (!this.cache.has(key)) return -1; const value = this.cache.get(key); this.cache.delete(key); this.cache.set(key, value); return value; } put(key, value) { this.cache.delete(key); this.cache.set(key, value); if (this.cache.size > this.capacity) { this.cache.delete(this.cache.keys().next().value); } } }", source: "LRU Cache - JavaScript" }
    ]
  },
  random: {
    easy: [
      { text: "apple banana cherry grape orange lemon mango peach plum strawberry" },
      { text: "red blue green yellow purple orange pink brown black white" },
      { text: "cat dog bird fish turtle rabbit hamster mouse snake frog" },
      { text: "happy sad angry calm excited nervous tired hungry thirsty sleepy" },
      { text: "run jump walk skip hop crawl swim fly climb dance" }
    ],
    medium: [
      { text: "the quick brown fox jumps over the lazy dog near the riverbank while watching sunset" },
      { text: "sphinx of black quartz judge my vow wisely ancient mysteries unfold" },
      { text: "pack my box with five dozen liquor jugs carefully before the journey begins tomorrow" },
      { text: "amazingly few discotheques provide jukeboxes with quality vinyl exceptional sound systems" }
    ],
    hard: [
      { text: "cryptographic algorithms fundamentally revolutionize cybersecurity infrastructure methodologies systematically" },
      { text: "electromagnetic wavelengths propagate through atmospheric conditions unpredictably affecting communications" },
      { text: "pharmaceutical biotechnology synthesizes revolutionary compounds therapeutically treating conditions" }
    ],
    expert: [
      { text: "pneumonoultramicroscopicsilicovolcanoconiosis antidisestablishmentarianism floccinaucinihilipilification" },
      { text: "psychophysicotherapeutics electroencephalographically uncharacteristically disproportionately" }
    ]
  },
  humor: {
    easy: [
      { text: "Why don't scientists trust atoms? Because they make up everything!", source: "Classic joke" },
      { text: "I told my wife she was drawing her eyebrows too high. She looked surprised.", source: "Classic joke" },
      { text: "I'm reading a book about anti-gravity. It's impossible to put down!", source: "Classic joke" },
      { text: "Why did the scarecrow win an award? He was outstanding in his field!", source: "Classic joke" },
      { text: "I used to hate facial hair, but then it grew on me.", source: "Classic joke" }
    ],
    medium: [
      { text: "She sells seashells by the seashore. The shells she sells are seashells, I'm sure.", source: "Tongue Twister" },
      { text: "Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked.", source: "Tongue Twister" },
      { text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?", source: "Tongue Twister" },
      { text: "The sixth sick sheikh's sixth sheep's sick. This is supposedly the hardest tongue twister.", source: "Tongue Twister" }
    ],
    hard: [
      { text: "I'm not saying I'm Batman, I'm just saying no one has ever seen me and Batman in the same room together. Make of that what you will. The evidence speaks for itself.", source: "Internet humor" },
      { text: "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway.", source: "Bee Movie" }
    ],
    expert: [
      { text: "Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo. This is a grammatically correct sentence using buffalo as noun, verb, and proper noun simultaneously, demonstrating English language quirks.", source: "Linguistic oddity" },
      { text: "James while John had had had had had had had had had had had a better effect on the teacher. This sentence uses proper punctuation and is grammatically correct when properly punctuated.", source: "Linguistic oddity" }
    ]
  },
  modern: {
    easy: [
      { text: "Breaking news: Scientists discover that coffee is indeed essential for human survival.", source: "Satirical headline" },
      { text: "The internet has revolutionized how we communicate, work, and procrastinate.", source: "Tech blog" },
      { text: "Machine learning algorithms are transforming industries from healthcare to entertainment.", source: "Tech news" }
    ],
    medium: [
      { text: "Artificial intelligence continues to push boundaries in natural language processing, enabling machines to understand and generate human-like text with increasing accuracy.", source: "Tech article" },
      { text: "Climate change remains the defining challenge of our generation, requiring unprecedented cooperation between nations, industries, and individuals worldwide.", source: "News article" },
      { text: "The gig economy has fundamentally altered traditional employment relationships, offering flexibility while raising questions about worker protections and benefits.", source: "Business article" }
    ],
    hard: [
      { text: "Quantum computing represents a paradigm shift in computational capability, leveraging quantum mechanical phenomena such as superposition and entanglement to process information in ways classical computers cannot match.", source: "Science article" },
      { text: "Blockchain technology extends far beyond cryptocurrency, offering decentralized solutions for supply chain management, digital identity verification, and smart contract execution across industries.", source: "Tech analysis" }
    ],
    expert: [
      { text: "The intersection of artificial general intelligence research, quantum computing advancements, and biotechnological breakthroughs suggests we may be approaching a technological singularity, though experts remain divided on timelines and implications for human society.", source: "Futurism article" }
    ]
  }
};

// Common words for random generation
const COMMON_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also'
];

// Generate random word sequence
function generateRandomWords(count) {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]);
  }
  return words.join(' ');
}

// Get text for a specific category and difficulty
export function getText(categoryId, difficulty) {
  const categoryContent = CONTENT[categoryId];
  if (!categoryContent) {
    console.warn(`Category ${categoryId} not found`);
    return { text: generateRandomWords(20), source: 'Random words' };
  }

  const difficultyContent = categoryContent[difficulty] || categoryContent.easy;
  if (!difficultyContent || difficultyContent.length === 0) {
    console.warn(`No content for ${categoryId}/${difficulty}`);
    return { text: generateRandomWords(20), source: 'Random words' };
  }

  const item = difficultyContent[Math.floor(Math.random() * difficultyContent.length)];
  return {
    text: item.text,
    source: item.source || categoryId
  };
}

// Get random text from any unlocked category
export function getRandomText(unlockedCategories, difficulty = 'medium') {
  if (!unlockedCategories || unlockedCategories.length === 0) {
    return getText('classics', difficulty);
  }

  const category = unlockedCategories[Math.floor(Math.random() * unlockedCategories.length)];
  return getText(category, difficulty);
}

// Get category by ID
export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id);
}
