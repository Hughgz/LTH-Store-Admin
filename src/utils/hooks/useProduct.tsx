'use client';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, updateExistingProduct } from '../../redux/actions/productActions';
import { RootState } from '../../store';

interface ProductSize {
  size: string;
  price: number;
  quantity: number;
}
// Định nghĩa kiểu dữ liệu cho Product
interface Product {
  productID: string;
  name: string;
  imageURL: string;
  brand: string;
  productSizes: ProductSize[];
}

export const useProduct = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.product.products);
  const loading = useSelector((state: RootState) => state.product.loading);
  const error = useSelector((state: RootState) => state.product.error);
  const status = useSelector((state: RootState) => state.product.status);

  const fetchProductsHandler = () => {
    dispatch(fetchProducts() as any); // Cần đảm bảo đúng kiểu AsyncThunkAction
  };

  const createProductHandler = (product: Product) => {
    dispatch(createProduct({ product }) as any).then(() => {
      alert('Product has been added.');
    });
  };

  const updateExistingProductHandler = (productId: number, product: Product) => {
    dispatch(updateExistingProduct({ productId, product }) as any);
  };


  return { 
    fetchProducts: fetchProductsHandler, 
    createProduct: createProductHandler, 
    updateExistingProduct: updateExistingProductHandler,
    products, 
    loading, 
    error,
    status,  
  };
};

