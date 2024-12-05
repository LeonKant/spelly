import { relations } from "drizzle-orm/relations";
import {
  profilesInSpelly,
  lobbiesInSpelly,
  lobbyPlayersInSpelly,
  lobbyPrevRoundsInSpelly,
} from "../schema/spelly";
import { usersInAuth } from "../schema/auth";

export const lobbiesInSpellyRelations = relations(
  lobbiesInSpelly,
  ({ one, many }) => ({
    profilesInSpelly: one(profilesInSpelly, {
      fields: [lobbiesInSpelly.hostId],
      references: [profilesInSpelly.id],
    }),
    lobbyPrevRoundsInSpellies: many(lobbyPrevRoundsInSpelly),
    lobbyPlayersInSpellies: many(lobbyPlayersInSpelly),
  }),
);

export const profilesInSpellyRelations = relations(
  profilesInSpelly,
  ({ one, many }) => ({
    lobbiesInSpellies: many(lobbiesInSpelly),
    usersInAuth: one(usersInAuth, {
      fields: [profilesInSpelly.id],
      references: [usersInAuth.id],
    }),
    lobbyPlayersInSpellies: many(lobbyPlayersInSpelly),
  }),
);

export const lobbyPrevRoundsInSpellyRelations = relations(
  lobbyPrevRoundsInSpelly,
  ({ one }) => ({
    lobbiesInSpelly: one(lobbiesInSpelly, {
      fields: [lobbyPrevRoundsInSpelly.lobbyId],
      references: [lobbiesInSpelly.id],
    }),
  }),
);

export const usersInAuthRelations = relations(usersInAuth, ({ many }) => ({
  profilesInSpellies: many(profilesInSpelly),
}));

export const lobbyPlayersInSpellyRelations = relations(
  lobbyPlayersInSpelly,
  ({ one }) => ({
    profilesInSpelly: one(profilesInSpelly, {
      fields: [lobbyPlayersInSpelly.userId],
      references: [profilesInSpelly.id],
    }),
    lobbiesInSpelly: one(lobbiesInSpelly, {
      fields: [lobbyPlayersInSpelly.lobbyId],
      references: [lobbiesInSpelly.id],
    }),
  }),
);
