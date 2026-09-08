import type { Project } from "../types/report";

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{project.name}</h3>
          <p className="mt-2 text-sm text-slate-500">{project.description || "No description provided."}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] ${project.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
          {project.isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
        <button type="button" onClick={onEdit} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-cyan-400 hover:text-cyan-700">Edit</button>
        <button type="button" onClick={onDelete} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50">Delete</button>
      </div>
    </article>
  );
}