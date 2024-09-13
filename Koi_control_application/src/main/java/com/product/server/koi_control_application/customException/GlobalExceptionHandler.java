package com.product.server.koi_control_application.customException;

import com.product.server.koi_control_application.dto.ErrorResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoHandlerFoundException(NoHandlerFoundException ex) {
        ErrorResponse errorResponse = ErrorResponse.of(HttpStatus.NOT_FOUND.value(), "Resource not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<String> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<String> handleProductNotFoundException(ProductNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InsufficientException.class)
    public ResponseEntity<String> handleInsufficientException(InsufficientException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.INSUFFICIENT_STORAGE);
    }

    @ExceptionHandler(UserExistedException.class)
    public ResponseEntity<String> handleUserExistsException(UserExistedException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(UserNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = "An unexpected error occurred";

        if (ex instanceof UserNotFoundException) {
            status = HttpStatus.NOT_FOUND;
            message = ex.getMessage();
        }
        else if(ex instanceof UserExistedException){
            status = HttpStatus.CONFLICT;
            message = ex.getMessage();
        }
        // Add more specific exception handlers here if needed

        ErrorResponse errorResponse = ErrorResponse.of(status.value(), message);
        return ResponseEntity.status(status).body(errorResponse);
    }
    // You can add more exception handlers here for different types of exceptions
}
