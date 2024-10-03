import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetBlogById } from '../../../hooks/blogs/useGetBlogById'

const EditBlog = () => {
    const { id: blogId } = useParams()
    const parseId = parseInt(blogId)
    const { data: blog } = useGetBlogById(parseId)
    console.log(blog)
  return (
    <div>
      
    </div>
  )
}

export default EditBlog
