import { SupabaseClient } from "@supabase/supabase-js";

export interface ProjectInput {
  title: string;
  short_description: string;
  role: string;
  industry: string;
  duration: string;
  image_url: string;
  user_id: string;
  problem: string;
  process: string;
  solution: string;
  outcome: string;
  live_demo?: string;
  github_repo?: string;
}

export const projectService = {
  /**
   * Create a new project.
   */
  async createProject(supabase: SupabaseClient, input: ProjectInput) {
    const { data, error } = await supabase
      .from("projects")
      .insert([input])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Add images to a project's gallery.
   */
  async addProjectImages(supabase: SupabaseClient, projectId: string, imageUrIs: string[]) {
    const inserts = imageUrIs.map((url) => ({
      project_id: projectId,
      image_url: url
    }));

    const { error } = await supabase.from("project_images").insert(inserts);
    if (error) throw error;
  },

  /**
   * Update an existing project.
   */
  async updateProject(supabase: SupabaseClient, id: string, input: Partial<ProjectInput>) {
    const { error } = await supabase
      .from("projects")
      .update(input)
      .eq("id", id);

    if (error) throw error;
  },

  /**
   * Delete a project image by ID.
   */
  async deleteProjectImage(supabase: SupabaseClient, id: string) {
    const { error } = await supabase.from("project_images").delete().eq("id", id);
    if (error) throw error;
  },

  /**
   * Fetch a single project by ID.
   */
  async getProjectById(supabase: SupabaseClient, id: string) {
    // 1. Fetch the project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (projectError) throw projectError;

    // 2. Fetch the images separately to avoid join ambiguity
    const { data: images, error: imagesError } = await supabase
      .from("project_images")
      .select("*")
      .eq("project_id", id);

    if (imagesError) throw imagesError;

    // 3. Merge them manually
    return {
      ...project,
      project_images: images || []
    };
  },

  /**
   * Fetch all projects for a specific user.
   */
  async getUserProjects(supabase: SupabaseClient, userId: string) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch all public projects with creator profiles.
   */
  async getPublicProjects(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        profiles (*)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch all projects for a specific username.
   */
  async getProjectsByUsername(supabase: SupabaseClient, username: string) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (!profile) return [];

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", profile.id)
      .order("sort_order", { ascending: true }); // Use sort_order

    if (error) throw error;
    return data || [];
  },

  /**
   * Create or update a project.
   */
  async saveProject(supabase: SupabaseClient, userId: string, input: Partial<ProjectInput> & { id?: string }) {
    if (input.id) {
      const { error } = await supabase
        .from("projects")
        .update(input)
        .eq("id", input.id)
        .eq("user_id", userId);
      if (error) throw error;
      return { id: input.id };
    } else {
      // Get next sort order
      const { data: existingProjects } = await supabase
        .from("projects")
        .select("sort_order")
        .eq("user_id", userId)
        .order("sort_order", { ascending: false })
        .limit(1);

      const nextSortOrder = (existingProjects?.[0]?.sort_order ?? -1) + 1;

      const { data, error } = await supabase
        .from("projects")
        .insert([{ ...input, user_id: userId, sort_order: nextSortOrder }])
        .select("id")
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  /**
   * Update the sort order for multiple projects.
   */
  async updateOrder(supabase: SupabaseClient, userId: string, projectOrders: { id: string, sort_order: number }[]) {
    const updates = projectOrders.map((p) =>
      supabase
        .from("projects")
        .update({ sort_order: p.sort_order })
        .eq("id", p.id)
        .eq("user_id", userId)
    );

    await Promise.all(updates);
  }
};
