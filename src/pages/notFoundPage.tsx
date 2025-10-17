import { Link } from "react-router-dom"

function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '20%' }}>
      <h1 style={{ fontSize: '6rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.5rem' }}>Page Not Found</p>
      <Link to="/groups" style={{ fontSize: '1.2rem', color: '#007bff', textDecoration: 'none' }}>
        Go back to Home
      </Link>
    </div>
  )
}

export default NotFoundPage