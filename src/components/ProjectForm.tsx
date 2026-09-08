import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Project } from "../types/report";
import type { ProjectInput } from "../services/projectService";

interface ProjectFormProps {
  project?: Project | null;
  isSaving: boolean;
  onSubmit: (data: ProjectInput) => Promise<void>;
  onCancel: () => void;
}

interface FormValues {
  name: string;
  description: string;
  isActive: boolean;
}

export default function ProjectForm({ project, isSaving, onSubmit, onCancel }: ProjectFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { name: "", description: "", isActive: true }
  });

  useEffect(() => {
    reset({
      name: project?.name ?? "",
      description: project?.description ?? "",
      isActive: project?.isActive ?? true
    });
  }, [project, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">{project ? "Edit project" : "New project"}</h3>
      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500" htmlFor="project-name">Name</label>
          <input id="project-name" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-500" {...register("name", { required: "Project name is required" })} />
          {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500" htmlFor="project-description">Description</label>
          <textarea id="project-description" rows={3} className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-500" {...register("description")} />
        </div>
        {project && <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" {...register("isActive")} /> Active project</label>}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        {project && <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600">Cancel</button>}
        <button type="submit" disabled={isSaving} className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-700 disabled:opacity-50">{isSaving ? "Saving..." : project ? "Update project" : "Create project"}</button>
      </div>
    </form>
  );
}