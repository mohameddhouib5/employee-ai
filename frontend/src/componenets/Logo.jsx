function Logo() {
  return (
    <div className="logo-container">
      <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#1e3a8a', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" />
        <text x="25" y="60" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="bold" fill="#ffffff">
          E
        </text>
        <text x="55" y="60" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="#ffffff">
          AI
        </text>
        <path
          d="M50 10 A40 40 0 0 1 90 50 A40 40 0 0 1 50 90 A40 40 0 0 1 10 50 A40 40 0 0 1 50 10"
          stroke="#ffffff"
          strokeWidth="3"
          fill="none"
          opacity="0.8"
        />
      </svg>
 <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
   <a href="/takeaways" style={{ textDecoration: 'none' }}>
    <button
      style={{
        backgroundColor: '#000000ff',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease',
      }}
      onMouseOver={e => (e.target.style.backgroundColor = '#1e221eff')}
      onMouseOut={e => (e.target.style.backgroundColor = '#000000ff')}
    >
      Takeaways
    </button>
    
    </a>

    </div>
    </div>
    
  );
}

export default Logo;