import React, { useEffect, useState } from 'react';

// Issue with react-barcode plugin - instead used @createnextapp/react-barcode
// import Barcode from 'react-barcode';
import { useBarcode } from '@createnextapp/react-barcode';
import axios from 'axios';
import Spinner from './spinner.svg'

function App() {
  const [barcodeRef, setBarcodeRef] = useState<{ barcode: number, expiresAt: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<any>();
  const [generateNewBarcode, setGenerateNewBarcode] = useState<boolean>(false);

  useEffect(() => {
    axios.get('https://jet-gull-7204.twil.io/generate-barcode')
      .then((response) => {
        console.log('success', response)
        setBarcodeRef(response.data)
        setIsLoading(false)
      }).catch((error) => {
        console.log(error)
      });
  }, [generateNewBarcode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });
  
  const calculateTimeLeft = () => {
    if (barcodeRef) {
      const difference = +new Date(barcodeRef.expiresAt) - +new Date();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          minutes: Math.floor((difference / 1000 / 60) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2}),
          seconds: Math.floor((difference / 1000) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2}),
        };
      };

      return timeLeft;
    };
  };

  const onGenerateNewBarcode = () => {
    setGenerateNewBarcode(!generateNewBarcode)
  }

  const { inputRef } = useBarcode({
    value: barcodeRef?.barcode.toString() || '000000',
  });
  
    // Issue with useBarcode plugin not rendering with isLoading state
    // if (!isLoading) {
      return (
        <div className="App">
            <h1>Barcode</h1>
            <svg ref={inputRef} />

            {timeLeft && Object.keys(timeLeft).length > 0
              ? <p style={{ paddingLeft: 60 }}>{timeLeft.minutes}:{timeLeft.seconds}</p>
              : <><br/><button onClick={(e) => onGenerateNewBarcode()}>Generate New Barcode</button></>
            }
        </div>
      );

    // } else {
    //   return <img src={Spinner} alt="pre-loader" />
    // };
};

export default App;
