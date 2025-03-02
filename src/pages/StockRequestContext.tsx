import { createContext, useState, useContext, ReactNode } from "react";

interface ProductRequest {
  id: string;
  productName: string;
  size: string;
  price: number;
  quantity: number; // Entered in ConfirmRequest.tsx
}

interface Request {
  id: string;
  products: ProductRequest[];
  status: "Pending" | "Approved";
}

interface StockRequestContextType {
  requests: Request[];
  addRequest: (newRequest: Request) => void;
  approveRequest: (id: string, updatedQuantities: Record<string, number>) => void;
}

const StockRequestContext = createContext<StockRequestContextType | undefined>(undefined);

export const StockRequestProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<Request[]>([]);

  // Add a new request
  const addRequest = (newRequest: Request) => {
    setRequests((prev) => [...prev, newRequest]);
  };

  // Approve a request and update stock quantities
  const approveRequest = (id: string, updatedQuantities: Record<string, number>) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "Approved",
              products: req.products.map((product) => ({
                ...product,
                quantity: updatedQuantities[product.id] || product.quantity,
              })),
            }
          : req
      )
    );
  };

  return (
    <StockRequestContext.Provider value={{ requests, addRequest, approveRequest }}>
      {children}
    </StockRequestContext.Provider>
  );
};

export const useStockRequest = () => {
  const context = useContext(StockRequestContext);
  if (!context) {
    throw new Error("useStockRequest must be used within a StockRequestProvider");
  }
  return context;
};
