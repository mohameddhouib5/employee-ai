import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('https://employee-ai-backend-1zxj.vercel.app/employees');
      if (!res.ok) throw new Error('Failed to fetch employees');
      const data = await res.json();
      // Parse skills if they are a JSON string
      const parsedData = data.map(emp => ({
        ...emp,
        skills: typeof emp.skills === 'string' ? JSON.parse(emp.skills) : emp.skills,
      }));
      setEmployees(parsedData);
    } catch (err) {
      console.error(err);
      alert('Error loading employees.');
    }
  };

  const handleEdit = (employee) => {
    setEditEmployee({
      ...employee,
      skills: Array.isArray(employee.skills) ? employee.skills.join(', ') : employee.skills,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { id, role, years_experience, skills, img } = editEmployee;

    try {
      const res = await fetch(`https://employee-ai-backend-1zxj.vercel.app/edit-employee/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          years_experience: Number(years_experience),
          skills: skills.split(',').map((s) => s.trim()),
          img,
        }),
      });

      if (!res.ok) throw new Error('Failed to update employee');

      alert('Employee updated successfully!');
      setEditEmployee(null);
      fetchEmployees();
    } catch (err) {
      alert('Error updating employee: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      const res = await fetch(`https://employee-ai-backend-1zxj.vercel.app/delete-employee/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete employee');

      alert('Employee deleted successfully!');
      fetchEmployees();
    } catch (err) {
      alert('Error deleting employee: ' + err.message);
    }
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="manage-employees-container">
      <h1>Manage Employees</h1>
      <button className="back-button" onClick={() => navigate('/')}>
        Back to Home
      </button>
      <div className="manage-search-container">
        <input
          type="text"
          className="manage-search-input"
          placeholder="Search employees by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="employee-container">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => (
            <div key={emp.id} className="employee-card">
              <img src={emp.img || 'https://via.placeholder.com/100'} alt={emp.name} />
              <h3>{emp.name}</h3>
              <p>
                <strong>Role:</strong> {emp.role}
              </p>
              <p>
                <strong>Experience:</strong> {emp.years_experience} years
              </p>
              <p className="skills">
                <strong>Skills:</strong>{' '}
                <span className="skill-tags">
                  {Array.isArray(emp.skills)
                    ? emp.skills.map((skill, index) => (
                        <span key={index} className={`skill-tag color-${index % 5}`}>
                          {skill}
                        </span>
                      ))
                    : emp.skills || 'None'}
                </span>
              </p>
              <div className="btn-group">
                <button className="edit" onClick={() => handleEdit(emp)}>
                  Edit
                </button>
                <button className="delete" onClick={() => handleDelete(emp.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No employees found.</p>
        )}
      </div>

      {editEmployee && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Employee</h2>
            <form onSubmit={handleEditSubmit} className="edit-employee-form">
              <input
                placeholder="Role"
                name="role"
                value={editEmployee.role}
                onChange={(e) =>
                  setEditEmployee({ ...editEmployee, role: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Years of Experience"
                name="years_experience"
                value={editEmployee.years_experience}
                onChange={(e) =>
                  setEditEmployee({ ...editEmployee, years_experience: e.target.value })
                }
                required
              />
              <input
                placeholder="Skills (comma-separated)"
                name="skills"
                value={editEmployee.skills}
                onChange={(e) =>
                  setEditEmployee({ ...editEmployee, skills: e.target.value })
                }
                required
              />
              <input
                placeholder="Image URL"
                name="img"
                value={editEmployee.img || ''}
                onChange={(e) =>
                  setEditEmployee({ ...editEmployee, img: e.target.value })
                }
              />
              <div className="modal-btn-group">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditEmployee(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageEmployees;