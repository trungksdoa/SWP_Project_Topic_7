import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { manageTodoServices } from "../../services/manageTooServices";

// Query key constants
const TODO_KEYS = {
  all: ["todos"],
  detail: (id) => ["todos", id],
};

// Get all tasks
export const useGetAllTasks = () => {
  const q = useQuery({
    queryKey: TODO_KEYS.all,
    queryFn: () => manageTodoServices.getAllTasks(),
  });
  return {
    ...q,
    data: q?.data?.data?.data,
  };
};

// Get single task
export const useGetTask = (id) => {
  const q = useQuery({
    queryKey: TODO_KEYS.detail(id),
    queryFn: () => manageTodoServices.getTask(id),
    enabled: !!id, // Only run if id exists
  });
  return {
    ...q,
    data: q?.data?.data?.data,
  };
};

// Create task
export const useCreateTask = () => {
  return useMutation({
    mutationFn: (payload) => manageTodoServices.createTask(payload),
  });
};

// Update task
export const useUpdateTask = () => {
  return useMutation({
    mutationFn: ({ id, payload }) => manageTodoServices.updateTask(id, payload),
  });
};

// Update task index
export const useUpdateTaskIndex = () => {
  return useMutation({
    mutationFn: (payload) => manageTodoServices.updateTaskIndex(payload),
  });
};
// Delete task
export const useDeleteTask = () => {
  return useMutation({
    mutationFn: (id) => manageTodoServices.deleteTask(id),
  });
};

// Complete task
export const useCompleteTask = () => {
  return useMutation({
    mutationFn: (id) => manageTodoServices.completeTask(id),
  });
};

// Uncomplete task
export const useUncompleteTask = () => {
  return useMutation({
    mutationFn: (id) => manageTodoServices.uncompleteTask(id),
  });
};
