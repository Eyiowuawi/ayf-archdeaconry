// Starter devotionals. Once a database is connected, devotionals are managed in the admin area
// (/admin); this list seeds it and is the fallback when no database is connected.
// Add a new one by copying an entry; `body` is a list of paragraphs.
// Scripture quotations are from the King James Version (public domain).

export type Devotional = {
  slug: string;
  title: string;
  date: string;
  scripture: { ref: string; text: string };
  body: string[];
  prayer: string;
};

export const DEVOTIONALS: Devotional[] = [
  {
    slug: "let-no-man-despise-thy-youth",
    title: "Let no man despise thy youth",
    date: "2026-10-12",
    scripture: {
      ref: "1 Timothy 4:12",
      text: "Let no man despise thy youth; but be thou an example of the believers, in word, in conversation, in charity, in spirit, in faith, in purity.",
    },
    body: [
      "Timothy was a young pastor leading people older than himself. Paul did not tell him to wait until he was older to matter. He told him to be an example now.",
      "Your age is not a waiting room. The way you speak to your parents, the way you treat a classmate nobody likes, the honesty you keep when no one is checking: these are already ministry.",
      "This week, pick one of Paul's six areas (word, conduct, love, spirit, faith or purity) and ask God to help you grow in it on purpose.",
    ],
    prayer:
      "Lord, thank You that You can use me today, not someday. Make my words, my actions and my heart an example that points others to You. Amen.",
  },
  {
    slug: "remember-thy-creator",
    title: "Remember thy Creator",
    date: "2026-10-05",
    scripture: {
      ref: "Ecclesiastes 12:1",
      text: "Remember now thy Creator in the days of thy youth, while the evil days come not, nor the years draw nigh, when thou shalt say, I have no pleasure in them.",
    },
    body: [
      "Youth is full of plans: exams, admission, a first job, a business idea. Solomon does not say plans are wrong. He says the most important thing to settle early is who you belong to.",
      "Habits formed now tend to last. A daily moment of prayer, reading a chapter of Scripture, showing up for fellowship: small things done young become strong foundations later.",
    ],
    prayer:
      "Father, in all my plans, let me remember You first. Help me build habits now that will keep me close to You for life. Amen.",
  },
  {
    slug: "cleanse-his-way",
    title: "How shall a young man cleanse his way?",
    date: "2026-09-28",
    scripture: {
      ref: "Psalm 119:9",
      text: "Wherewithal shall a young man cleanse his way? by taking heed thereto according to thy word.",
    },
    body: [
      "The psalmist asks a question every young person faces: how do I stay on the right path when so much pulls the other way?",
      "His answer is simple and practical. Pay attention to your life, and measure it by God's word. Not by trends, not by what friends say, not only by feelings.",
      "Try reading Psalm 119 slowly this week, a few verses a day, and note one instruction you can live out.",
    ],
    prayer:
      "Lord, Your word is a lamp to my feet. Keep my way clean and help me take heed to what You say. Amen.",
  },
];

export function sortedDevotionals(list: Devotional[] = DEVOTIONALS): Devotional[] {
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

export function getDevotional(slug: string): Devotional | undefined {
  return DEVOTIONALS.find((d) => d.slug === slug);
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatLongDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
