import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, Layout } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const { Content } = Layout;

const EditProduct = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        form.setFieldsValue(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id, form, getAccessTokenSilently]);

  const onFinish = async (values) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.put(`${process.env.REACT_APP_API_URL}/products/${id}`, values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/products');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '50px' }}>
        <h1>Editar Producto</h1>
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
              Actualizar Producto
            </Button>
            <Button onClick={() => navigate('/products')}>Ir a la lista de productos</Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default EditProduct;