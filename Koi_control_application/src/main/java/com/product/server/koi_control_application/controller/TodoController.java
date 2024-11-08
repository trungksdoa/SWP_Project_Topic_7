package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.model.TodoTask;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.service.TodoService;
import com.product.server.koi_control_application.ultil.JwtTokenUtil;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/todo")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER')")
public class TodoController {
    private final TodoService todoService;
    private final JwtTokenUtil jwtUtil;

    @PostMapping("/create/task")
    public ResponseEntity<BaseResponse> createTask(HttpServletRequest request, @RequestBody @Valid TodoTask todoTask) {
        int userId = jwtUtil.getUserIdFromToken(request);
        return ResponseUtil.createSuccessResponse(todoService.createTask(userId, todoTask), "Success");
    }

    @DeleteMapping("/delete/task/{id}")
    public ResponseEntity<BaseResponse> deleteTask(@PathVariable int id) {
        todoService.deleteTask(id);
        return ResponseUtil.createSuccessResponse(null, "Deleted successfully");
    }

    @PutMapping("/update/task/{id}")
    public ResponseEntity<BaseResponse> updateTask(@PathVariable int id, @RequestBody @Valid TodoTask todoTask) {
        todoService.updateTask(id, todoTask);
        return ResponseUtil.createSuccessResponse(null, "Updated successfully");
    }

    @PutMapping("/update/task/index")
    public ResponseEntity<BaseResponse> updateIndex(@RequestBody List<TodoTask> todoTask) {
        todoService.updateIndex(todoTask);
        return ResponseUtil.createSuccessResponse(null, "Updated successfully");
    }

    @RequestMapping("/complete/task/{id}")
    public ResponseEntity<BaseResponse> completeTask(@PathVariable  int id) {
        todoService.completeTask(id);
        return ResponseUtil.createSuccessResponse(null, "Completed successfully");
    }

    @RequestMapping("/uncomplete/task/{id}")
    public ResponseEntity<BaseResponse> uncompleteTask(@PathVariable  int id) {
        todoService.uncompleteTask(id);
        return ResponseUtil.createSuccessResponse(null, "Uncompleted successfully");
    }

    @RequestMapping("/get/task/{id}")
    public ResponseEntity<BaseResponse> getTask(@PathVariable int id) {
        return ResponseUtil.createSuccessResponse(todoService.getTask(id), "Success");
    }

    @RequestMapping("/getAll")
    public ResponseEntity<BaseResponse> getAllTask(HttpServletRequest request) {
        int userId = jwtUtil.getUserIdFromToken(request);
        return ResponseUtil.createSuccessResponse(todoService.getAllTasks(userId), "Success");
    }
}
