import { test } from "node:test";
import assert from "node:assert/strict";
import {
  checkAnswer,
  customQuestionsText,
  missingFields,
  parseCustomQuestions,
} from "../features/events/utils/event-fields.ts";
import {
  formatEventTime,
  fromLagosInput,
  registrationState,
  toLagosInput,
} from "../features/events/utils/events.ts";
import { normalizePhone, parseTicketCode, parseUserCode } from "../utils/identifiers.ts";

test("phone numbers match however they are typed", () => {
  for (const p of ["0803 123 4567", "+234 803 123 4567", "2348031234567", "803-123-4567"]) {
    assert.equal(normalizePhone(p), "08031234567");
  }
});

test("user codes and ticket codes are read from typed or scanned text", () => {
  assert.equal(parseUserCode("ayf 7kq2mx"), "AYF-7KQ2MX");
  assert.equal(parseUserCode("08031234567"), null);
  assert.equal(parseTicketCode("7uvt-f279-3mtt"), "7UVTF2793MTT");
  assert.equal(parseTicketCode("https://example.org/tickets/7UVTF2793MTT?new=1"), "7UVTF2793MTT");
  assert.equal(parseTicketCode("hello"), null);
});

test("members are only asked for what they have never given", () => {
  const fields = [
    { key: "email", label: "Email", type: "email" as const },
    { key: "tshirtSize", label: "T-shirt", type: "select" as const, options: ["M", "L"] },
    ...parseCustomQuestions("Need accommodation?: Yes, No"),
  ];
  const member = { email: "a@example.com", occupation: "", extra: { tshirtSize: "M" } };
  assert.deepEqual(
    missingFields(member, fields).map((f) => f.key),
    ["q-need-accommodation"]
  );
  assert.equal(checkAnswer(fields[2], "Maybe"), "Choose one of the options.");
  assert.equal(checkAnswer(fields[2], "Yes"), "");
  assert.equal(customQuestionsText(fields), "Need accommodation?: Yes, No");
});

test("registration window and times use Nigerian time", () => {
  assert.equal(fromLagosInput("2026-11-01T09:00"), "2026-11-01T09:00:00+01:00");
  assert.equal(toLagosInput("2026-11-01T08:00:00.000Z"), "2026-11-01T09:00");
  const event = {
    slug: "x",
    title: "X",
    date: "2026-11-21",
    venue: "V",
    level: "Diocese" as const,
    summary: "S",
    registration: {
      opensAt: "2026-11-01T09:00:00+01:00",
      closesAt: "2026-11-20T18:00:00+01:00",
      fields: [],
    },
  };
  assert.equal(registrationState(event, new Date("2026-11-01T07:59:00Z")), "upcoming");
  assert.equal(registrationState(event, new Date("2026-11-01T08:00:00Z")), "open");
  assert.equal(registrationState(event, new Date("2026-11-20T17:00:00Z")), "closed");
  assert.equal(
    formatEventTime({ date: "2026-11-21", startTime: "10:00", endTime: "14:00" }),
    "10:00 am – 2:00 pm"
  );
  assert.equal(
    formatEventTime({ date: "2026-11-21", endDate: "2026-11-23", startTime: "08:00" }),
    "From 8:00 am daily"
  );
});
