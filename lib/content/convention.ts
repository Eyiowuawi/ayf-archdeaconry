// Annual Diocesan Youth Convention. Update this file each year.
//
// Dates: the earlier site gave 3–6 September 2026 (and "Thu 27th – Sun 30th" in one place).
// Leave `startDate` null to show "dates to be announced"; set ISO dates (YYYY-MM-DD) to turn on
// the countdown and the day labels in the programme.

export type Speaker = { name: string; initials: string; role: string; session: string; sessionType: string };
export type Session = { time: string; title: string; note?: string };
export type ProgrammeDay = { day: string; sessions: Session[] };

export const CONVENTION = {
  edition: "42nd Annual Diocesan Youth Convention",
  shortName: "Convention 2026",
  theme: "If God be for us",
  themeRef: "Romans 8:31",
  themeText: "If God be for us, who can be against us?",
  themeBlurb:
    "Anglican youths stand victorious through Christ, whatever the pressure: financial hardship, moral compromise or the anxieties of modern life.",
  startDate: null as string | null, // e.g. "2027-09-02"
  endDate: null as string | null,
  datesLabel: "Dates to be announced",
  city: "Abeokuta",
  venue: "Venue to be confirmed",
  registrationOpen: true,
  fee: 5000,
  feeCovers: [
    "Entry to every session, plus materials",
    "Shared hostel lodging (mattresses first come, first served)",
    "Breakfast, lunch and dinner each day",
    "A welcome pack",
  ],
  buses:
    "Free archdeaconry buses leave on the first morning from Owode, Ifo, Odeda and Itori. Book a seat through your archdeaconry youth president.",
  bring: [
    "Bible and hymn book",
    "Toiletries",
    "Modest clothing",
    "Bedspread and towels",
    "Any prescribed medicines",
    "Parish fellowship vest or a white shirt for the thanksgiving service",
  ],
  guests: "Christian youths from other denominations are welcome to register as guest delegates.",
  security: "Police, diocesan marshals and youth vigilante groups provide security around the clock.",
  pavilion:
    "Keynotes, devotions, night services and the choral cantata hold in the Main Convention Pavilion. Please be seated 15 minutes early.",
};

// TODO before launch: confirm the account with the Diocesan treasurer. Until
// `confirmed` is true the site says payment details are "coming soon" instead of showing them.
export const PAYMENT = {
  bank: "Zenith Bank",
  accountNumber: "1222677829",
  accountName: "Anglican Youth Fellowship Egba Diocese",
  confirmed: false,
};

export const SPEAKERS: Speaker[] = [
  {
    name: "The Rt. Rev'd Dr. Emmanuel O. Adekunle",
    initials: "EA",
    role: "Diocesan Bishop, Chief Host",
    sessionType: "Host message",
    session: "Character & resilience for Kingdom service",
  },
  {
    name: "Rev. Senu Afolayan",
    initials: "SA",
    role: "Guest speaker, revivalist",
    sessionType: "Keynote",
    session: "Igniting the fire of unshakable faith",
  },
  {
    name: "Pastor (Mrs.) Nike Adeyemi",
    initials: "NA",
    role: "Guest speaker, youth counsellor",
    sessionType: "Plenary",
    session: "Navigating mental health and relationships",
  },
  {
    name: "Dr. Leke Oluwole",
    initials: "LO",
    role: "Tech entrepreneur, AYF Egba alumnus",
    sessionType: "Workshop",
    session: "Digital wealth & innovation in church networks",
  },
];

export const PROGRAMME: ProgrammeDay[] = [
  {
    day: "Thursday",
    sessions: [
      { time: "12:00 – 16:00", title: "Arrival, check-in & security screening" },
      { time: "16:00 – 17:30", title: "Orientation & ice-breakers" },
      { time: "18:00 – 20:30", title: "Opening Holy Communion & charge", note: "Rev. Senu Afolayan" },
    ],
  },
  {
    day: "Friday",
    sessions: [
      { time: "06:00 – 07:30", title: "Morning praise & devotion" },
      { time: "09:00 – 11:30", title: "Bible exposition: the theme" },
      { time: "12:00 – 14:00", title: "Youth empowerment workshops" },
      { time: "16:00 – 18:00", title: "Archdeaconry sports & competitions" },
      { time: "19:00 – 21:30", title: "Evening revival session" },
    ],
  },
  {
    day: "Saturday",
    sessions: [
      { time: "06:00 – 07:30", title: "National AYF prayer watch" },
      { time: "09:00 – 12:00", title: "Relationships, marriage & life skills plenary" },
      { time: "13:00 – 15:00", title: "AYF Egba annual business meeting" },
      { time: "18:00 – 22:00", title: "Praise banquet & drama" },
    ],
  },
  {
    day: "Sunday",
    sessions: [
      { time: "07:00 – 08:30", title: "Camp packing & cleaning" },
      { time: "09:00 – 12:30", title: "Grand Thanksgiving Communion & commissioning" },
    ],
  },
];

export const REGISTRATION_STEPS = [
  { title: "Pay the fee", text: "Transfer ₦5,000 to the fellowship account and keep your transfer reference." },
  { title: "Fill the form", text: "Your details, archdeaconry, parish, a passport photo and the transfer reference." },
  { title: "Upload proof", text: "Attach your payment receipt (PNG, JPG or PDF, up to 4 MB) and submit." },
  { title: "Get your ticket", text: "After the audit your status turns Approved and your EGBA delegate ticket is issued." },
];

export function formatNaira(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}
