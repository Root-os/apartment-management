import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import InputText from "../../../components/Input/InputText";
import Modal from "../../../components/Modal";
import api from "../../../utils/api";

function ProfileSettings() {
    const dispatch = useDispatch();
    const [profile, setProfile] = useState({
        fname: "",
        lname: "",
        email: "",
        role: "",
        phone: "",
    });
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalMessageType, setModalMessageType] = useState("");

    const token = localStorage.getItem("token");

    // Fetch user profile from /auth/me
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get(
                    `/auth/me`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (data.success) {
                    const user = data.user;
                    setProfile({
                        fname: user.fname,
                        lname: user.lname,
                        email: user.email,
                        role: user.roleId === 1 ? "admin" : "employee",
                        phone: user.phone,
                    });
                } else {
                    setModalMessageType("error");
                    setModalMessage("Failed to fetch profile");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                setModalMessageType("error");
                setModalMessage("Failed to fetch profile");
            }
        };

        fetchProfile();
    }, []);

    const updateProfile = async () => {
        try {
            const { data } = await api.put(
                `/auth/update`,
                {
                    fname: profile.fname,
                    lname: profile.lname,
                    phone: profile.phone,
                    role: profile.role,
                    email: profile.email,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                dispatch(showNotification({ message: "Profile Updated", status: 1 }));
                setModalMessageType("success");
                setModalMessage("Profile updated successfully.");

                const user = data.user;
                setProfile({
                    fname: user.fname,
                    lname: user.lname,
                    email: user.email,
                    role: user.roleId === 1 ? "admin" : "employee",
                    phone: user.phone,
                });
            } else {
                setModalMessageType("error");
                setModalMessage(data.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setModalMessageType("error");
            setModalMessage(error.response?.data?.message || "Failed to update profile.");
        }
    };

    const changePassword = async () => {
        if (currentPassword === newPassword) {
            setPasswordError("New password should be different from the current password.");
            return;
        }

        try {
            const { data } = await api.put(
                `/auth/change-password`,
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

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
            setPasswordError(error.response?.data?.message || "Failed to change password.");
        }
    };

    const updateFormValue = ({ updateType, value }) => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            [updateType]: value,
        }));
    };

    return (
        <>
            <TitleCard title="Profile Settings" topMargin="mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputText
                        labelTitle="First Name"
                        value={profile.fname}
                        updateFormValue={({ value }) => updateFormValue({ updateType: "fname", value })}
                    />
                    <InputText
                        labelTitle="Last Name"
                        value={profile.lname}
                        updateFormValue={({ value }) => updateFormValue({ updateType: "lname", value })}
                    />
                    <InputText
                        labelTitle="Email Id"
                        value={profile.email}
                        updateFormValue={({ value }) => updateFormValue({ updateType: "email", value })}
                        // disabled={true}
                    />
                    <InputText
                        labelTitle="Phone"
                        value={profile.phone}
                        updateFormValue={({ value }) => updateFormValue({ updateType: "phone", value })}
                    />
                    <div>
                        <label className="label">
                            <span className="label-text">Role</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={profile.role}
                            onChange={(e) => updateFormValue({ updateType: "role", value: e.target.value })}
                        >
                            <option value="admin">Admin</option>
                            <option value="employee">Employee</option>
                        </select>
                    </div>
                </div>

                <div className="mt-16">
                    <button className="btn btn-primary float-right" onClick={updateProfile}>
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
                    <button className="btn btn-primary float-right" onClick={changePassword}>
                        Change Password
                    </button>
                </div>
            </TitleCard>

            {/* Success/Error Modal */}
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
