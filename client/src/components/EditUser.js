import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Layout, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import AssignProductToUser from './AssignProductToUser';

const { Content } = Layout;

const EditUser = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const { getAccessTokenSilently } = useAuth0();
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            form.setFieldsValue(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
            message.error('Error al cargar los datos del usuario');
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id, getAccessTokenSilently]);

    const onFinish = async (values) => {
        console.log("Valores enviados:", values); // Verifica los valores que se están enviando
        try {
            const token = await getAccessTokenSilently();
            await axios.put(`${process.env.REACT_APP_API_URL}/user/${id}`, values, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success('Usuario actualizado exitosamente');
            navigate('/users');
        } catch (error) {
            console.error('Error updating user:', error);
            message.error('Error al actualizar usuario');
        }
    };

    return (
        <Layout>
            <Content style={{ padding: '50px' }}>
                <h1>Editar Usuario</h1>
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
                            Actualizar Usuario
                        </Button>
                    </Form.Item>
                </Form>
                {user && (
                    <AssignProductToUser
                        userId={id}
                        onAssign={() => {
                            message.success('Producto asignado. Actualizando lista...');
                            fetchUser();
                        }}
                    />
                )}
            </Content>
        </Layout>
    );
};

export default EditUser;