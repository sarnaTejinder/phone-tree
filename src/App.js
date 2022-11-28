import "./App.css";
import Page from "./components/Page";
import { FlowProvider } from "./context/FlowContext";

function App() {
  return (
    <div className="App">
      <FlowProvider>
        <Page />
      </FlowProvider>
    </div>
  );
}

export default App;
