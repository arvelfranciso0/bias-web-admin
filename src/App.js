import Routers from "./Router/Router";
import "./App.css";
import { pdfjs } from "react-pdf";
import "bootstrap/dist/css/bootstrap.min.css";
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
function App() {
  return <Routers />;
}

export default App;
