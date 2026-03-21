import { useState, useCallback } from 'react';
import * as productsApi from '../api/products';

/**
 * Custom hook for Product data management.
 * Encapsulates all product API calls and local state.
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.getProducts();
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.getProductById(id);
      setSelectedProduct(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (data) => {
    const res = await productsApi.createProduct(data);
    setProducts((prev) => [res.data, ...prev]);
    return res.data;
  }, []);

  const updateProduct = useCallback(async (id, data) => {
    const res = await productsApi.updateProduct(id, data);
    setProducts((prev) => prev.map((p) => (p._id === id ? res.data : p)));
    return res.data;
  }, []);

  const archiveProduct = useCallback(async (id) => {
    await productsApi.archiveProduct(id);
    await fetchProducts();
  }, [fetchProducts]);

  return {
    products, selectedProduct, loading, error,
    fetchProducts, fetchProductById, createProduct, updateProduct, archiveProduct,
  };
};
