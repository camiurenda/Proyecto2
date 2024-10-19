import React from 'react';
import { Form, Input, Button, Layout, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const { Content } = Layout;

const CreateUser = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();


  const fetchUsers = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Users fetched from API:', response.data.data);
      // Aquí puedes actualizar el estado de los usuarios si es necesario
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Error al cargar los usuarios');
    }
  };

  const onFinish = async (values) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.post(`${process.env.REACT_APP_API_URL}/user`, values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Usuario creado exitosamente');
      fetchUsers();
      navigate('/users');
    } catch (error) {
      console.error('Error creando el usuario:', error);
      message.error('Error al crear usuario');
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '50px' }}>
        <h1>Crear Nuevo Usuario</h1>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="firstname" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastname" label="Apellido" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="domicilio" label="Domicilio">
            <Input />
          </Form.Item>
          <Form.Item name="celular" label="Celular">
            <Input />
          </Form.Item>
          <Form.Item name="documento" label="Documento">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Crear Usuario
            </Button>
            <Button onClick={() => navigate('/users')}>Ir a la lista de usuarios</Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default CreateUser;