import { relations, sql } from "drizzle-orm";
import {
  foreignKey,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `umastudy_${name}`);

export const buildings = createTable("buildings", {
  id: varchar("id", { length: 5 }).primaryKey(),
  name: text("name").notNull(),
});

export const rooms = createTable(
  "rooms",
  {
    id: varchar("id", { length: 16 }).notNull(),
    building: varchar("building", { length: 8 })
      .notNull()
      .references(() => buildings.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.building, table.id] })],
);

export const events = createTable(
  "events",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    liveEventId: integer("live_event_id").notNull(),
    name: text("name").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    unique("live_event_id_starts_unique").on(table.liveEventId, table.startsAt),
    index("live_event_id").on(table.liveEventId),
    index("starts_at_idx").on(table.startsAt),
    index("ends_at_idx").on(table.endsAt),
  ],
);

export const eventRooms = createTable(
  "event_rooms",
  {
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    building: varchar("building", { length: 8 }).notNull(),
    roomId: varchar("room_id", { length: 16 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.eventId, table.roomId] }),
    foreignKey({
      columns: [table.building, table.roomId],
      foreignColumns: [rooms.building, rooms.id],
    }).onDelete("cascade"),
    index("event_id_idx").on(table.eventId),
    index("room_id_idx").on(table.roomId),
  ],
);

export const eventRelations = relations(events, ({ many }) => ({
  rooms: many(rooms),
}));

export const roomRelations = relations(rooms, ({ many }) => ({
  events: many(events),
}));

/**
 * USER/AUTH STUFF
 */

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
