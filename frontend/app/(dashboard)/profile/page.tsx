"use client";

import { useEffect, useState } from "react";
import ProfileForm from "@/components/ProfileForm";
import api from "@/hooks/useAxios";

interface ProfileData {
  username: string;
  email: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

const fetchProfile = async () => {
  try {
    const userString = localStorage.getItem("user");
    if (!userString) {
      console.error("No user in localStorage");
      return; // exit early
    }

    const user = JSON.parse(userString);
    const email: string = user.email; 
    const res = await api.get("/admin/profile", { params: { email } });
    setProfile(res.data.data);
  } catch (err) {
    console.error("Failed to fetch profile", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!profile) return <p className="text-center mt-10">Profile not found</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="mb-4 p-4 bg-white rounded shadow">
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>
      <button
        className="px-4 py-2 bg-black text-white rounded-full hover:cursor-pointer"
        onClick={() => setEditOpen(true)}
      >
        Edit Profile
      </button>

      {editOpen && profile && (
        <ProfileForm
          initialData={profile}
          onClose={() => setEditOpen(false)}
          onUpdate={fetchProfile}
        />
      )}
    </div>
  );
};

export default ProfilePage;
