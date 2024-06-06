import "./App.css";
import Linter from "./Linter";
import { NeoGraph, ResponsiveNeoGraph } from "./neo4jVis";

const NEO4J_URI = "bolt://localhost:7687";
const NEO4J_USER = "neo4j";
const NEO4J_PASSWORD = "cobra-paprika-nylon-conan-tobacco-2599";

function App() {
  return (
    <div>
      <Linter />
      <h1>React Neovis Example</h1>
      {/* <ResponsiveNeoGraph
        containerId={"id0"}
        neo4jUri={NEO4J_URI}
        neo4jUser={NEO4J_USER}
        neo4jPassword={NEO4J_PASSWORD}
        width={400}
        height={300}
      /> */}
      <NeoGraph
        width={400}
        height={300}
        containerId={"id1"}
        neo4jUri={NEO4J_URI}
        neo4jUser={NEO4J_USER}
        neo4jPassword={NEO4J_PASSWORD}
        backgroundColor={"#b2beb5"}
      />
    </div>
  );
}

export default App;
