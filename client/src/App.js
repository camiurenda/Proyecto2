import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import ProductList from './components/productList';
import CreateProduct from './components/CreateProduct';
import EditProduct from './components/EditProduct';
import UserList from './components/UserList';
import CreateUser from './components/CreateUser';
import EditUser from './components/EditUser';
import UserProducts from './components/UserProducts';
import UnauthorizedAccess from './components/UnauthorizedAccess';
import { Spin, Layout, Typography, Button, ConfigProvider, theme } from 'antd';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const [showUnauthorized, setShowUnauthorized] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowUnauthorized(true);
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (showUnauthorized) {
    return <UnauthorizedAccess onLogin={loginWithRedirect} />;
  }

  return isAuthenticated ? children : null;
};

const PublicHomePage = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const navigate = useNavigate();

  return (
    <Layout>
      <Content style={{ padding: '50px' }}>
        <Title>Bienvenido a TechMobile</Title>
        <Paragraph>
          TechMobile es tu destino para los últimos dispositivos móviles y accesorios.
          Ofrecemos una amplia gama de productos de alta calidad a precios competitivos.
        </Paragraph>
        {isAuthenticated ? (
          <>
            <Button type="primary" onClick={() => navigate('/products')}>
              Ver Productos
            </Button>
            <Button onClick={() => logout({ returnTo: window.location.origin })} style={{ marginLeft: '10px' }}>
              Cerrar Sesión
            </Button>
          </>
        ) : (
          <Button type="primary" onClick={() => loginWithRedirect()}>
            Iniciar Sesión
          </Button>
        )}
      </Content>
    </Layout>
  );
};

const App = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
          <Route path="/products/create" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
          <Route path="/products/:id/edit" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
          <Route path="/users/create" element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />
          <Route path="/users/:id/edit" element={<ProtectedRoute><EditUser /></ProtectedRoute>} />
          <Route path="/users/:id/products" element={<ProtectedRoute><UserProducts /></ProtectedRoute>} />
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Navigate to="/products" /> : <PublicHomePage />
            } 
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;