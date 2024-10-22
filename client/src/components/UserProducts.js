import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Table, Button, Spin } from 'antd';

const { Content } = Layout;

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndProducts = async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        
        const userResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(userResponse.data);

        const productPromises = userResponse.data.productos.map(productId =>
          axios.get(
            `${process.env.REACT_APP_API_URL}/products/${productId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        );

        const productResponses = await Promise.all(productPromises);
        const fullProducts = productResponses.map(response => response.data);
        setProducts(fullProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndProducts();
  }, [id, getAccessTokenSilently]);

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
      render: (precio) => `$${precio.toLocaleString('es-AR')}`,
    },
    {
      title: 'Categoría',
      dataIndex: 'categoria',
      key: 'categoria',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
      ellipsis: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout>
      <Content className="p-8">
        {user && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              Productos de {user.firstname} {user.lastname}
            </h1>
            <p className="text-gray-400">
              Email: {user.email} | Documento: {user.documento}
            </p>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-8">
            <h2 className="text-xl text-gray-500">
              Este usuario no tiene productos asignados
            </h2>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={products}
            rowKey="_id"
            pagination={false}
            className="mb-6"
          />
        )}

        <div className="flex gap-4">
          <Button 
            onClick={() => navigate('/users')}
            className="mr-4"
          >
            Volver a la lista de usuarios
          </Button>
          <Button 
            onClick={() => navigate('/products')}
            type="primary"
          >
            Ir a la lista de productos
          </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default UserProducts;