package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.CustomException.UserExistedException;
import com.product.server.koi_control_application.CustomException.UserNotFoundException;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    private final UsersRepository usersRepository;

    @Override
    public Users saveUser(Users user) {
        if (getUsersByUsername(user.getUsername()) == null){
            user.setPassword(user.getPassword());
            return usersRepository.save(user);
        }

        throw new UserExistedException(user.getUsername());
    }

    @Override
    public Users getUser(int id) {
        return usersRepository.fetchUsersById(id).orElseThrow(() -> new UserNotFoundException(String.valueOf(id)));
    }

    @Override
    public Users getUsersByUsername(String username) {
        return usersRepository.findByUsername(username).orElse(null);
    }

    @Override
    public Users userLogin(String username, String password) {
        return usersRepository.fetchUserByUserNamePassword(username, password).orElseThrow(() -> new UserNotFoundException(username));
    }

    @Override
    public Page<Users> getUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return usersRepository.findAll(pageable);
    }

    @Override
    public void deleteUser(int id) {
        Users user = getUser(id);
        usersRepository.delete(user);
    }

    @Override
    public void updateUser(Users user) {
        // TODO document why this method is empty
    }

}
