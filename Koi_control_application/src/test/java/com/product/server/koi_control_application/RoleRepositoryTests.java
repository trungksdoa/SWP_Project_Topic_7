package com.product.server.koi_control_application;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import com.product.server.koi_control_application.model.UserRole;
import com.product.server.koi_control_application.repository.UserRoleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@Rollback()
public class RoleRepositoryTests {
	@Autowired private UserRoleRepository repo;
	
	@Test
	public void testCreateRoles() {
		UserRole admin = new UserRole("ROLE_ADMIN");
		UserRole editor = new UserRole("ROLE_MEMBER");
		UserRole customer = new UserRole("ROLE_SHOP");
		
		repo.saveAll(List.of(admin, editor, customer));
		
		long count = repo.count();
		assertEquals(3, count);
	}
}
