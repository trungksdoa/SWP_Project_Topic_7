import { MANAGE_TODO_API } from "../constant/api";
import { apiInstanceHeader } from "../constant/apiInstanceHeader";

const api = apiInstanceHeader.create({
    baseURL: MANAGE_TODO_API
});

export const manageTodoServices = {
    // Get all tasks for current user
    getAllTasks: () => api.get("/getAll"),
    
    // Get single task by id
    getTask: (id) => api.get(`/get/task/${id}`),
    
    // Create new task
    createTask: (payload) => api.post("/create/task", payload),
    
    // Update existing task
    updateTask: (id, payload) => api.put(`/update/task/${id}`, payload),
    
    // Update task index
    updateTaskIndex: (payload) => api.put(`/update/task/index`, payload),
        
    // Delete task
    deleteTask: (id) => api.delete(`/delete/task/${id}`),
    
    // Mark task as complete
    completeTask: (id) => api.post(`/complete/task/${id}`),
    
    // Mark task as uncomplete
    uncompleteTask: (id) => api.post(`/uncomplete/task/${id}`)
};