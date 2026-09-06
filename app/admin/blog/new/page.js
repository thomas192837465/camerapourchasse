"use client";

import { useRouter } from "next/navigation";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { createPost } from "@/lib/posts";

export default function NewBlogPostPage() {
  const router = useRouter();

  async function handleSubmit(data) {
    await createPost(data);
    router.push("/admin/blog");
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Nouvel article</h1>
          <p>Visible sur /blog et repris dans "derniers articles" dès qu'il est publié.</p>
        </div>
      </div>
      <BlogPostForm onSubmit={handleSubmit} />
    </>
  );
}
