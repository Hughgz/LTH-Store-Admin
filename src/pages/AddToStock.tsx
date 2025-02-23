import { Sidebar, InputWithLabel } from "../components";
import { HiOutlineSave } from "react-icons/hi";
import SimpleInput from "../components/SimpleInput";
import SelectInput from "../components/SelectInput";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  color: string;
  price: number;
  material: string;
  imageURL: string;
  sizes: string[];
  stock: Record<string, number>;
  supplier: string;
  dateReceived: string;
}

const productList: Product[] = [
  {
    id: "1",
    name: "Nike Air Max 270",
    category: "Shoes",
    brand: "Nike",
    description: "A comfortable running shoe.",
    color: "Black/White",
    price: 150,
    material: "Mesh and rubber",
    imageURL: "https://example.com/nike270.jpg",
    sizes: ["US 7", "US 8", "US 9", "US 10"],
    stock: { "US 7": 15, "US 8": 20, "US 9": 10, "US 10": 5 },
    supplier: "Nike Inc.",
    dateReceived: "2024-02-15",
  },
  {
    id: "2",
    name: "Adidas Ultraboost 22",
    category: "Shoes",
    brand: "Adidas",
    description: "High-performance sports shoe.",
    color: "Blue/White",
    price: 180,
    material: "Primeknit and rubber",
    imageURL: "https://example.com/adidasultraboost.jpg",
    sizes: ["US 6", "US 7", "US 8", "US 9"],
    stock: { "US 6": 12, "US 7": 18, "US 8": 25, "US 9": 8 },
    supplier: "Adidas AG",
    dateReceived: "2024-02-10",
  },
];

const AddToStock: React.FC = () => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("US 7");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);


  const handleConfirmStock = () => {
    setShowInvoice(true);
  };

  const handleRequestSubmission = () => {
    if (selectedProduct && selectedSize && quantity) {
      console.log(`Requested ${quantity} units of ${selectedProduct.name} (Size: ${selectedSize})`);
      alert(`Request submitted for ${quantity} units of ${selectedProduct.name} (Size: ${selectedSize})`);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-auto border-t border-blackSecondary flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full py-10">
        <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">
            Add to Stock
          </h2>
          <button
            onClick={handleConfirmStock}
            className="dark:bg-whiteSecondary bg-blackPrimary w-48 py-2 text-lg flex items-center justify-center gap-x-2 dark:hover:bg-white hover:bg-blackSecondary duration-200"
          >
            <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
            <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
              Stock Invoice
            </span>
          </button>
        </div>
        {showInvoice && (
          <div className="flex gap-6 p-6">
            <div className="w-1/2 bg-gray-100 p-4 rounded-md dark:bg-gray-800">
              {selectedProduct ? (
                <div>
                  <InputWithLabel label="Product Name">
                    <SimpleInput type="text" value={selectedProduct.name} readOnly />
                  </InputWithLabel>
                  <InputWithLabel label="Price">
                    <SimpleInput type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </InputWithLabel>
                  <InputWithLabel label="Size">
                    <SelectInput
                      selectList={selectedProduct.sizes.map((size) => ({ label: size, value: size }))}
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Quantity">
                    <SimpleInput
                      type="number"
                      placeholder="Enter quantity..."
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </InputWithLabel>
                  <button
                    onClick={handleRequestSubmission}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Submit Request
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">Select a product to view details</p>
              )}
            </div>
            <div className="w-1/2 bg-gray-200 p-4 rounded-md dark:bg-gray-700">
              <InputWithLabel label="Search Product">
                <SimpleInput
                  type="text"
                  placeholder="Enter product name..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </InputWithLabel>
              <div className="mt-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="cursor-pointer p-2 bg-white dark:bg-gray-600 rounded-md mb-2 hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      {product.name}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No products found</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToStock;
