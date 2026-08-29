import React, { useState } from "react";
import { Users, Plus, Trash2, Crown, Copy, Check, UserPlus, X } from "lucide-react";
import { Team } from "@/types";
import { createTeam, getMyTeams, inviteToTeam, removeMember, deleteTeam } from "@/lib/teams";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";

const ROLE_STYLES: Record<string, string> = {
  owner: "badge-amber",
  editor: "badge-blue",
  viewer: "bg-gray-100 text-gray-600 border border-gray-200 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
};

const TeamCollaboration: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [showInvite, setShowInvite] = useState<string | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [copied, setCopied] = useState<string | null>(null);

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["teams", user?.id],
    queryFn: () => (user ? getMyTeams(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: () => { if (!user) throw new Error("Not logged in"); return createTeam(teamName, teamDesc, user.id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["teams", user?.id] }); setShowCreate(false); setTeamName(""); setTeamDesc(""); toast.success("Team created!"); },
    onError: (err: any) => toast.error(err.message),
  });

  const inviteMutation = useMutation({
    mutationFn: ({ teamId }: { teamId: string }) => inviteToTeam(teamId, inviteEmail, inviteRole),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["teams", user?.id] }); setShowInvite(null); setInviteEmail(""); toast.success("Member invited!"); },
    onError: (err: any) => toast.error(err.message),
  });

  const removeMutation = useMutation({
    mutationFn: (memberId: string) => removeMember(memberId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["teams", user?.id] }); toast.success("Member removed"); },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (teamId: string) => deleteTeam(teamId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["teams", user?.id] }); toast.success("Team deleted"); },
    onError: (err: any) => toast.error(err.message),
  });

  const handleCopyInvite = (code: string, id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${code}`);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast.success("Invite link copied!");
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: "linear-gradient(135deg, #fafbff, #f0f4ff)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 glass-crystal border-b border-blue-100/50 sticky top-0 z-10 shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md">
          <Users size={16} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">Team Collaboration</p>
          <p className="text-xs text-gray-500">{teams.length} team{teams.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary text-xs px-3 py-2">
          <Plus size={13} /> New Team
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Create team */}
        {showCreate && (
          <div className="glass-crystal border border-blue-100 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Create New Team</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-rose-600 transition-colors"><X size={14} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Team Name *</label>
                <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)}
                  placeholder="e.g. eSmart Dev Team" className="input-bright" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Description</label>
                <input type="text" value={teamDesc} onChange={e => setTeamDesc(e.target.value)}
                  placeholder="Optional description" className="input-bright" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => createMutation.mutate()} disabled={!teamName.trim() || createMutation.isPending}
                  className="btn-primary flex-1">
                  {createMutation.isPending ? "Creating..." : "Create Team"}
                </button>
                <button onClick={() => setShowCreate(false)} className="btn-ghost px-4 py-2.5">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && teams.length === 0 && !showCreate && (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-center">
            <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-4">
              <Users size={28} className="text-pink-400" />
            </div>
            <p className="text-sm font-semibold text-gray-600">No teams yet</p>
            <p className="text-xs text-gray-400 mt-1">Create a team to collaborate with others</p>
            <button onClick={() => setShowCreate(true)} className="btn-primary text-xs px-5 py-2 mt-4">
              Create Your First Team
            </button>
          </div>
        )}

        {teams.map(team => (
          <div key={team.id} className="glass-crystal border border-blue-100 rounded-2xl overflow-hidden shadow-lg">
            {/* Team header */}
            <div className="flex items-center gap-3 p-4 border-b border-blue-100/50">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-black text-base shrink-0 shadow-md">
                {team.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{team.name}</p>
                <p className="text-xs text-gray-500">
                  {team.members.length + 1} member{team.members.length !== 0 ? "s" : ""} · Created {formatDate(team.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => handleCopyInvite(team.inviteCode, team.id)}
                  className="btn-ghost text-xs px-2.5 py-1.5">
                  {copied === team.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  Invite Link
                </button>
                <button onClick={() => setShowInvite(showInvite === team.id ? null : team.id)}
                  className="badge-blue cursor-pointer hover:bg-blue-100 transition-colors flex items-center gap-1 px-2.5 py-1.5 rounded-xl">
                  <UserPlus size={12} /> Invite
                </button>
                {team.ownerId === user?.id && (
                  <button onClick={() => deleteMutation.mutate(team.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Invite panel */}
            {showInvite === team.id && (
              <div className="p-4 border-b border-blue-100/50 bg-blue-50/50">
                <p className="text-xs font-bold text-gray-700 mb-3">Invite Member</p>
                <div className="flex gap-2">
                  <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                    placeholder="colleague@email.com" className="input-bright flex-1" />
                  <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                    className="input-bright w-24">
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button onClick={() => inviteMutation.mutate({ teamId: team.id })}
                    disabled={!inviteEmail.trim() || inviteMutation.isPending}
                    className="btn-primary px-3 py-2 shrink-0">
                    {inviteMutation.isPending ? "..." : "Invite"}
                  </button>
                </div>
              </div>
            )}

            {/* Members */}
            <div className="divide-y divide-blue-50">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0 shadow-sm">
                  <Crown size={14} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{user?.username || "You"}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <span className="badge-amber">owner</span>
              </div>
              {team.members.map(member => (
                <div key={member.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-sm">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                  <span className={ROLE_STYLES[member.role] || ROLE_STYLES.viewer}>{member.role}</span>
                  {team.ownerId === user?.id && (
                    <button onClick={() => removeMutation.mutate(member.id)} className="p-1 text-gray-400 hover:text-rose-600 transition-colors">
                      <X size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCollaboration;
