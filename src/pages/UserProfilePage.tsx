import { useGetMyUser, useUpdateMyUser } from "@/api/MyUserApi";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";

const UserProfilePage = () => {
    const { updateUser, isLoading: isUpdateLoading } = useUpdateMyUser();

    const { currentUser, isLoading: isGetLoading } = useGetMyUser();

    if (isGetLoading) {
        return <span>Loading...</span>;
    }

    //early return
    if (!currentUser) {
        return <span>Unable to Load User Profile</span>;
    }

    return (
        <UserProfileForm
            currentUser={currentUser}
            onSave={updateUser}
            isLoading={isUpdateLoading}
        />
    );
};

export default UserProfilePage;
