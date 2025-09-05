// src/components/Converter.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Converter.css";

const Converter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);

  // Fallback currency list (if API fails)
  const fallbackCurrencies = ["USD", "EUR", "GBP", "ZAR", "JPY", "AUD", "CAD", "CNY", "INR"];

  // Fetch currency symbols
  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await axios.get("https://api.exchangerate.host/symbols");

        if (response.data && response.data.symbols) {
          const symbols = Object.keys(response.data.symbols);
          setCurrencies(symbols);
        } else {
          console.warn("Unexpected API response, using fallback:", response.data);
          setCurrencies(fallbackCurrencies);
        }
      } catch (error) {
        console.error("Error fetching currency symbols, using fallback:", error);
        setCurrencies(fallbackCurrencies);
      }
    };

    fetchSymbols();
  }, []);

  // Convert
  const convert = async () => {
    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
      );

      if (response.data && response.data.result) {
        setResult(response.data.result);
      } else {
        alert("Conversion failed, please try again.");
      }
    } catch (error) {
      console.error("Error converting currency:", error);
      alert("Conversion failed, please check console for details.");
    }
  };

  // Swap
  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="converter">
      <h2>Currency Converter</h2>

      <div className="converter-inputs">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>

        <button onClick={swapCurrencies}>⇄</button>

        <select value={to} onChange={(e) => setTo(e.target.value)}>
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>

      <button className="convert-btn" onClick={convert}>
        Convert
      </button>

      {result !== null && (
        <p>
          {amount} {from} = <strong>{result.toFixed(2)} {to}</strong>
        </p>
      )}
    </div>
  );
};

export default Converter;
