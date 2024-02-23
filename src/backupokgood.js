import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import Quagga from 'quagga';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function ProductPage({ barcode }) {
  // You can use the barcode ID to fetch product details or perform any other operations
  return (
    <div>
      <h2>Product Page for Barcode: {barcode}</h2>
      {/* Add product details or components related to the product */}
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
          // Redirect to product page when barcode is detected
          // window.location.href = `/product/${result.codeResult.code}`;
        }
      });
    }
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
        {barcode && <p> Detected Barcode: {barcode} </p>}
        {<Link to={`/product/${barcode}`}>View Product</Link>}
        <Routes>          
          <Route path="/product/:id" render={(props) => <ProductPage {...props} barcode={barcode} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
