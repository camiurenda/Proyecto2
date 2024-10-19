import React, { useState, useEffect } from 'react';
import { Table, Button, Layout, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const { Content } = Layout;

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchUserProducts();
  }, [id]);

  const fetchUserProducts = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.productos || []);
    } catch (error) {
      console.error('Error fetching user products:', error);
      message.error('Error al cargar los productos del usuario');
    }
    setLoading(false);
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
    },
    {
      title: 'Categoría',
      dataIndex: 'categoria',
      key: 'categoria',
    },
  ];

  return (
    <Layout>
      <Content style={{ padding: '50px' }}>
        <h1>Productos del Usuario</h1>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="_id"
          loading={loading}
        />
        <Button onClick={() => navigate('/users')}>Volver a la lista de usuarios</Button>
        <Button onClick={() => navigate('/products')}>Ir a la lista de productos</Button>
      </Content>
    </Layout>
  );
};

export default UserProducts;