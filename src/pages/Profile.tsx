import { HiOutlineSave, HiOutlineUpload } from "react-icons/hi";
import { InputWithLabel, Sidebar, SimpleInput, WhiteButton } from "../components";
import { useAppSelector } from "../hooks";

const Profile = () => {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Your Profile
              </h2>
            </div>
            {/* Profile update button or any other action */}
            <WhiteButton
              link="/profile"
              textSize="lg"
              width="48"
              py="2"
              text="Update profile"
            >
              <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
            </WhiteButton>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8">
            {/* Profile details section */}
            <div className="flex flex-col gap-4">
              {/* Example: Displaying user information */}
              <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-10">
                <div className="flex items-center gap-4">
                  <img
                    src="https://res.cloudinary.com/dahzoj4fy/image/upload/v1733244037/fg6rbhwjrx2cyrq6uc7i.png"
                    alt="Profile"
                    className="rounded-full w-20 h-20"
                  />
                  <div>
                    <p className="dark:text-whiteSecondary text-blackPrimary text-xl">
                    {user ? user.username : 'Guest'}
                    </p>
                    <p className="dark:text-whiteSecondary text-blackPrimary">
                      Admin
                    </p>
                  </div>
                </div>

                <button className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-72 py-2 text-lg dark:hover:border-gray-500 hover:border-gray-400 duration-200 flex items-center justify-center gap-x-2">
                  <HiOutlineUpload className="dark:text-whiteSecondary text-blackPrimary text-xl" />
                  <span className="dark:text-whiteSecondary text-blackPrimary font-medium">
                    Change profile picture
                  </span>
                </button>
              </div>
              {/* Additional sections like password change, email update, etc. */}
              <div className="flex flex-col gap-3 mt-5">
                <InputWithLabel label="Your username">
                  <SimpleInput
                    type="text"
                    placeholder="Your username"
                    value={user ? user.username : 'Guest'}
                  />
                </InputWithLabel>
                <InputWithLabel label="Your email">
                  <SimpleInput
                    type="text"
                    placeholder="Your email"
                    value={user ? user.username : 'minhtan@gmail.com'}

                  />
                </InputWithLabel>

              </div>
            </div>
          </div>
          {/* Notifications section, already implemented in the provided code */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
