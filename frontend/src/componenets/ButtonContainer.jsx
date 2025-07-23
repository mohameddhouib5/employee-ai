import { Link } from 'react-router-dom';

function ButtonContainer() {
  return (
    <div className="button-container">
      <Link to="/add-employee">
        <button>Add Employee</button>
      </Link>
      <Link to="/manage">
        <button>Manage Employees</button>
      </Link>
    </div>
  );
}

export default ButtonContainer;