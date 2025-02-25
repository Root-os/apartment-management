import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import ToogleInput from "../../../components/Input/ToogleInput";

function ProfileSettings() {
    const dispatch = useDispatch();
    const [profile, setProfile] = useState({
        fname: "",
        lname: "",
        email: "",
        role: "",
        phone: "",
        status: "",
        createdAt: "",
        updatedAt: "",
        deletedAt: null,
    });

    useEffect(() => {
        const fetchProfileFromLocalStorage = () => {
            const storedProfile = {
                fname: localStorage.getItem("fname") || "",
                lname: localStorage.getItem("lname") || "",
                email: localStorage.getItem("email") || "",
                role: localStorage.getItem("role") || "",
                phone: localStorage.getItem("phone") || "",
            };
            setProfile(storedProfile);
        };

        fetchProfileFromLocalStorage();
    }, []);

    // Call API to update profile settings changes
    const updateProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}auth/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    fname: profile.fname,
                    lname: profile.lname,
                    phone: profile.phone,
                    role: profile.role,
                }),
            });

            const data = await response.json();
            if (data.success) {
                dispatch(showNotification({ message: "Profile Updated", status: 1 }));
                // Update local storage with the new profile data
                localStorage.setItem("fname", profile.fname);
                localStorage.setItem("lname", profile.lname);
                localStorage.setItem("phone", profile.phone);
                localStorage.setItem("role", profile.role);
            } else {
                dispatch(showNotification({ message: "Failed to update profile", status: 0 }));
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            dispatch(showNotification({ message: "Failed to update profile", status: 0 }));
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText
                        labelTitle="First Name"
                        placeholder={profile.fname}
                        updateFormValue={({ value }) => updateFormValue({ updateType: "fname", value })}
                    />
                    <InputText
                        labelTitle="Last Name"
                        placeholder={profile.lname}
                        updateFormValue={({ value }) => updateFormValue({ updateType: "lname", value })}
                    />
                    <InputText
                        labelTitle="Email Id"
                        placeholder={profile.email}
                        updateFormValue={({ value }) => updateFormValue({ updateType: "email", value })}
                        disabled={true}
                    />
                    <InputText
                        labelTitle="Phone"
                        placeholder={profile.phone}
                        updateFormValue={({ value }) => updateFormValue({ updateType: "phone", value })}
                    />
                    {/* <div>
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
                    </div> */}
                </div>

                <div className="mt-16">
                    <button className="btn btn-primary float-right" onClick={() => updateProfile()}>
                        Update
                    </button>
                </div>
            </TitleCard>
        </>
    );
}

export default ProfileSettings;