import React, { useState, useEffect } from 'react';
import { Table, Button, Layout, Pagination, message, Input, Select } from 'antd';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Option } = Select;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);  // Página actual
  const [perPage, setPerPage] = useState(50);  // Usuarios por página
  const [total, setTotal] = useState(0);  // Total de usuarios
  const [filter, setFilter] = useState({});
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [page, perPage, filter]);  // Recargar cuando cambie la página o el filtro

  // Función para obtener los usuarios desde la API con paginación
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        params: {
          page,  // Página actual
          perPage,  // Usuarios por página
          filter: JSON.stringify(filter),  // Filtro de búsqueda
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(response.data.data);  // Guardar usuarios
      setTotal(response.data.total);  // Total de usuarios
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Error al cargar los usuarios');
    }
    setLoading(false);
  };

  // Eliminar un usuario
  const deleteUser = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`${process.env.REACT_APP_API_URL}/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Usuario eliminado exitosamente');
      fetchUsers();  // Recargar la lista después de eliminar
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Error al eliminar el usuario');
    }
  };

  // Columnas de la tabla
  const columns = [
    { title: 'Nombre', dataIndex: 'firstname', key: 'firstname' },
    { title: 'Apellido', dataIndex: 'lastname', key: 'lastname' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Acciones',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button onClick={() => navigate(`/users/${record._id}/edit`)}>Editar</Button>
          <Button onClick={() => navigate(`/users/${record._id}/products`)}>Ver Productos</Button>
          <Button onClick={() => deleteUser(record._id)}>Eliminar</Button>
        </>
      ),
    },
  ];

  // Manejar la búsqueda
  const handleSearch = (value) => {
    setFilter({ firstname: { $regex: value, $options: 'i' } });  // Búsqueda por nombre
    setPage(0);  // Reiniciar a la primera página
  };

  // Manejar el cambio de página o de orden
  const handleTableChange = (pagination, filters, sorter) => {
    if (pagination) setPage(pagination.current - 1);
  };

  return (
    <Layout>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        <h1 style={{ color: 'white' }}>Usuarios</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={() => navigate('/users/create')} type="primary">Crear Usuario</Button>
          <Button onClick={() => navigate('/products')}>Ir a la lista de productos</Button>
        </div>
      </Header>
      <Content style={{ padding: '20px' }}>
        <Input.Search
          placeholder="Buscar por nombre"
          onSearch={handleSearch}
          style={{ marginBottom: 16 }}
        />
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          pagination={false}  // Desactivamos la paginación interna de Ant Design
          loading={loading}
          onChange={handleTableChange}  // Para manejar el cambio de página
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          <Select
            value={perPage}
            onChange={(value) => {
              setPerPage(value);
              setPage(0);  // Reiniciar a la primera página
            }}
            style={{ width: 120 }}
          >
            <Option value={5}>5 / página</Option>
            <Option value={10}>10 / página</Option>
            <Option value={20}>20 / página</Option>
            <Option value={50}>50 / página</Option>
          </Select>
          <Pagination
            current={page + 1}  // Paginación basada en 0 en la API, pero mostramos basada en 1
            total={total}
            pageSize={perPage}
            onChange={(newPage) => setPage(newPage - 1)}  // Ant Design es 1 basado, pero la API es 0 basado
            showSizeChanger={false}  // Opcional: Permitir cambiar el tamaño de página
          />
        </div>
      </Content>
    </Layout>
  );
};

export default UserList;
