import styles from "./styles.module.css";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Main = () => {
    const [postContent, setPostContent] = useState('');
    const [posts, setPosts] = useState([]);
    const [editingPostId, setEditingPostId] = useState(null); 
    const [editingContent, setEditingContent] = useState(''); 

    // Wczytanie postów
    useEffect(() => {
        fetchPosts();
        const czas = () => {
            localStorage.setItem('time', new Date(Date.now()).toLocaleString());
            fetchPosts();
            
        };
    
       
        
        const interval = setInterval(czas, 1000);
        
        return () => clearInterval(interval);
    }, []);

    // Funkcja do pobrania postów
    const fetchPosts = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/post/read");

            if (response.status === 200) {
                // Sortowanie według czasu utworzenia
                const sortedPosts = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setPosts(sortedPosts);
            }
        } catch (error) {
            console.error("Error during fetching posts:", error);
        }
    };

    // wysłanie nowego postu
    const handlePostSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/post/create", {
                content: postContent,
                email: localStorage.getItem("email"),
                date: Date.now()
            });

            if (response.status === 200) {
                //wczytanie postów
                fetchPosts();
                // Czyszczenie pola do wpisania treści postu
                setPostContent('');
            }
        } catch (error) {
            console.error("Error during creating a post:", error);
        }
    };

    // aktualizacja postu na serwerze
    const handleUpdatePost = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/api/post/update/${editingPostId}`, {
                content: editingContent,
                id: editingPostId,
                date: Date.now()
            });

            if (response.status === 200) {
                //wczytanie postów
                fetchPosts();
                // Zresetowanie stanu edycji
                setEditingPostId(null);
                setEditingContent('');
            }
        } catch (error) {
            console.error("Error during updating a post:", error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`http://localhost:8080/api/post/delete/${postId}`);
            fetchPosts(); 
        } catch (error) {
            console.error("Error during deleting a post:", error);
        }
    };

    const handleEditPost = (postId, content) => {
        setEditingPostId(postId);
        setEditingContent(content);
    };

    const handleCancelEdit = () => {
        setEditingPostId(null);
        setEditingContent('');
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <div>
                Witaj <Link to="/profile" className={styles.nameLink}>{localStorage.getItem('firstname')} {localStorage.getItem('lastname')}</Link>
                </div>
                <div id="xd">
                {localStorage.getItem('time')}
                </div>
                <div>
                <button className={styles.white_btn} onClick={handleLogout}>Logout</button>
                </div>
            </nav>
            {editingPostId ? (
                <div style={{ textAlign: 'center' }}>
                    <textarea value={editingContent} onChange={e => setEditingContent(e.target.value)} placeholder="Write your post content here..." />
                    <button onClick={handleUpdatePost}>Update Post</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                </div>
            ) : (
                
                <div style={{ textAlign: 'center' }}>
                    <textarea value={postContent} onChange={e => setPostContent(e.target.value)} placeholder="Write your post content here..." />
                    <br></br><button onClick={handlePostSubmit}>Submit Post</button>
                </div>
            )}
            <div>
                <table style={{ width: '100%', }}>
                    <thead>
                        <tr>
                            <th style={{ width: '25%' }}></th>
                            <th style={{ width: '50%' }}>Content</th>
                            <th style={{ width: '25%' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        <td></td>
                        <td></td>
                        <td></td>
                        {posts.map(post => (
    <tr key={post._id}>
        <td></td>
        <td style={{ border: '1px solid black', borderRadius: '10px', backgroundColor: 'rgb(232, 232, 232)' }}>
            <div
                
                style={post.email === localStorage.getItem('email')?({textAlign:"left"}):({textAlign:"right"})}
            >
                {post.email === localStorage.getItem('email') ? (
                    <><b>{post.email}</b> : {new Date(post.date).toLocaleString()}</>
                ) : (
                    <>{new Date(post.date).toLocaleString()} : <b>{post.email}</b></>
                )}
            </div>
            <div style={
    post.email === localStorage.getItem('email')
    ? { padding: '0 10px', textAlign: 'left'}  
    : { padding: '0 10px', textAlign: 'right' }  
}>
                {editingPostId === post._id ? (
                    <textarea value={editingContent} onChange={e => setEditingContent(e.target.value)} />
                ) : (
                    
                    post.content
                )}
            </div>
            <div style={{ textAlign: 'right', paddingRight: '10px', minHeight: '1.5em' }}>
                {post.email === localStorage.getItem('email') && (
                    <>
                        {editingPostId === post._id ? (
                            <>
                                <button onClick={handleUpdatePost}>Update</button>
                                <button onClick={handleCancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleEditPost(post._id, post.content)}>Edit</button>
                                <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                            </>
                        )}
                    </>
                )}
            </div>
        </td>
        <td></td>
    </tr>
))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Main;
