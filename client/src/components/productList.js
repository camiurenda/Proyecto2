import React, { useState, useEffect } from 'react';
import { Table, Pagination, Input, message, Button, Layout, Select, Modal } from 'antd';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Option } = Select;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { getAccessTokenSilently, logout, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchUsers();
    }
  }, [page, perPage, filter, sort, isAuthenticated]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`, {
        params: {
          page,
          perPage,
          filter: JSON.stringify(filter),
          sort: JSON.stringify(sort)
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Error al cargar los productos: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };


  const assignProductToUser = async (productId) => {
    try {
      const token = await getAccessTokenSilently();
      const userId = prompt("Ingrese el ID del usuario para asignar este producto:");
      if (userId) {
        await axios.post(`${process.env.REACT_APP_API_URL}/user/${userId}/product/${productId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        message.success('Producto asignado al usuario exitosamente');
      }
    } catch (error) {
      console.error('Error assigning product to user:', error);
      message.error('Error al asignar producto al usuario');
    }
  };

  const fetchUsers = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Error al cargar los usuarios');
    }
  };

  const showAssignModal = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleAssign = async () => {
    if (selectedProduct && selectedUser) {
      try {
        const token = await getAccessTokenSilently();
        await axios.post(`${process.env.REACT_APP_API_URL}/user/${selectedUser}/product/${selectedProduct._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        message.success('Producto asignado exitosamente');
        setIsModalVisible(false);
      } catch (error) {
        console.error('Error assigning product:', error);
        message.error('Error al asignar el producto');
      }
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      sorter: true,
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
      sorter: true,
    },
    {
      title: 'Categoría',
      dataIndex: 'categoria',
      key: 'categoria',
      sorter: true,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button onClick={() => navigate(`/products/${record._id}/edit`)}>Editar</Button>
          <Button onClick={() => showAssignModal(record)}>Asignar a Usuario</Button>
        </>
      ),
    },
  ];

  const handleSearch = (value) => {
    setFilter({ nombre: { $regex: value, $options: 'i' } });
    setPage(0);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const newSort = {};
    if (sorter.field) {
      newSort[sorter.field] = sorter.order === 'descend' ? -1 : 1;
    }
    setSort(newSort);
    setPage(0);
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <Layout>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        <h1 style={{ color: 'white' }}>Productos</h1>
        <div>
          <Button onClick={() => navigate('/products/create')} type="primary" style={{ marginRight: '10px' }}>
            Crear Producto
          </Button>
          <Button onClick={() => navigate('/users')} type="default" style={{ marginRight: '10px' }}>
            Gestionar Usuarios
          </Button>
          <Button onClick={handleLogout} type="primary">Logout</Button>
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
          dataSource={products}
          rowKey="_id"
          pagination={false}
          loading={loading}
          onChange={handleTableChange}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          <Select
            value={perPage}
            onChange={(value) => {
              setPerPage(value);
              setPage(0);
            }}
            style={{ width: 120 }}
          >
            <Option value={5}>5 / página</Option>
            <Option value={10}>10 / página</Option>
            <Option value={20}>20 / página</Option>
            <Option value={50}>50 / página</Option>
          </Select>
          <Pagination
            current={page + 1}
            total={total}
            pageSize={perPage}
            onChange={(newPage) => setPage(newPage - 1)}
            showSizeChanger={false}
          />
        </div>
        <Modal
          title="Asignar Producto a Usuario"
          visible={isModalVisible}
          onOk={handleAssign}
          onCancel={() => setIsModalVisible(false)}
        >
          <Select
            style={{ width: '100%' }}
            placeholder="Seleccionar usuario"
            onChange={(value) => setSelectedUser(value)}
          >
            {users.map(user => (
              <Option key={user._id} value={user._id}>{`${user.firstname} ${user.lastname}`}</Option>
            ))}
          </Select>
        </Modal>
      </Content>
    </Layout>
  );
};

export default ProductList;