import { supabase } from "@/lib/supabase";
import { Project } from "@/types";
import { SAMPLE_PROJECTS } from "@/constants";

export async function getProjects(userId?: string): Promise<Project[]> {
  if (!userId) return SAMPLE_PROJECTS;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error || !data || data.length === 0) return SAMPLE_PROJECTS;

  return data.map(mapProject);
}

export async function createProject(
  project: Omit<Project, "id" | "createdAt" | "updatedAt">,
  userId: string
): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      name: project.name,
      description: project.description,
      type: project.type,
      status: project.status,
      package_name: project.packageName,
      version_name: project.versionName,
      version_code: project.versionCode,
      build_count: 0,
      settings: project.settings,
      screens: project.screens,
      files: project.files,
    })
    .select()
    .single();

  if (error) throw error;
  return mapProject(data);
}

export async function updateProject(
  id: string,
  updates: Partial<Project>
): Promise<void> {
  const { error } = await supabase
    .from("projects")
    .update({
      name: updates.name,
      description: updates.description,
      status: updates.status,
      version_name: updates.versionName,
      version_code: updates.versionCode,
      build_count: updates.buildCount,
      last_build: updates.lastBuild,
      screens: updates.screens,
      files: updates.files,
      settings: updates.settings,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

function mapProject(d: any): Project {
  return {
    id: d.id,
    name: d.name,
    description: d.description || "",
    type: d.type,
    status: d.status,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
    userId: d.user_id,
    packageName: d.package_name || "com.example.app",
    versionName: d.version_name || "1.0.0",
    versionCode: d.version_code || 1,
    buildCount: d.build_count || 0,
    lastBuild: d.last_build,
    screens: d.screens || [],
    files: d.files || [],
    settings: d.settings || {
      minSdk: 24,
      targetSdk: 34,
      compileSdk: 34,
      buildTools: "34.0.0",
      theme: "Theme.Material3",
      orientation: "portrait",
      permissions: ["INTERNET"],
    },
  };
}
