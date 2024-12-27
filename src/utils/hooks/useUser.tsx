'use client';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, getUsers } from "../../redux/actions/userActions";
import { selectCurrentUser, selectError, selectIsLoading, selectToken } from "../../redux/reducers/userSlice";
import { AppDispatch } from "../../store";

export const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectToken);
  const currentUser = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const getUsersHandler = () => {
    dispatch(getUsers());
  };

  const getUserHandler = (userId: number) => {
    dispatch(getUser(userId));
  };

  useEffect(() => {
    if (token) {
      // Nếu token đã có, có thể thực hiện các hành động cần thiết như tải lại người dùng.
    }
  }, [token]);

  return {
    getUsers: getUsersHandler,
    getUser: getUserHandler,
    token,
    currentUser,
    isLoading,
    error,
  };
};
