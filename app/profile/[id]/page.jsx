"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

import Profile from "@app/components/Profile";

const MyProfile = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();

    if(params.id === session?.user.id){
        router.push('/profile')
    }

    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({});

    const fetchPosts = async () => {
        const response = await fetch(`/api/users/${params.id}/posts`);
        const data = await response.json();

        setPosts(data);
    };

    const fetchUser = async () => {
        const response = await fetch(`/api/users/${params.id}`);
        const data = await response.json();
        console.log(data)
        setUser(data);
    };

    useEffect(() => {
        if (params.id) {
            fetchUser();
            fetchPosts();
        }
    }, [session?.user.id]);

    const handleEdit = (post) => {
        router.push(`/update-prompt?id=${post._id}`);
    };

    console.log(user)

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

    if (user.username)return (
        <Profile
            name={user?.username}
            desc={`Welcome to ${user?.username} personalized page`}
            data={posts}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />
    );
};
export default MyProfile;
