import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"

import { type IPosts } from "../../interfaces/dashboard";
import axios from "axios";

function DashboardId() {
    const { id } = useParams()
    const [loading, setLoading] = useState(true)

    const [post, setPost] = useState<IPosts | null>(null)

    useEffect(() => {
        axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
            .then((response) => {

                if (response.status !== 200) {
                    throw new Error("Failed to fetch post")
                }

                if (!response.data) {
                    throw new Error("Post not found")
                }

                else {
                    setPost(response.data)
                    setLoading(false)
                }

            })
            .catch((error) => {
                console.error("Error fetching dashboards", error)
                setLoading(false)
            });
    }, [id]);


    if (loading) {
        return <div>Thinking...</div>
    }

    if (!post || !post.id) {
        return <div>Post not found</div>
    }

    return (
        <>
            <h1>Posts</h1>
            <ul>
                <li key={post.id} >
                    <h2>{post.title}</h2>
                    <p>{post.body}</p>
                    <br />
                </li>
            </ul >

            <Link to="/">Voltar ao Início</Link>
        </>
    )
}

export default DashboardId
