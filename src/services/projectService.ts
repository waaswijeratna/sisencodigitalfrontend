import api from "../api/axios";
import type { Project } from "../types/report";

export interface ProjectInput {
  name: string;
  description?: string;
  isActive?: boolean;
}

export const getProjects = async () => {
  const response = await api.get<{ projects: Project[] }>("/projects", {
    params: { includeInactive: true }
  });
  return response.data.projects;
};

export const createProject = async (data: ProjectInput) => {
  const response = await api.post<{ project: Project }>("/projects", data);
  return response.data.project;
};

export const updateProject = async (projectId: number, data: ProjectInput) => {
  const response = await api.put<{ project: Project }>(`/projects/${projectId}`, data);
  return response.data.project;
};

export const deleteProject = async (projectId: number) => {
  const response = await api.delete<{ project: Project; message: string }>(`/projects/${projectId}`);
  return response.data;
};