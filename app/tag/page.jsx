"use client";

import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PromptCard from "@app/components/PromptCard";
import { Suspense } from "react";

 const Tag = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    const tag = searchParams.get("tag");

    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        const response = await fetch(`/api/prompt?tag=${tag}`);
        const data = await response.json();

        setPosts(data);
    };

    useEffect(() => {
        if (tag) {
            fetchPosts();
        }
    }, [session?.user.id]);

    const handleEdit = (post) => {
        router.push(`/update-prompt?id=${post._id}`);
    };

    const handleDelete = async (post) => {
        const hasConfirmed = confirm(
            "Are you sure you want to delete this prompt?"
        );

        if (hasConfirmed) {
            try {
                await fetch(`/api/prompt/${post._id.toString()}`, {
                    method: "DELETE",
                });

                const filteredPosts = posts.filter(
                    (prompt) => prompt._id !== post._id
                );

                setPosts(filteredPosts);
            } catch (error) {
                console.log(error);
            }
        }
    };

    let content;

    const handleTagClick = (tag) => {
        router.push(`/tag?tag=${tag}`);
    };

    if (tag)
        content = (
            <section className="w-full">
                <h1 className="head_text text-left">
                    <span className="blue_gradient">#{tag}</span>
                </h1>
                <p className="desc text-left">#{tag} related prompts</p>

                <div className="mt-16 prompt_layout">
                    {posts.map((post) => (
                        <PromptCard
                            key={post._id}
                            post={post}
                            handleEdit={() => handleEdit(post)}
                            handleDelete={() => handleDelete(post)}
                            handleTagClick={handleTagClick}
                        />
                    ))}
                </div>
            </section>
        );
    else
        content = (
            <section className="w-full">
                <p className="desc text-left">no tag was given</p>
            </section>
        );

    return <Suspense>{content}</Suspense>;
};

export default Tag;
