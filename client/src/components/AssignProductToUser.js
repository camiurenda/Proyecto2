import React, { useState } from 'react';
import { Select, Button, message } from 'antd';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const { Option } = Select;

const AssignProductToUser = ({ userId, onAssign }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  const searchProducts = async (value) => {
    if (value) {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`, {
          params: { 
            filter: JSON.stringify({ nombre: { $regex: value, $options: 'i' } }),
            perPage: 10
          },
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error searching products:', error);
      }
    } else {
      setProducts([]);
    }
  };
//
  const handleAssign = async () => {
    if (selectedProduct) {
      try {
        const token = await getAccessTokenSilently();
        await axios.post(`${process.env.REACT_APP_API_URL}/user/${userId}/product/${selectedProduct}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        message.success('Producto asignado exitosamente');
        onAssign();
      } catch (error) {
        console.error('Error assigning product:', error);
        message.error('Error al asignar el producto');
      }
    }
  };

  return (
    <div>
      <Select
        showSearch
        placeholder="Buscar producto"
        onSearch={searchProducts}
        onChange={setSelectedProduct}
        style={{ width: 300 }}
      >
        {products.map(product => (
          <Option key={product._id} value={product._id}>{product.nombre}</Option>
        ))}
      </Select>
      <Button onClick={handleAssign} disabled={!selectedProduct}>
        Asignar Producto
      </Button>
    </div>
  );
};

export default AssignProductToUser;