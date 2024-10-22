import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Layout, Table, Button, Spin, message } from 'antd';

const { Content } = Layout;

const UserProducts = () => {
  const [userProducts, setUserProducts] = useState({ user: null, products: [] });
  const [loading, setLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/${id}/products`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserProducts(response.data);
      } catch (error) {
        console.error('Error fetching user products:', error);
        message.error('Error al cargar los productos del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProducts();
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
      render: (precio) => precio ? `$${precio.toLocaleString('es-AR')}` : 'N/A',
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

  const { user, products } = userProducts;

  return (
    <Layout>
      <Content className="p-8">
        {user && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              Productos de {user.firstname} {user.lastname}
            </h1>
            <p className="text-gray-400 mb-4">
              Email: {user.email} | Documento: {user.documento}
            </p>
            <p className="text-gray-400">
              Total de productos asociados: {products.length}
            </p>
          </div>
        )}

        {(!products || products.length === 0) ? (
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