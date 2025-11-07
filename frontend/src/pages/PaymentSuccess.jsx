import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/paymentSucces.css';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [groupData, setGroupData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [credentials, setCredentials] = useState(null);

  const sessionId = searchParams.get('session_id');
  const groupId = searchParams.get('group_id');

  console.log('🔍 PaymentSuccess montado - Session:', sessionId, 'Group:', groupId);

  useEffect(() => {
    console.log('useEffect ejecutándose');
    
    const verifyPaymentAndLoadData = async () => {
      try {
        console.log('Iniciando carga de datos...');
  
        if (!sessionId || !groupId) {
          console.error('Faltan sessionId o groupId');
          setStatus('error');
          return;
        }
  
        // 1. Obtener datos del grupo usando el endpoint PÚBLICO
        console.log('Obteniendo datos del grupo (endpoint público)...');
        const groupResponse = await fetch(`http://localhost:4000/api/groups/${groupId}/public?session_id=${sessionId}`);
  
        console.log('Group response status:', groupResponse.status);
        
        if (!groupResponse.ok) {
          const errorText = await groupResponse.text();
          console.error('Error obteniendo grupo:', groupResponse.status, errorText);
          setStatus('error');
          return;
        }
  
        const groupData = await groupResponse.json();
        console.log('Grupo obtenido:', groupData);
        setGroupData(groupData);
  
        // 2. Obtener datos del usuario desde el payment (ya viene en la respuesta)
        // El endpoint público ya verificó el pago y podemos usar esa información
        console.log('👤 Usando información del pago verificado');
        setUserData({ name: 'Usuario' }); // O puedes obtener más datos si los incluyes en la respuesta
  
        // 3. Procesar credenciales
        if (groupData.credentials) {
          try {
            console.log('Procesando credenciales...');
            const creds = JSON.parse(groupData.credentials);
            setCredentials(creds);
            console.log('Credenciales procesadas');
          } catch (e) {
            console.error('Error parseando credenciales:', e);
          }
        }
  
        console.log('Todo exitoso, mostrando página de éxito');
        setStatus('success');
  
      } catch (error) {
        console.error('Error general:', error);
        setStatus('error');
      }
    };
  
    verifyPaymentAndLoadData();
  }, [sessionId, groupId]);

  const handleAccessService = () => {
    if (groupData?.service?.loginUrl) {
      window.open(groupData.service.loginUrl, '_blank');
    } else {
      const serviceUrls = {
        'netflix': 'https://netflix.com',
        'spotify': 'https://spotify.com',
        'hbo': 'https://hbomax.com',
        'disney': 'https://disneyplus.com',
        'amazon': 'https://primevideo.com',
        'paramount': 'https://paramountplus.com'
      };

      const serviceKey = groupData?.platformName?.toLowerCase() || '';
      const url = serviceUrls[serviceKey] || 'https://google.com';
      window.open(url, '_blank');
    }
  };

  if (status === 'loading') {
    console.log('Renderizando estado: loading');
    return (
      <div className="payment-loading">
        <div className="payment-card">
          <div className="loading-spinner"></div>
          <h2 className="text-title">Verificando tu pago</h2>
          <p className="text-subtitle">Estamos confirmando tu acceso al grupo...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    console.log('Renderizando estado: error');
    return (
      <div className="payment-error">
        <div className="payment-card">
          <div className="status-icon error-icon">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-title">Error en el pago</h2>
          <p className="text-subtitle">Hubo un problema al procesar tu acceso. Por favor contacta a soporte.</p>
          <button 
            onClick={() => navigate('/')}
            className="access-button"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  console.log('Renderizando estado: success');
  return (
    <div className="payment-success-container">
      <div className="payment-success-content">
        {/* Header de éxito */}
        <div className="success-header">
          <div className="status-icon success-icon">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-title">
            ¡Bienvenido al grupo, {userData?.name || 'Usuario'}!
          </h1>
          <p className="text-subtitle">
            Ahora eres parte del grupo de <span className="text-blue text-bold">{groupData?.owner?.name}</span>
          </p>
          <p className="text-service">
            Servicio: <span className="text-bold">{groupData?.platformName}</span>
          </p>
        </div>

        {/* Credenciales de acceso */}
        <div className="credentials-container">
          <h2 className="text-title text-center">
            Credenciales de acceso
          </h2>
          
          <div className="space-y-4">
            <div className="credential-field">
              <label className="credential-label">Email:</label>
              <div className="credential-box">
                <div className="credential-content">
                  <span className="credential-text">
                    {credentials?.email || 'usuario@ejemplo.com'}
                  </span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(credentials?.email || '')}
                    className="copy-button"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>

            <div className="credential-field">
              <label className="credential-label">Contraseña:</label>
              <div className="credential-box">
                <div className="credential-content">
                  <span className="credential-text">
                    {credentials?.password ? '•'.repeat(credentials.password.length) : '••••••••'}
                  </span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(credentials?.password || '')}
                    className="copy-button"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="instructions-container">
          <h3 className="instructions-header">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Instrucciones de acceso
          </h3>
          <ul className="instructions-list">
            <li className="instruction-item">
              <span className="mr-2">•</span>
              Ve al sitio oficial de {groupData?.platformName}
            </li>
            <li className="instruction-item">
              <span className="mr-2">•</span>
              Usa las credenciales proporcionadas arriba
            </li>
            <li className="instruction-item">
              <span className="mr-2">•</span>
              No compartas estas credenciales con nadie
            </li>
            <li className="instruction-item">
              <span className="mr-2">•</span>
              Tu acceso es válido por 30 días
            </li>
          </ul>
        </div>

        {/* Botón de acceso */}
        <div className="text-center">
          <button 
            onClick={handleAccessService}
            className="access-button"
          >
            Acceder a {groupData?.platformName}
          </button>
          
          <button 
            onClick={() => navigate(`/groups/${groupId}`)}
            className="back-button"
          >
            ← Volver al grupo
          </button>
        </div>
      </div>
    </div>
  );
}
