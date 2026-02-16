import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const [user, setUser] = useState({});

  // fetches the user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/get_user_data/get_username/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        setUser({
          username: response.data.userdata[0]["username"].split("@")[0],
          email: response.data.userdata[0]["email"],
        });
      } catch (error) {
        console.error("Profile fetch failed", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen pt-28 px-4 bg-gradient-to-br from-primary via-blue-600 to-accent flex justify-center items-start">
      <div className="w-full max-w-xl flex flex-col items-center bg-white p-7 rounded-2xl">
        <div className="h-24 w-24 rounded-full flex items-center justify-center mb-4 border border-cyan-500">
          <FontAwesomeIcon icon={faUser} className="text-cyan-500 text-4xl" />
        </div>

        <h1 className="text-3xl font-semibold text-cyan-500 mb-8">Profile</h1>

        <div className="w-full bg  rounded-xl overflow-hidden border border-cyan-500 bg-white">
          <div className="px-6 py-4 border-b border-cyan-500">
            <p className="text-sm text-black ">Username*</p>
            <p className="text-lg font-medium text-cyan-500 ">
              {user.username}
            </p>
          </div>
          <div className="px-6 py-4">
            <p className="text-sm text-black">Email ID*</p>
            <p className="text-lg font-medium text-cyan-500 ">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
