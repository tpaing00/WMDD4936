import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import Quagga from 'quagga';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function ProductPage({ barcode }) {
  return (
    <div>
      <h2>Product Page for Barcode: {barcode}</h2>
    </div>
  );
}

function App() {
  const [barcode, setBarcode] = useState('');
  const webcamRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      captureBarcode();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const captureBarcode = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      Quagga.decodeSingle({
        src: imageSrc,
        numOfWorkers: 0,
        inputStream: {
          size: 800
        },
        decoder: {
          readers:[
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader",
            "2of5_reader",
            "code_93_reader"
            ]
        },
        locator: {
          patchSize: 'medium',
          halfSample: true
        },
        locate: true
      }, (result) => {
        if (result && result.codeResult) {
          setBarcode(result.codeResult.code);
          <Routes>
          <Route path="/product/:id" element={<ProductPage barcode={barcode} />} />
        </Routes>
        }
      });
    }
  };

  const handleCaptureButtonClick = () => {
    captureBarcode();
  };

  return (
    <Router>
      <div className="App">
        <h1>Barcode Reader</h1>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: '30%', height: '30%' }}
        />
        <button onClick={handleCaptureButtonClick}>Capture</button>
        {barcode && <p> Detected Barcode: {barcode} </p>}
        {<Link to={`/product/${barcode}`}>View Product</Link>}
        <Routes>
          <Route path="/product/:id" element={<ProductPage barcode={barcode} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
