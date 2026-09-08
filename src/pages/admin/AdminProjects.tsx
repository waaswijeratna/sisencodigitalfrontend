
import { useEffect, useState } from "react";
import ProjectCard from "../../components/ProjectCard";
import ProjectForm from "../../components/ProjectForm";
import Snackbar, { type SnackbarTone } from "../../components/Snackbar";
import { createProject, deleteProject, getProjects, updateProject, type ProjectInput } from "../../services/projectService";
import type { Project } from "../../types/report";

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; tone: SnackbarTone } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      setProjects(await getProjects());
    } catch (error) {
      setSnackbar({ message: error instanceof Error ? error.message : "Unable to load projects.", tone: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProjects();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const saveProject = async (data: ProjectInput) => {
    setIsSaving(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);
        setSnackbar({ message: "Project updated successfully.", tone: "success" });
      } else {
        await createProject(data);
        setSnackbar({ message: "Project created successfully.", tone: "success" });
      }
      setEditingProject(null);
      setIsFormOpen(false);
      await loadProjects();
    } catch (error) {
      setSnackbar({ message: error instanceof Error ? error.message : "Unable to save project.", tone: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const projectName = pendingDelete.name;
    setPendingDelete(null);
    try {
      const result = await deleteProject(pendingDelete.id);
      setSnackbar({ message: result.message || `${projectName} deleted.`, tone: "success" });
      await loadProjects();
    } catch (error) {
      setSnackbar({ message: error instanceof Error ? error.message : "Unable to delete project.", tone: "error" });
    }
  };

  const openCreate = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col rounded-xl bg-slate-100 p-4 text-slate-800 sm:p-6">
      <Snackbar message={pendingDelete ? `Delete project "${pendingDelete.name}"?` : snackbar?.message ?? null} tone={pendingDelete ? "error" : snackbar?.tone ?? "success"} onClose={() => { setPendingDelete(null); setSnackbar(null); }} confirm={pendingDelete ? { onConfirm: () => void confirmDelete(), confirmLabel: "Yes, delete" } : undefined} />
      <header className="flex shrink-0 flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">Workspace</p><h2 className="mt-1 text-2xl font-semibold">Projects</h2><p className="mt-1 text-sm text-slate-500">Create and manage the projects used in reports.</p></div>
        <button type="button" onClick={openCreate} className="rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-cyan-700">New project</button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto pt-5">
        {isLoading ? <p className="text-sm text-slate-500">Loading projects...</p> : projects.length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-sm text-slate-500">No projects found.</div> : <div className="grid gap-4 lg:grid-cols-2">{projects.map((project) => <ProjectCard key={project.id} project={project} onEdit={() => openEdit(project)} onDelete={() => setPendingDelete(project)} />)}</div>}
      </div>
      {isFormOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-label={editingProject ? "Edit project" : "Create project"}>
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto">
            <button
              type="button"
              onClick={() => { setIsFormOpen(false); setEditingProject(null); }}
              className="absolute right-3 top-3 z-10 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 hover:border-cyan-400 hover:text-cyan-700"
              aria-label="Close project form"
            >
              Close
            </button>
            <ProjectForm
              project={editingProject}
              isSaving={isSaving}
              onSubmit={saveProject}
              onCancel={() => { setIsFormOpen(false); setEditingProject(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}