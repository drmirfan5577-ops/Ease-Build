import { supabase } from "@/lib/supabase";
import { Team, TeamMember } from "@/types";

export async function createTeam(
  name: string,
  description: string,
  ownerId: string
): Promise<Team> {
  const { data, error } = await supabase
    .from("teams")
    .insert({ name, description, owner_id: ownerId })
    .select()
    .single();
  if (error) throw error;
  return mapTeam(data, []);
}

export async function getMyTeams(userId: string): Promise<Team[]> {
  const { data: teamsData, error } = await supabase
    .from("teams")
    .select(
      `*, team_members(id, user_id, role, joined_at, user_profiles(id, username, email))`
    )
    .or(`owner_id.eq.${userId}`);
  if (error) throw error;
  return (teamsData || []).map((t: any) => mapTeam(t, t.team_members || []));
}

export async function inviteToTeam(
  teamId: string,
  email: string,
  role: string
): Promise<void> {
  // Find user by email in user_profiles
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (profileError || !profile) throw new Error("User not found with that email.");

  const { error } = await supabase.from("team_members").insert({
    team_id: teamId,
    user_id: profile.id,
    role,
  });
  if (error) throw error;
}

export async function removeMember(memberId: string) {
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", memberId);
  if (error) throw error;
}

export async function deleteTeam(teamId: string) {
  const { error } = await supabase.from("teams").delete().eq("id", teamId);
  if (error) throw error;
}

function mapTeam(t: any, members: any[]): Team {
  return {
    id: t.id,
    name: t.name,
    description: t.description,
    ownerId: t.owner_id,
    inviteCode: t.invite_code,
    members: members.map((m: any) => ({
      id: m.id,
      userId: m.user_id,
      name: m.user_profiles?.username || "Unknown",
      email: m.user_profiles?.email || "",
      role: m.role,
      joinedAt: m.joined_at,
    })),
    createdAt: t.created_at,
  };
}
