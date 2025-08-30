import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    axios.get("https://api.exchangerate.host/latest")
      .then(res => {
        setCurrencies(Object.keys(res.data.rates));
      })
      .catch(err => console.error("Error fetching currencies:", err));
  }, []);

  const convertCurrency = () => {
    axios.get(`https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`)
      .then(res => {
        setConvertedAmount(res.data.result);
      })
      .catch(err => console.error("Error converting currency:", err));
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Currency Converter</h1>
      <div>
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
        />
        <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
          {currencies.map((cur) => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>
        <span> ➡ </span>
        <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
          {currencies.map((cur) => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>
      </div>
      <button onClick={convertCurrency} style={{ marginTop: "20px", padding: "10px" }}>
        Convert
      </button>
      {convertedAmount !== null && (
        <h2 style={{ marginTop: "20px" }}>
          {amount} {fromCurrency} = {convertedAmount} {toCurrency}
        </h2>
      )}
    </div>
  );
}

export default App;
