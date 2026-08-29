import { supabase } from "@/lib/supabase";
import { Asset } from "@/types";

export async function uploadAsset(
  file: File,
  userId: string,
  projectId?: string
): Promise<Asset> {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("project-assets")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from("project-assets")
    .getPublicUrl(path);

  const { data, error } = await supabase
    .from("assets")
    .insert({
      user_id: userId,
      project_id: projectId || null,
      name: file.name,
      file_path: path,
      file_url: urlData.publicUrl,
      file_type: file.type,
      file_size: file.size,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    fileUrl: data.file_url,
    filePath: data.file_path,
    fileType: data.file_type,
    fileSize: data.file_size,
    projectId: data.project_id,
    createdAt: data.created_at,
  };
}

export async function getAssets(userId: string): Promise<Asset[]> {
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((d) => ({
    id: d.id,
    name: d.name,
    fileUrl: d.file_url,
    filePath: d.file_path,
    fileType: d.file_type,
    fileSize: d.file_size,
    projectId: d.project_id,
    createdAt: d.created_at,
  }));
}

export async function deleteAsset(assetId: string, filePath: string) {
  await supabase.storage.from("project-assets").remove([filePath]);
  const { error } = await supabase.from("assets").delete().eq("id", assetId);
  if (error) throw error;
}
