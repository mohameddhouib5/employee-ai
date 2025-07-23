
function EmployeeList({ employees, explanation }) {
  if (!employees || employees.length === 0) {
    return null;
  }

  return (
    <div className="employee-list">
      <h2>Results</h2>
      <div className="explanation">{explanation || 'No explanation available.'}</div>
  
      <div className="employee-container">
        {employees.map((emp, index) => (
          <div key={index} className="employee-card">
            <img
              src={emp.img || 'https://via.placeholder.com/100'}
              alt={emp.name}
            />
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
                  ? emp.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className={`skill-tag color-${skillIndex % 5}`}>
                        {skill}
                      </span>
                    ))
                  : emp.skills || 'None'}
              </span>
            </p>
            <p className="similarity">
              <strong>Similarity:</strong>{' '}
              <span className="similarity-badge">{(emp.similarity * 100).toFixed(2)}%</span>
            </p>
          </div>
        ))}
      </div>
      <div className="explanation">{explanation || 'No explanation available.'}</div>
    </div>
  );
}

export default EmployeeList;