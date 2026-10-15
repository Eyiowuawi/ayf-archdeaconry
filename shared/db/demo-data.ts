import { EVENTS } from "@/features/events/data/starter-events";
import type { EventRecord } from "@/features/events/types";
import type { EducationLevel, RegistrationStatus } from "@/features/members/types";

// Sample data for the demo account and local testing. Names are obviously fake; nothing here
// is a real member.

function day(offset: number): string {
  const d = new Date(Date.now() + offset * 86_400_000);
  return d.toISOString().slice(0, 10);
}

/** The starter events, plus registration set up on two of them so the whole flow can be tried. */
export function demoEvents(): Omit<EventRecord, "updatedAt">[] {
  const workshopDay = day(10);
  const campStart = day(30);
  return [
    ...EVENTS.filter((e) => e.slug !== "leadership-workshop-2026").map((e) => ({
      ...e,
      published: true,
    })),
    {
      slug: "leadership-workshop-demo",
      title: "Youth Leaders' Workshop",
      date: workshopDay,
      startTime: "10:00",
      endTime: "14:00",
      venue: "Diocesan Secretariat, Onikolobo, Abeokuta",
      level: "Diocese",
      summary:
        "Training for parish youth presidents, secretaries and coordinators on planning programmes, keeping records and mentoring younger members.",
      description:
        "A one-day workshop for parish youth officers.\n\nSessions cover planning a year of programmes, keeping membership records, and mentoring younger members. Lunch is provided.",
      speakers: [
        { name: "Speaker One (sample)", role: "Diocesan Youth Chaplain" },
        { name: "Speaker Two (sample)", role: "Youth President" },
      ],
      registration: {
        opensAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
        closesAt: `${day(9)}T23:59:00+01:00`,
        fields: [
          {
            key: "tshirtSize",
            label: "T-shirt size",
            type: "select",
            options: ["S", "M", "L", "XL", "XXL"],
          },
          { key: "fellowshipRole", label: "Role in your parish youth fellowship", type: "text" },
        ],
      },
      published: true,
    },
    {
      slug: "youth-camp-demo",
      title: "Youth Camp",
      date: campStart,
      endDate: day(32),
      startTime: "08:00",
      endTime: "21:00",
      venue: "Venue to be announced",
      level: "Diocese",
      summary:
        "Three days of worship, Bible study, sports and talks. Draft: not on the website yet.",
      registration: {
        opensAt: `${day(5)}T09:00:00+01:00`,
        closesAt: `${day(25)}T23:59:00+01:00`,
        fields: [
          { key: "emergencyName", label: "Emergency contact name", type: "text" },
          { key: "emergencyPhone", label: "Emergency contact phone", type: "tel" },
          {
            key: "q-do-you-need-accommodation",
            label: "Do you need accommodation?",
            type: "select",
            options: ["Yes", "No"],
          },
        ],
      },
      published: false,
    },
  ];
}

/** [first name, surname, gender, date of birth, education, status, user code] */
export const DEMO_PEOPLE: [
  string,
  string,
  "Male" | "Female",
  string,
  EducationLevel,
  RegistrationStatus,
  string,
][] = [
  ["Tobi", "Sample", "Male", "2005-03-14", "HND / Bachelor's degree", "approved", "AYF-TB7K2Q"],
  ["Funmi", "Example", "Female", "2009-07-02", "Senior secondary (SSS)", "pending", "AYF-FN4M8X"],
  ["Dayo", "Demo", "Male", "2011-11-20", "Junior secondary (JSS)", "pending", "AYF-DY3P6R"],
  ["Kemi", "Test", "Female", "2001-01-09", "Postgraduate", "approved", "AYF-KM9W2C"],
  ["Seyi", "Placeholder", "Male", "2007-05-30", "OND / NCE", "pending", "AYF-SY5H4N"],
  ["Bisi", "Sample", "Female", "2003-09-17", "Not in school", "rejected", "AYF-BS2T7V"],
];
