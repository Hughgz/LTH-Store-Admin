import { HiOutlineSearch } from "react-icons/hi";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

const SearchInput = ({ placeholder = "Search...", className = "" }: SearchInputProps) => {
  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="text"
        className="w-full h-10 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
        placeholder={placeholder}
      />
      <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-lg" />
    </div>
  );
};

export default SearchInput;
