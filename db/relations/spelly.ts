import { relations } from "drizzle-orm/relations";
import { profilesInSpelly, lobbiesInSpelly, lobbyPlayersInSpelly } from "../schema/spelly";
import { usersInAuth } from "../schema/auth";

export const profilesInSpellyRelations = relations(profilesInSpelly, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [profilesInSpelly.id],
		references: [usersInAuth.id]
	}),
	lobbiesInSpellies: many(lobbiesInSpelly),
	lobbyPlayersInSpellies: many(lobbyPlayersInSpelly),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	profilesInSpellies: many(profilesInSpelly),
}));

export const lobbiesInSpellyRelations = relations(lobbiesInSpelly, ({one, many}) => ({
	profilesInSpelly: one(profilesInSpelly, {
		fields: [lobbiesInSpelly.hostId],
		references: [profilesInSpelly.id]
	}),
	lobbyPlayersInSpellies: many(lobbyPlayersInSpelly),
}));

export const lobbyPlayersInSpellyRelations = relations(lobbyPlayersInSpelly, ({one}) => ({
	profilesInSpelly: one(profilesInSpelly, {
		fields: [lobbyPlayersInSpelly.userId],
		references: [profilesInSpelly.id]
	}),
	lobbiesInSpelly: one(lobbiesInSpelly, {
		fields: [lobbyPlayersInSpelly.lobbyId],
		references: [lobbiesInSpelly.id]
	}),
}));