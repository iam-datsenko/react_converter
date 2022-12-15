import React, { useEffect, useState, useCallback } from "react";
import { Converter } from "../Converter/Converter";
import "./Main.scss";

export const Main = () => {
  const [fromCurrency, setFromCurrency] = useState("UAH");
  const [toCurrency, setToCurrency] = useState("USD");
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(0);
  const [rates, setRates] = useState({});

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("apikey", "sCdU3ESBNQ3QAjtXKbV4pm701CI4Xu8S");

    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
    };

    fetch("https://api.apilayer.com/fixer/latest?symbols=USD%2C%20EUR%2C%20UAH&base=UAH", requestOptions)
      .then(response => response.json())
      .then(result => setRates(result.rates))
      .catch(error => console.log('error', error));
  }, []);

  const onChangeFromPrice = useCallback(
    (value) => {
      const price = Math.round((value / rates[fromCurrency]) * 100) / 100;
      const result = Math.round((price * rates[toCurrency]) * 100) / 100;
      setFromPrice(value);
      setToPrice(result);
    },
    [fromCurrency, toCurrency, rates]
  );

  const onChangeToPrice = useCallback(
    (value) => {
      const result = Math.round(((rates[fromCurrency] / rates[toCurrency]) * value) * 100) / 100;
      setToPrice(value);
      setFromPrice(result);
    },
    [fromCurrency, toCurrency, rates]
  );

  useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [fromCurrency, fromPrice, onChangeFromPrice]);

  useEffect(() => {
    onChangeToPrice(toPrice);
  }, [toCurrency, toPrice, onChangeToPrice]);

  return (
    <div className="main">
      <Converter
        value={toPrice}
        currency={toCurrency}
        onChangeCurrency={setToCurrency}
        onChangeValue={onChangeToPrice}
      />
      
      <Converter
        value={fromPrice}
        currency={fromCurrency}
        onChangeCurrency={setFromCurrency}
        onChangeValue={onChangeFromPrice}
      />
    </div>
  );
}
