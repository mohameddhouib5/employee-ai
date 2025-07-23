import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import "./index.css";
import Logo from "./componenets/Logo";
import Title from "./componenets/Title";
import Search from "./componenets/Search";
import ButtonContainer from "./componenets/ButtonContainer";
import EmployeeList from "./componenets/EmployeeList";
import AddEmployee from "./componenets/AddEmployee";
import ManageEmployees from "./componenets/ManageEmployees";
import Takeaways from "./componenets/Takeaways";

function App() {
  const [employees, setEmployees] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      const res = await fetch("https://employee-ai-backend-1zxj.vercel.app/search-employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error("Failed to fetch search results");

      const { results, explanation } = await res.json();
      setEmployees(
        results.map((emp) => ({ ...emp, skills: JSON.parse(emp.skills) }))
      );
      setExplanation(explanation);
    } catch (err) {
      console.error("Error fetching search:", err);
      alert("Something went wrong with the search.");
      setEmployees([]);
      setExplanation("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Logo/>
              <Title />
              <Search onSearch={handleSearch} />
              <ButtonContainer />
              {loading ? (
                <div className="loader-container">
                  <ClipLoader
                    color="#ffb703"
                    size={50}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              ) : (
                <EmployeeList employees={employees} explanation={explanation} />
              )}
              
            </div>
          }
        />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/manage" element={<ManageEmployees />} />
        <Route path="/takeaways" element={<Takeaways />} />

      </Routes>
    </Router>
  );
}

export default App;
