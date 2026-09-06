"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { getPostById, updatePost, deletePost } from "@/lib/posts";

export default function EditBlogPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getPostById(id).then((p) => {
      setPost(p);
      setReady(true);
    });
  }, [id]);

  async function handleSubmit(data) {
    await updatePost(id, data);
    router.push("/admin/blog");
  }

  async function handleDelete() {
    await deletePost(id);
    router.push("/admin/blog");
  }

  if (!ready) return <p>Chargement…</p>;
  if (!post) return <p>Article introuvable.</p>;

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Modifier « {post.title} »</h1>
        </div>
      </div>
      <BlogPostForm initialPost={{ ...post, id }} onSubmit={handleSubmit} onDelete={handleDelete} />
    </>
  );
}
