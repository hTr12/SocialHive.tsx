import React, { useState, useRef } from "react";
import { addPost } from "./redux/slices/postsSlice";
import { login, logout } from "./redux/slices/userSlice";
import { registerUser } from "./redux/slices/userSlice";
import { addNotification, clearAllNotifications, markAsRead } from "./redux/slices/notificationsSlice";
import Post from "./components/Post";
import backgroundImage from "./assets/background.jpg";
import { Bell } from "lucide-react";
import { useClickOutside } from "./hooks/useClickOutside";
import { useAppDispatch, useAppSelector } from './redux/hooks';


const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts.posts);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const notifications = useAppSelector((state) => state.notifications.notifications);
  
  const [image, setImage] = useState<string>("");
  const [video, setVideo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [authForm, setAuthForm] = useState<"login" | "register">("login");
  const [authData, setAuthData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const notificationRef = useRef<HTMLDivElement>(null);
  useClickOutside(notificationRef, () => setShowNotifications(false));

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthData({
      ...authData,
      [e.target.name]: e.target.value
    });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (authForm === "login") {
        dispatch(login({ 
          username: authData.username, 
          password: authData.password 
        }));
        dispatch(addNotification({ 
          message: 'Logged in successfully', 
          type: 'success' 
        }));
      } else {
        if (authData.password !== authData.confirmPassword) {
          throw new Error("Passwords don't match");
        }
        
        const resultAction = await dispatch(registerUser({
          username: authData.username,
          email: authData.email,
          password: authData.password
        }));
        
        if (registerUser.fulfilled.match(resultAction)) {
          dispatch(addNotification({ 
            message: 'Registered successfully', 
            type: 'success' 
          }));
        } else if (registerUser.rejected.match(resultAction)) {
          throw new Error(resultAction.error.message || 'Registration failed');
        }
      }
    } catch (error: any) {
      dispatch(addNotification({ 
        message: error.message || 'Authentication failed', 
        type: 'error' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addNotification({ message: 'Logged out', type: 'info' }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result as string;
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 600;
        const scaleSize = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;
  
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          console.error("Failed to get canvas context.");
          return;
        }
  
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const resizedImage = canvas.toDataURL("image/jpeg", 0.8);
        setImage(resizedImage);
      };
  
      img.onerror = () => {
        dispatch(addNotification({ 
          message: 'Error loading image', 
          type: 'error' 
        }));
      };
    };
  
    reader.onerror = () => {
      dispatch(addNotification({ 
        message: 'Error reading file', 
        type: 'error' 
      }));
    };
  
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      dispatch(addNotification({ 
        message: 'Video must be less than 10MB', 
        type: 'error' 
      }));
      return;
    }
    
    const videoUrl = URL.createObjectURL(file);
    setVideo(videoUrl);
    dispatch(addNotification({ 
      message: 'Video uploaded successfully', 
      type: 'success' 
    }));
  };

  const handleAddPost = () => {
    if (!image && !video) {
      dispatch(addNotification({ 
        message: 'Please add an image or video', 
        type: 'error' 
      }));
      return;
    }

    if (!currentUser) {
      dispatch(addNotification({ 
        message: 'You must be logged in to post', 
        type: 'error' 
      }));
      return;
    }

    dispatch(addPost({
      id: Date.now(),
      image,
      video,
      likes: 0,
      dislikes: 0,
      comments: [],
      userId: currentUser.id,
      username: currentUser.username
    }));

    setImage("");
    setVideo("");
    dispatch(addNotification({ 
      message: 'Post created successfully', 
      type: 'success' 
    }));
  };

  const handleNotificationClick = (id: number) => {
    dispatch(markAsRead(id));
  };

  return (
    
<div 
  className="fixed inset-0 -z-10"
  style={{ 
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: -10, // Explicit z-index
    minHeight: "100vh",
    width: "100%",
    display:"flex",
    justifyContent:"center"
  }}
>

  <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white bg-opacity-90 rounded-lg shadow-lg">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold text-gray-800">📸 SocialHive <span>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              
                  <Bell className="h-6 w-6 text-gray-700" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                </span></h1> 
    
      {currentUser ? (
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-normal">
           
          <div className="relative" ref={notificationRef}>

                
                {showNotifications && notifications.length > 0 && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="flex justify-between items-center p-3 border-b">
                      <h3 className="font-medium">Notifications</h3>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(clearAllNotifications());
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Clear All
                      </button>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification.id)}
                          className={`p-3 border-b cursor-pointer transition ${
                            notification.read 
                              ? 'bg-white' 
                              : 'bg-blue-50'
                          }`}
                        >
                          <div className="flex justify-between">
                            <p className={`font-medium ${
                              notification.type === 'error' ? 'text-red-600' : 
                              notification.type === 'success' ? 'text-green-600' : 
                              notification.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                            }`}>
                              {notification.message}
                            </p>
                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.id).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium hidden sm:block">Welcome, {currentUser.username}</span>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={() => setAuthForm("login")} 
                className={`px-3 py-1 rounded-md transition ${authForm === "login" ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'} flex-1 sm:flex-none`}
              >
                Login
              </button>
              <button 
                onClick={() => setAuthForm("register")} 
                className={`px-3 py-1 rounded-md transition ${authForm === "register" ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'} flex-1 sm:flex-none`}
              >
                Register
              </button>
            </div>
          )}
        </div>

        {!currentUser ? (
          <div className="bg-white shadow-md p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {authForm === "login" ? "Login to your account" : "Create an account"}
            </h2>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={authData.username}
                  onChange={handleAuthChange}
                  placeholder="Enter your username"
                  className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {authForm === "register" && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={authData.email}
                    onChange={handleAuthChange}
                    placeholder="Enter your email"
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={authData.password}
                  onChange={handleAuthChange}
                  placeholder="Enter your password"
                  className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  minLength={6}
                />
              </div>

              {authForm === "register" && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={authData.confirmPassword}
                    onChange={handleAuthChange}
                    placeholder="Confirm your password"
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    minLength={6}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : authForm === "login" ? "Login" : "Register"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Create a new post</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                  <input
                    type="text"
                    placeholder="Paste image URL here"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    onClick={handleAddPost}
                    disabled={isLoading || (!image && !video)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Posting..." : "+ Create Post"}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Recent Posts</h2>
              {posts.length > 0 ? (
                posts.map((post) => <Post key={post.id} post={post} />)
              ) : (
                <p className="text-center text-gray-500 py-8">No posts available. Create your first post!</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;