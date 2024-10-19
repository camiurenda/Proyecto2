import React from 'react';
import { Typography, Card, Space, Button, Alert } from 'antd';
import { LockOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UnauthorizedAccess = ({ onLogin }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#141414'
    }}>
      <Card
        style={{ 
          width: 400, 
          textAlign: 'center',
          backgroundColor: '#1f1f1f',
          borderColor: '#303030'
        }}
        cover={
          <div style={{ 
            background: 'linear-gradient(135deg, #ff4b2b 0%, #ff416c 100%)', 
            height: 150, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center'
          }}>
            <LockOutlined style={{ fontSize: 60, color: 'white' }} />
          </div>
        }
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={3} style={{ color: 'white', margin: 0 }}>Acceso No Autorizado</Title>
          <Text type="secondary">
            Debes iniciar sesión para acceder a esta página.
          </Text>
          <Alert
            message={<Text strong style={{ color: 'white' }}>Autenticación requerida</Text>}
            description={
              <Text type="secondary">
                Por favor, inicia sesión para acceder al contenido protegido.
              </Text>
            }
            type="warning"
            icon={<WarningOutlined />}
            showIcon
          />
          <Button type="primary" icon={<LockOutlined />} onClick={onLogin}>
            Iniciar Sesión
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default UnauthorizedAccess;