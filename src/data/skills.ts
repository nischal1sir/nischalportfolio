/**
 * @deprecated THIS FILE IS DEPRECATED.
 * All skill data (technical stack, proficiency, soft skills, learning, exploring)
 * is now managed dynamically via Supabase database (`public.skills` and `public.soft_skills` tables)
 * through Admin Panel -> Skills CRUD.
 */

export interface SkillItem {
  name: string;
  category: string;
}

export const skills: SkillItem[] = [];
