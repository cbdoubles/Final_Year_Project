import "./App.css";
import NeovisComponent from "./components/NeovisComponent";
import Linter from "./Linter";

const NEO4J_URI = "bolt://localhost:7687";
const NEO4J_USER = "neo4j";
const NEO4J_PASSWORD = "cobra-paprika-nylon-conan-tobacco-2599";

function App() {
  return (
    <div>
      <Linter />
      <h1>React Neovis Example</h1>
      <NeovisComponent />
    </div>
  );
}

export default App;
