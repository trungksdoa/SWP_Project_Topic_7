package com.product.server.koi_control_application.mappingInterface;

public interface ManageCategoryMappings {
    String BASE_MANAGE_CATEGORY = "/manage/api/category";
    String UPDATE_CATEGORY = "/{cateId}";
    String DELETE_CATEGORY = "/{cateId}";
    String GET_CATEGORY_BY_ID = "/{cateId}";
}