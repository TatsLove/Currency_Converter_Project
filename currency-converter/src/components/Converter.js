import React, { useEffect, useState } from "react";
import axios from "axios";

const Converter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    axios.get("https://api.exchangerate.host/latest")
      .then((res) => setCurrencies(Object.keys(res.data.rates)))
      .catch((err) => console.error(err));
  }, []);

  const convertCurrency = () => {
    axios
      .get(
        `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
      )
      .then((res) => setConvertedAmount(res.data.result.toFixed(2)))
      .catch((err) => console.error(err));
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
  };

  return (
    <div className="converter-container">
      <h1>Currency Converter</h1>
      <div className="converter-inputs">
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
        <button onClick={swapCurrencies}>⇄</button>
        <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
          {currencies.map((cur) => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>
      </div>
      <button className="convert-button" onClick={convertCurrency}>Convert</button>
      {convertedAmount !== null && (
        <h2 className="result">
          {amount} {fromCurrency} = {convertedAmount} {toCurrency}
        </h2>
      )}
    </div>
  );
};

export default Converter;
