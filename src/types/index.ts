export type Person = {
  name: string;
  phone: string;
};

export type FillEntry = {
  mode: "officers" | "members";
  president?: Person;
  secretary?: Person;
  members?: [Person, Person];
  filledBy?: string;
  updatedAt: string;
};

export type FillData = Record<string, FillEntry>;
