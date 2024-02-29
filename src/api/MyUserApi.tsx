import { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CreateUserRequest = {
    auth0Id: string;
    email: string;
};

export const useCreateMyUser = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createMyUserRequest = async (user: CreateUserRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error("Failed to create user");
        }
    };

    const {
        mutateAsync: createUser,
        isLoading,
        isError,
        isSuccess,
    } = useMutation(createMyUserRequest);

    return {
        createUser,
        isLoading,
        isError,
        isSuccess,
    };
};

type UpdateMyUserRequest = {
    name: string;
    addressLine1: string;
    city: string;
    country: string;
};

export const useUpdateMyUser = () => {
    const { getAccessTokenSilently } = useAuth0();

    //create a fetch req
    const updateMyUserRequest = async (formData: UpdateMyUserRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error("Failed to update User");
        }

        return response.json();
    };

    // pass this fetch req to useMutation hook so that react-query can handle the req for us.
    const {
        mutateAsync: updateUser,
        isLoading,
        isSuccess,
        error,
        reset,
    } = useMutation(updateMyUserRequest);

    if (isSuccess) {
        toast.success("User profile Updated");
    }

    if (error) {
        toast.error(error.toString());
        reset(); //clears the error toast
    }

    //returing some so that component can use.
    return { updateUser, isLoading };
};

export const useGetMyUser = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getMyUserRequest = async (): Promise<User> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }

        return response.json();
    };

    // add this to useQuery so that it si managed by react-query
    const {
        data: currentUser,
        isLoading,
        error,
    } = useQuery("fetchCurrentUser", getMyUserRequest);

    if (error) {
        toast.error(error.toString());
    }
    return { currentUser, isLoading };
};
