// frontend/src/pages/PaymentSuccess.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [groupData, setGroupData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [credentials, setCredentials] = useState(null);

  const sessionId = searchParams.get('session_id');
  const groupId = searchParams.get('group_id');

  useEffect(() => {
    const verifyPaymentAndLoadData = async () => {
      try {
        if (!sessionId || !groupId) {
          setStatus('error');
          return;
        }

        // 1. Verificar el pago
        const paymentResponse = await fetch(`http://localhost:4000/api/stripe/payment/verify/${sessionId}`);
        const paymentData = await paymentResponse.json();

        if (paymentData.status !== 'completed') {
          setStatus('error');
          return;
        }

        // 2. Obtener datos del grupo y usuario
        const groupResponse = await fetch(`http://localhost:4000/api/groups/${groupId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!groupResponse.ok) {
          setStatus('error');
          return;
        }

        const groupData = await groupResponse.json();
        setGroupData(groupData);

        // 3. Obtener datos del usuario actual
        const userResponse = await fetch('http://localhost:4000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserData(userData);
        }

        // 4. Decodificar credenciales
        if (groupData.credentials) {
          try {
            const creds = JSON.parse(groupData.credentials);
            setCredentials(creds);
          } catch (e) {
            console.error('Error parsing credentials:', e);
          }
        }

        setStatus('success');

      } catch (error) {
        console.error('Error:', error);
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Verificando tu pago</h2>
          <p className="text-gray-600">Estamos confirmando tu acceso al grupo...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Error en el pago</h2>
          <p className="text-gray-600 mb-6">Hubo un problema al procesar tu acceso. Por favor contacta a soporte.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-semibold transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header de éxito */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            ¡Bienvenido al grupo, {userData?.name || 'Usuario'}!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Ahora eres parte del grupo de <span className="font-semibold text-blue-600">{groupData?.owner?.name}</span>
          </p>
          <p className="text-lg text-gray-700">
            Servicio: <span className="font-bold">{groupData?.platformName}</span>
          </p>
        </div>

        {/* Credenciales de acceso */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Credenciales de acceso
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-gray-800">
                    {credentials?.email || 'usuario@ejemplo.com'}
                  </span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(credentials?.email || '')}
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña:</label>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-gray-800">
                    {credentials?.password ? '•'.repeat(credentials.password.length) : '••••••••'}
                  </span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(credentials?.password || '')}
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Instrucciones de acceso
          </h3>
          <ul className="text-yellow-700 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Ve al sitio oficial de {groupData?.platformName}
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Usa las credenciales proporcionadas arriba
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              No compartas estas credenciales con nadie
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Tu acceso es válido por 30 días
            </li>
          </ul>
        </div>

        {/* Botón de acceso */}
        <div className="text-center">
          <button 
            onClick={handleAccessService}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 font-bold text-lg shadow-lg transition-all transform hover:scale-105"
          >
            🚀 Acceder a {groupData?.platformName}
          </button>
          
          <button 
            onClick={() => navigate(`/groups/${groupId}`)}
            className="mt-4 text-gray-600 hover:text-gray-800 block mx-auto"
          >
            ← Volver al grupo
          </button>
        </div>
      </div>
    </div>
  );
}

// PropTypes para documentación (opcional)
PaymentSuccess.propTypes = {
  // No necesita props - usa URL parameters
};