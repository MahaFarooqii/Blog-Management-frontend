import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import type { AppDispatch, RootState } from "../store/store";
import { fetchPosts, fetchUserPosts } from "../store/reducers/postsSlice";
import { AddPostModal } from "../components/addPostModal";
import { ViewPostModal } from "../components/viewPostModal";
import { UpdatePostModal } from "../components/updatePostModal";
import { DeletePostModal } from "../components/deletePostModal";
import { FaEye, FaPencilAlt, FaTrash } from "react-icons/fa";

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const { posts, isLoading, error } = useSelector((state: RootState) => state.posts);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState([]);

    useEffect(() => {
        if (user) {
            dispatch(fetchUserPosts(user?.id));
        } else {
            dispatch(fetchPosts());
        }
    }, [user]);

    const handleViewPost = (post: any) => {
        setSelectedPost(post);
        setIsViewModalOpen(true);
    };
    const handleUpdatePost = (post: any) => {
        setSelectedPost(post);
        setIsUpdateModalOpen(true);
    };
    const handleDeletePost = (post: any) => {
        setSelectedPost(post);
        setIsDeleteModalOpen(true);
    };

    if (error) {
        return <div className="text-red-500 p-6 text-center font-medium">Error: {error}</div>;
    }
    return (
        <div className="px-8 md:px-20 py-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-screen">
            {isLoading ? (
                <div className="flex justify-center items-center w-screen min-h-screen bg-gray-50">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                        <span className="mt-4 text-gray-500 text-lg">Loading blog posts...</span>
                    </div>
                </div>

            ) : (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                                Blog Dashboard
                            </h1>
                            <p className="text-gray-600 mt-1 text-sm">
                                Welcome back, <span className="font-semibold text-gray-800">{user?.name}</span> 👋
                            </p>
                        </div>

                        {user && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md transition transform hover:scale-105 focus:outline-none"
                            >
                                + Add Blog
                            </button>
                        )}
                    </div>

                    <p className="text-gray-500 mb-8 text-sm">
                        Browse, view, edit, or delete your latest posts below.
                    </p>

                    {(!posts || posts?.length === 0) ? (
                        <div className="flex items-center justify-center w-screen h-screen bg-white rounded-xl shadow-inner text-gray-500 text-lg">
                            No blog posts found.
                        </div>
                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {posts?.map?.((post) => (
                                <div
                                    key={post?._id}
                                    className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group overflow-hidden"
                                >
                                    <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition">
                                            {post?.title}
                                        </h3>

                                        <div
                                            className="text-gray-600 text-sm mb-5 line-clamp-3 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: post?.content || "" }}
                                        />


                                        <div className="text-gray-400 text-xs flex justify-between items-center">
                                            <span>
                                                By{" "}
                                                <span className="font-medium text-gray-700">
                                                    {post.authorId?.name || "Unknown"}
                                                </span>
                                            </span>
                                            <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="absolute top-3 right-3 flex space-x-3 bg-white/70 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
                                        <button
                                            onClick={() => handleViewPost(post)}
                                            className="text-white hover:text-blue-600 transition"
                                            title="View Post"
                                        >
                                            <FaEye size={16} />
                                        </button>

                                        {post?.authorId?._id === user?.id && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdatePost(post)}
                                                    className="text-white hover:text-green-600 transition"
                                                    title="Edit Post"
                                                >
                                                    <FaPencilAlt size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePost(post)}
                                                    className="text-white hover:text-red-600 transition"
                                                    title="Delete Post"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <AddPostModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
                    <ViewPostModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} post={selectedPost} />
                    <UpdatePostModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} post={selectedPost} />
                    <DeletePostModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} post={selectedPost} />
                </>
            )}
        </div>
    );
};

export default Dashboard;
