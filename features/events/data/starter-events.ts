import type { EventItem } from "@/features/events/types";

// Starter events. Once a database is connected, events are managed in the admin area (/admin)
// and this list is only used to seed it and as the fallback when no database is connected.
// The entries below are starter examples: replace them with the real programme.

export const EVENTS: EventItem[] = [
  {
    slug: "youth-week-2026",
    title: "Diocesan Youth Week",
    date: "2026-11-08",
    endDate: "2026-11-15",
    venue: "Parishes across the diocese",
    level: "Diocese",
    summary:
      "A week of youth-led services, outreach and fellowship. Each parish's youths lead worship on the closing Sunday.",
  },
  {
    slug: "leadership-workshop-2026",
    title: "Youth Leaders' Workshop",
    date: "2026-11-21",
    startTime: "10:00",
    endTime: "14:00",
    venue: "Venue to be announced",
    level: "Diocese",
    summary:
      "Training for parish youth presidents, secretaries and coordinators on planning programmes, keeping records and mentoring younger members.",
  },
  {
    slug: "carol-service-2026",
    title: "Youth Carol Service",
    date: "2026-12-13",
    startTime: "16:00",
    venue: "Cathedral of St. Peter, Ake, Abeokuta",
    level: "Diocese",
    summary:
      "Nine lessons and carols led by youth choirs and readers from every archdeaconry. Families and friends are welcome.",
  },
  {
    slug: "new-year-retreat-2027",
    title: "New Year Spiritual Retreat",
    date: "2027-01-15",
    endDate: "2027-01-17",
    venue: "Venue to be announced",
    level: "Diocese",
    summary:
      "Three days of prayer, Bible study, career talks and games to start the year together.",
  },
];
