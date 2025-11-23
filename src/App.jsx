import "./App.css";
import QrGenerator from "./components/QrGenerator";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Générateur de QR Code Gratuit</h1>
        <p>Créez des QR codes professionnels pour URL, WiFi, Email, SMS et plus</p>
      </header>
      <main role="main">
        <QrGenerator />
      </main>
      <footer className="App-footer">
        <p>&copy; 2024 QR Generator - Générateur de QR Code gratuit et professionnel</p>
      </footer>
    </div>
  );
}

export default App;
