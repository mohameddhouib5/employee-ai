import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    years_experience: '',
    skills: '',
    img: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      skills: formData.skills.split(',').map((skill) => skill.trim()),
      years_experience: Number(formData.years_experience),
    };

    try {
      const res = await fetch('https://employee-ai-backend-1zxj.vercel.app/add-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        alert('✅ Employee added successfully!');
        setFormData({
          name: '',
          role: '',
          years_experience: '',
          skills: '',
          img: '',
        });
      } else {
        alert('❌ Failed to add employee');
      }
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="add-employee-container">
      <h1>Add Employee</h1>
      <form onSubmit={handleSubmit} className="add-employee-form">
        <input
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <input
          placeholder="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <input
          type="number"
          placeholder="Years of Experience"
          name="years_experience"
          value={formData.years_experience}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <input
          placeholder="Skills (comma-separated)"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <input
          placeholder="Image URL"
          name="img"
          value={formData.img}
          onChange={handleChange}
        />
        <br />
        <br />
        <button type="submit">Add</button>
      </form>
      <button onClick={() => navigate('/')}>Back</button>
    </div>
  );
}

export default AddEmployee;