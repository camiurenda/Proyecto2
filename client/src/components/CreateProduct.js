import React from 'react';
import { Form, Input, InputNumber, Button, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const { Content } = Layout;

const CreateProduct = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const onFinish = async (values) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.post(`${process.env.REACT_APP_API_URL}/products`, values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '50px' }}>
        <h1>Crear Nuevo Producto</h1>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="precio" label="Precio" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item name="descripcion" label="Descripción">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="categoria" label="Categoría" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Crear Producto
            </Button>
             <Button onClick={() => navigate('/products')}>Ir a la lista de productos</Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default CreateProduct;