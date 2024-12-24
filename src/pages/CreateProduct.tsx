import { ImageUpload, InputWithLabel, Sidebar } from "../components";
import { HiOutlineSave } from "react-icons/hi";
import { Link } from "react-router-dom";
import { AiOutlineSave } from "react-icons/ai";
import SimpleInput from "../components/SimpleInput";
import TextAreaInput from "../components/TextAreaInput";
import SelectInput from "../components/SelectInput";
import { selectList, stockStatusList } from "../utils/data";
import { useState } from "react";

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    imageURL: "",
    description: "",
    categoryID: 1,
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageUpload = async (file) => {
    const cloudinaryApi = "https://lthshop.azurewebsites.net/Cloudinary/upload";
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const response = await fetch(cloudinaryApi, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        handleInputChange("imageURL", result.url);
      } else {
        console.error("Upload failed:", result.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    const addProductApi = "https://lthshop.azurewebsites.net/api/Products";

    if (!formData.name || !formData.brand || !formData.imageURL) {
      alert("Please fill out all required fields!");
      return;
    }

    try {
      const response = await fetch(addProductApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Product added successfully!");
      } else {
        const result = await response.json();
        console.error("Error adding product:", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="hover:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Add new product
              </h2>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <button
                onClick={handleSubmit}
                className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-48 py-2 text-lg dark:hover:border-gray-500 hover:border-gray-400 duration-200 flex items-center justify-center gap-x-2"
              >
                <AiOutlineSave className="dark:text-whiteSecondary text-blackPrimary text-xl" />
                <span className="dark:text-whiteSecondary text-blackPrimary font-medium">
                  Save draft
                </span>
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Basic information
              </h3>

              <div className="mt-4 flex flex-col gap-5">
                <InputWithLabel label="Name">
                  <SimpleInput
                    type="text"
                    placeholder="Enter product name..."
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </InputWithLabel>

                <InputWithLabel label="Brand">
                  <SimpleInput
                    type="text"
                    placeholder="Enter product brand..."
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                  />
                </InputWithLabel>

                <InputWithLabel label="Description">
                  <TextAreaInput
                    placeholder="Enter product description..."
                    rows={4}
                    cols={50}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                </InputWithLabel>

                <InputWithLabel label="Category ID">
                  <SimpleInput
                    type="number"
                    placeholder="Enter category ID..."
                    value={formData.categoryID}
                    onChange={(e) =>
                      handleInputChange("categoryID", e.target.value)
                    }
                  />
                </InputWithLabel>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Product images
              </h3>

              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
                disabled={isUploading}
              />
              {isUploading && <p>Uploading image...</p>}
              {formData.imageURL && (
                <img
                  src={formData.imageURL}
                  alt="Product"
                  className="mt-4 w-32 h-32 object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateProduct;
