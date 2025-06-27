import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import InputText from "../../../components/Input/InputText";
import Modal from "../../../components/Modal";
import axios from "axios";

function ProfileSettings() {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalMessageType, setModalMessageType] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}tenant-auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const { fullName, email, phoneNumber } = response.data.tenant;
          setProfile({ fullName, email, phoneNumber });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}tenant-auth/profile`,
        {
          fullName: profile.fullName,
          phoneNumber: profile.phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        dispatch(showNotification({ message: "Profile Updated", status: 1 }));
        setModalMessageType("success");
        setModalMessage("Profile updated successfully.");
      } else {
        setModalMessageType("error");
        setModalMessage("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setModalMessageType("error");
      setModalMessage("Failed to update profile.");
    }
  };

  const changePassword = async () => {
    if (currentPassword === newPassword) {
      setPasswordError(
        "New password should be different from the current password."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}tenant-auth/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data.success) {
        setCurrentPassword("");
        setNewPassword("");
        setPasswordError("");
        setModalMessageType("success");
        setModalMessage("Password changed successfully.");
      } else {
        setPasswordError(data.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError("Failed to change password.");
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setProfile((prev) => ({
      ...prev,
      [updateType]: value,
    }));
  };

  return (
    <>
      <TitleCard title="Profile Settings" topMargin="mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputText
            labelTitle="Full Name"
            value={profile.fullName}
            updateType="fullName"
            updateFormValue={({ updateType, value }) =>
              setProfile((prev) => ({ ...prev, [updateType]: value }))
            }
          />

          <InputText
            labelTitle="Phone Number"
            value={profile.phoneNumber}
            updateType="phoneNumber"
            updateFormValue={({ updateType, value }) =>
              setProfile((prev) => ({ ...prev, [updateType]: value }))
            }
          />

          <InputText
            labelTitle="Email"
            placeholder="Enter email"
            value={profile.email}
            disabled={true}
          />
        </div>

        <div className="mt-16">
          <button
            className="btn btn-primary float-right"
            onClick={updateProfile}
          >
            Update
          </button>
        </div>
      </TitleCard>

      <TitleCard title="Change Password" topMargin="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputText
            labelTitle="Current Password"
            type="password"
            value={currentPassword}
            updateFormValue={({ value }) => setCurrentPassword(value)}
          />
          <InputText
            labelTitle="New Password"
            type="password"
            value={newPassword}
            updateFormValue={({ value }) => setNewPassword(value)}
          />
          {passwordError && (
            <div className="col-span-2 text-red-500">{passwordError}</div>
          )}
        </div>

        <div className="mt-16">
          <button
            className="btn btn-primary float-right"
            onClick={changePassword}
          >
            Change Password
          </button>
        </div>
      </TitleCard>

      <Modal
        isOpen={modalMessage !== ""}
        onClose={() => setModalMessage("")}
        messageType={modalMessageType}
        message={modalMessage}
        actions={[
          {
            label: "Close",
            onClick: () => setModalMessage(""),
            className: "bg-blue-500 text-white px-4 py-2 rounded",
          },
        ]}
      />
    </>
  );
}

export default ProfileSettings;
