import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { Navigate, useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import { toast, Toaster } from "sonner";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Card from "./card";
import axios from "axios";

const baseurl = import.meta.env.VITE_API_URL;

const Home = () => {
  const [images, setImages] = useState([{ title: '', description: '', file: null }]);

  const [form, setForm] = useState(false);
  const [form2, setForm2] = useState(false);
  const [settings, setSettings] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cards, setCards] = useState([]);
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchPosts = async () => {
        try {
            const response = await axiosInstance.get(`${baseurl}/api/get_posts/`);
            const transformedPosts = response.data.map(post => ({
              id: post.id,
              title: post.title,
              description: post.content,
              image: post.images.length > 0 ? `http://localhost:8000${post.images[0].image}` : null
          }));
          console.log(transformedPosts)
          setCards(transformedPosts);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Failed to fetch posts');
        }
    };

    fetchPosts();
}, [form]);


  const addImageInput = () => {
    setImages([...images, { title: "", description: "", file: null }]);
  };

  const handleChangePasswordClick = () => {
    setForm(false); // Hide Add Post form
    setForm2(!form2); // Show Change Password form
  };

  const handleAddPostClick = () => {
    setForm(!form); // Show Add Post form
    setForm2(false); // Hide Change Password form
  };

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newImages = [...images];
    newImages[index][name] = value;
    setImages(newImages);
  };

  const handleFileChange = (index, event) => {
    const newImages = [...images];
    newImages[index].file = event.target.files[0]; // Get the selected file
    setImages(newImages);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData();
    images.forEach((image) => {
        formData.append('title', image.title); // Use a single 'titles' key
        formData.append('content', image.description); // Use a single 'descriptions' key
        if (image.file) {
            formData.append('images', image.file); // Append each image file
        }
    });

    try {
        const response = await axiosInstance.post(`${baseurl}/upload/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status >= 200 && response.status < 300) {
          toast.success('Data uploaded successfully')
          setForm(false)
          setSettings(false)
      } else {
          toast.error('Unexpected response code')
      }
    } catch (error) {
        console.error('Error uploading data:', error);
    }
};

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/change_password/", {
        old_password: currentPassword,
        new_password: newPassword,
      });
      if (response.data["message"] === "Password changed successfully.") {
        setForm2(false);
        toast.success("password changed successfully");
        setCurrentPassword("");
        setConfirmPassword("");
        setNewPassword("");
      }
    } catch (err) {
      console.log(err);
      toast.warning("password error");
    }
  };

  const onDragEnd = async(result) => {
    if (!result.destination) return null;

    

    const newCards = Array.from(cards);
    const [reorderedCard] = newCards.splice(result.source.index, 1);
    newCards.splice(result.destination.index, 0, reorderedCard);

    if (newCards === cards) return null;
    setCards(newCards);
    console.log(newCards)
    console.log(cards)

    

    const formData = new FormData();
    newCards.forEach((card) => {
    formData.append('title', card.title); // Use a single 'titles' key
    formData.append('content', card.description); // Use a single 'descriptions' key
    if (card.image) {
      const splitUrl = card.image.split('/media/');
      const mediaPath = splitUrl[1];
      const fullMediaPath = `${mediaPath}`;
      formData.append('images', mediaPath); // Append each image file
    }
  });

  try {
      
      await axiosInstance.post(`${baseurl}/reordered_upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Order and data uploaded successfully');
  } catch (error) {
    console.error('Error uploading data:', error);
  }
  };

  return (
    <div className="bg-black min-h-screen ">
      <div className="fixed">
        <Toaster richColors position="top-right" />
      </div>
      <div className=" flex justify-end p-4">
        <div
          className="text-gray-700 hover:scale-125 duration-300 hover:text-gray-500 cursor-pointer flex justify-end p-8"
          onClick={() => setSettings(!settings)}
        >
          <FontAwesomeIcon icon={faCog} size="lg" />
        </div>
        {settings && (
          <div className="bg-black border-2 border-gray-800 hover:scale-105 duration-500 text-white mt-20 absolute p-4">
            <div
              className="p-2  hover:bg-gray-900 duration-300 font-mono"
              onClick={handleChangePasswordClick}
            >
              Change Password
            </div>
            <div
              className="p-2 hover:bg-gray-900 duration-300 font-mono"
              onClick={handleAddPostClick}
            >
              Add Post
            </div>
            <div
              className="p-2 hover:bg-gray-900 duration-300 font-mono"
              onClick={handleLogout}
            >
              LogOut
            </div>
          </div>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6 rounded-lg"
            >
              {cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${snapshot.isDragging ? "z-10" : ""}`}
                      style={{
                        ...provided.draggableProps.style,
                        height: "380px", // Set a fixed height for consistency
                      }}
                    >
                      <Card
                        image={card.image}
                        title={card.title}
                        description={card.description}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div>
        {form && (
          <div className="max-w-xl mx-auto p-5 fixed inset-0 border-2 no-scrollbar rounded-2xl bg-black overflow-scroll scroll-smooth">
            <h2 className="text-2xl font-bold text-white text-center mb-4">
              Add Post
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {images.map((image, index) => (
                <div key={index} className="border p-4 rounded shadow">
                  <h2 className="font-semibold">Image {index + 1}</h2>
                  <label className="block">
                    Title:
                    <input
                      type="text"
                      name="title"
                      value={image.title}
                      onChange={(e) => handleChange(index, e)}
                      className="mt-1 block w-full border rounded-md p-2"
                      placeholder="Enter image title"
                      required
                    />
                  </label>
                  <label className="block mt-2">
                    Description:
                    <textarea
                      name="description"
                      value={image.description}
                      onChange={(e) => handleChange(index, e)}
                      className="mt-1 block w-full border rounded-md p-2"
                      placeholder="Enter image description"
                      required
                    />
                  </label>
                  <label className="block mt-2">
                    Upload Image:
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(index, e)}
                      className="mt-1 block w-full border rounded-md p-2"
                      required
                    />
                  </label>
                </div>
              ))}
              <div className="flex gap-5 justify-end">
                <button
                  type="button"
                  onClick={addImageInput}
                  className="bg-blue-500 text-white rounded-md px-4 py-2"
                >
                  Add post
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white rounded-md px-4 py-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {form2 && (
        <div className="max-w-md mx-auto p-6 fixed inset-0 h-fit m-10 bg-black border-2 shadow-lg rounded-lg ">
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Change Password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {error && <div className="text-red-600">{error}</div>}
            {success && <div className="text-green-600">{success}</div>}

            <label className="block">
              <span className="text-gray-700">Current Password:</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                required
              />
            </label>

            <label className="block">
              <span className="text-gray-700">New Password:</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                required
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Confirm New Password:</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-200"
            >
              Change Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;
