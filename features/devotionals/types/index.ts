export type Devotional = {
  slug: string;
  title: string;
  date: string;
  scripture: { ref: string; text: string };
  body: string[];
  prayer: string;
};

export type DevotionalRecord = Devotional & { published: boolean; updatedAt: string };
