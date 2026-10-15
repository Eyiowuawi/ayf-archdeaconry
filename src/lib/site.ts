// Fellowship-wide facts used across the site. Edit here, not in the pages.

export const SITE = {
  name: "Anglican Youth Fellowship",
  diocese: "Egba Diocese",
  tagline: "Building a generation of young Anglicans rooted in Christ and equipped for impact.",
  motto: "Towards the perfect man",
  mottoRef: "Ephesians 4:13",
};

export const PILLARS = [
  { title: "Doctrines", label: "Biblically grounded", text: "Scriptural study that anchors young people in the Word and the faith of the Church." },
  { title: "Missions", label: "Purpose driven", text: "Outreach, rural crusades and service that carry the gospel beyond our walls." },
  { title: "Fellowship", label: "United community", text: "Friendships that span parishes and archdeaconries, built on Christ." },
];

export const BISHOP = {
  name: "The Rt. Rev'd Dr. Emmanuel O. Adekunle",
  role: "Lord Bishop of Egba and Patron, AYF Egba Diocese",
  title: "Stand victorious and anchored",
  charge: [
    "This convention is an altar of fire. Come expectant.",
    "You are not the church of tomorrow. You are the active, vibrant church of today.",
  ],
};

export const ABOUT = {
  intro:
    "AYF Egba Diocese is a branch of the Anglican Youth Fellowship of Nigeria, under the Lord Bishop of Egba. We serve secondary school students, undergraduates, craft apprentices, young professionals and parish youth leaders.",
  roots:
    "Our roots go back more than three decades to the Cathedral of St. Peter, Ake, Abeokuta, the birthplace of Christianity in Nigeria.",
  vision: "An exceptional youth movement raising consecrated disciples who transform their workplaces and churches.",
  mission: "Mobilising young people's gifts through scripture quizzes, spiritual camps, leadership courses and rural social crusades.",
  call: "Raising Christ-centred leaders who represent theological excellence, integrity and proactive neighbourhood impact.",
};

export const VALUES = [
  { title: "Faith", text: "Anchored in the Word, with Jesus Christ as our cornerstone." },
  { title: "Fellowship", text: "Lasting friendships across parishes and archdeaconries." },
  { title: "Leadership", text: "Growing spiritual, administrative and technological capacity." },
  { title: "Service", text: "Volunteering in parish churches and rural mission stations." },
  { title: "Excellence", text: "Quality in career, scholarship, liturgy and character." },
  { title: "Integrity", text: "Transparency, accountability and biblical values." },
];

/** Headline numbers. Parish and archdeaconry counts come from lib/parishes.ts. */
export const NUMBERS = [
  { value: 5400, suffix: "+", label: "Youth members" },
  { value: 15, suffix: "", label: "Programmes a year" },
  { value: 8, suffix: "", label: "Missions & outreaches a year" },
];

export const HUBS = [
  {
    title: "Join a department",
    text: "Serve with your gifts in Bible Study, Evangelism & Outreach, Publicity & Media, or the Youth Choir.",
    href: "/register",
    cta: "Join the fellowship",
  },
  {
    title: "Resources",
    text: "Bible study templates, the youth leadership constitution, devotionals and convention lyric books.",
    href: "/devotionals",
    cta: "Read devotionals",
  },
  {
    title: "Counselling & enquiries",
    text: "Speak to the Secretariat for guidance, counselling, or archdeaconry travel arrangements.",
    href: "/contact",
    cta: "Contact us",
  },
];

// TODO before launch: confirm these with the Diocesan Secretariat. The phone numbers from the
// earlier site look like placeholders, so they stay hidden until `phonesConfirmed` is true.
export const CONTACT = {
  office: "Diocesan Secretariat",
  address: "Anglican Diocesan Headquarters, Bishop's Court Ground, Onikolobo, Abeokuta, Ogun State",
  email: "info@ayfegbadiocese.org",
  phones: ["+234 803 234 5678", "+234 812 345 6789"],
  phonesConfirmed: false,
  hours: [
    { days: "Monday to Friday", time: "9:00am – 4:00pm" },
    { days: "Weekends", time: "Emergency chaplain calls only" },
  ],
  handles: "Branch enquiries, hostel allocations and spiritual counselling.",
};
