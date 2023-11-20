import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";

import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "../Css/credentials.css";
function CredentialsPDF({ pdfLInk, title }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  try {
    return (
      <div className="pdf-contianer">
        <div className="pdf-detials">
          <div className="title-box">
            <h3 id="pdf-title">{title}</h3>
          </div>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <div className="pdf-view">
              <Viewer
                fileUrl={pdfLInk}
                plugins={[defaultLayoutPluginInstance]}
              />
            </div>
          </Worker>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div>
        <h1>Not credentials uploaded</h1>
      </div>
    );
  }
}

export default CredentialsPDF;
