import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [cidade, setCidade] = useState(''); // Estado para a cidade
  const [clima, setClima] = useState(null); // Estado para armazenar os dados do clima
  const [erro, setErro] = useState(null); // Estado para armazenar o erro

  // Função para buscar o clima
  const buscarClima = () => {
    setErro(null); // Limpar erro anterior ao buscar o clima
    console.log('Buscando clima para:', cidade); // Exibe a cidade digitada
    const apiKey = 'b327ba760699b46c7aef0f7e35ed1ff9'; // Substitua pela sua chave de API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;

    axios.get(url)
      .then(response => {
        setClima(response.data); // Atualiza o estado com os dados recebidos
      })
      .catch(error => {
        setErro('Cidade não encontrada ou erro na requisição.'); // Define o erro
        console.error('Erro ao buscar o clima:', error);
      });
  };

  // Função para obter a previsão do tempo para os próximos 5 dias
  const buscarPrevisao5Dias = () => {
    setErro(null);
    const apiKey = 'b327ba760699b46c7aef0f7e35ed1ff9'; // Substitua pela sua chave de API
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;

    axios.get(url)
      .then(response => {
        setClima(response.data); // Atualiza o estado com os dados de previsão
      })
      .catch(error => {
        setErro('Erro ao buscar a previsão para os próximos 5 dias.');
        console.error('Erro na previsão:', error);
      });
  };

  // Função para buscar o clima pela localização atual
  const buscarClimaPorLocalizacao = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const apiKey = 'b327ba760699b46c7aef0f7e35ed1ff9'; // Substitua pela sua chave de API
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=pt_br`;

        axios.get(url)
          .then(response => {
            setClima(response.data); // Atualiza o estado com os dados recebidos
          })
          .catch(error => {
            setErro('Erro ao buscar o clima com base na localização.');
            console.error('Erro ao buscar o clima:', error);
          });
      });
    } else {
      setErro('Geolocalização não é suportada neste navegador.');
    }
  };

  // Função para detectar o Enter
  const handleKeyUp = (e) => {
    if (e.key === 'Enter') { // Verifica se a tecla pressionada é o Enter
      buscarClima(); // Chama a função de buscar clima
    }
  };

  return (
    <div className="App">
      <h1>Aplicativo de Clima</h1>
      <input
        type="text"
        value={cidade}
        onChange={(e) => setCidade(e.target.value)} // Atualiza o estado da cidade
        onKeyUp={handleKeyUp} // Detecta a tecla Enter ao soltar
        placeholder="Digite o nome da cidade"
      />
      <button onClick={buscarClima}>Buscar</button>
      <button onClick={buscarPrevisao5Dias}>Previsão 5 dias</button>
      <button onClick={buscarClimaPorLocalizacao}>Usar minha localização</button>

      {erro && <p className="error-message">{erro}</p>} {/* Exibe a mensagem de erro */}

      {/* Exibe o clima atual */}
      {clima && !clima.list && !erro && (
        <div>
          <h2>Clima em {clima.name}</h2>
          <p>Temperatura: {clima.main.temp}°C</p>
          <p>{clima.weather[0].description}</p>
          <p>Umidade: {clima.main.humidity}%</p>
          <p>Vento: {clima.wind.speed} m/s</p>

          {/* Adicionando o ícone do clima */}
          <img
            src={`http://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png`}
            alt={clima.weather[0].description}
            style={{ width: '100px', height: '100px' }}
          />
        </div>
      )}

      {/* Exibe a previsão de 5 dias */}
      {clima && clima.list && !erro && (
        <div>
          <h3>Previsão para os próximos 5 dias:</h3>
          {clima.list.slice(0, 5).map((forecast, index) => (
            <div key={index}>
              <p>{new Date(forecast.dt * 1000).toLocaleDateString()}</p> {/* Exibe a data */}

              {/* Verificação para forecast.main.temp */}
              {forecast.main && forecast.main.temp !== undefined ? (
                <p>Temperatura: {forecast.main.temp}°C</p>
              ) : (
                <p>Temperatura indisponível</p> // Mensagem caso a temperatura não esteja disponível
              )}

              {/* Verificação para forecast.weather[0].description */}
              {forecast.weather && forecast.weather[0] && forecast.weather[0].description ? (
                <p>{forecast.weather[0].description}</p>
              ) : (
                <p>Descrição do clima indisponível</p> 
              )}

              {/* Verificação para forecast.weather[0].icon */}
              {forecast.weather && forecast.weather[0] && forecast.weather[0].icon ? (
                <img
                  src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                  alt={forecast.weather[0].description}
                  style={{ width: '100px', height: '100px' }}
                />
              ) : (
                <p>Ícone não disponível</p> 
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
