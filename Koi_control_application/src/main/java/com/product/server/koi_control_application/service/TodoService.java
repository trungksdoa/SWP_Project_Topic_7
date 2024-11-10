package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.customException.NotFoundException;
import com.product.server.koi_control_application.model.TodoTask;
import com.product.server.koi_control_application.repository.TodoTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class TodoService {
    private final TodoTaskRepository todoTaskRepository;


    @Transactional
    public TodoTask createTask(int userId, TodoTask todoTask) {
        int nextPlaceIndex = todoTaskRepository.findMaxPlaceIndex()
                .map(max -> max + 1)
                .orElse(1);
        return todoTaskRepository.save(
                TodoTask.builder()
                        .priority(todoTask.getPriority())
                        .dueDate(todoTask.getDueDate())
                        .userId(userId)
                        .taskType(todoTask.getTaskType())
                        .title(todoTask.getTitle())
                        .placeIndex(nextPlaceIndex)
                        .build()
        );
    }

    @Transactional
    public void deleteTask(int id) {
        todoTaskRepository.deleteById(id);
    }

    @Transactional
    public void updateTask(int id, TodoTask todo) {
        todoTaskRepository.findById(id).ifPresent(todoTask -> {
            Optional.ofNullable(todo.getTitle()).ifPresent(todoTask::setTitle);
            Optional.ofNullable(todo.getStatus()).ifPresent(todoTask::setStatus);
            Optional.ofNullable(todo.getPriority()).ifPresent(todoTask::setPriority);
            Optional.ofNullable(todo.getTaskType()).ifPresent(todoTask::setTaskType);
            Optional.ofNullable(todo.getDueDate()).ifPresent(todoTask::setDueDate);
            todoTaskRepository.save(todoTask);
        });
    }

    @Transactional
    public void completeTask(int id) {
        todoTaskRepository.findById(id).ifPresent(todoTask -> {
            todoTask.setCompletedAt(LocalDateTime.now());
            todoTask.setStatus("Completed");
            todoTaskRepository.save(todoTask);
        });
    }

    @Transactional
    public void uncompleteTask(int id) {
        todoTaskRepository.findById(id).ifPresent(todoTask -> {
            todoTask.setCompletedAt(null);
            todoTask.setStatus("Ongoing");
            todoTaskRepository.save(todoTask);
        });
    }

    @Transactional(readOnly = true)
    public List<TodoTask> getAllTasks(int userId) {
        return todoTaskRepository.findAllByUserId(userId);
    }

    @Transactional(readOnly = true)
    public TodoTask getTask(int id) {
        return todoTaskRepository.findById(id).orElseThrow(() -> new NotFoundException("Task not found"));
    }

    @Transactional
    public void updateIndex(List<TodoTask> todoTask) {
        todoTaskRepository.saveAll(todoTask);
    }
}
