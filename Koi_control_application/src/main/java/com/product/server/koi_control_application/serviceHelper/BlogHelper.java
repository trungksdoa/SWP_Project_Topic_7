package com.product.server.koi_control_application.serviceHelper;

import com.product.server.koi_control_application.customException.BadRequestException;
import com.product.server.koi_control_application.model.Blogs;
import com.product.server.koi_control_application.repository.BlogsRepository;
import com.product.server.koi_control_application.serviceHelper.interfaces.IBlogHelper;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;


@RequiredArgsConstructor
@Service
@Slf4j
public class BlogHelper implements IBlogHelper {
    private final BlogsRepository blogRepository;

    @Override
    @Transactional
    public Blogs save(Blogs blog) {
        try {
            log.info("Saving blog");
            log.info("Blog: {}", blog);
            return blogRepository.save(blog);
        } catch (Exception e) {
            throw new BadRequestException("Failed to save blog");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Blogs> findAll() {
        return blogRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Blogs get(int id) {
        return blogRepository.findById(id).orElseThrow(() -> new BadRequestException("Blog not found"));
    }

    @Override
    @Transactional
    public void delete(Blogs blog) {
        try {
            log.info("Deleting blog");
            log.info("Blog: {}", blog);
            blogRepository.delete(blog);
        } catch (Exception e) {
            throw new BadRequestException("Failed to delete blog");
        }
    }
    // Add methods as needed
}
