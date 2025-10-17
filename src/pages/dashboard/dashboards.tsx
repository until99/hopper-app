import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import type { IDashboard } from "../../interfaces/dashboard"
import axios from "axios"



function Dashboards() {
  const [dashboards, setDashboards] = useState<IDashboard[]>([])
  const [loading, setLoading] = useState(true)
  const { groupId } = useParams()

  const handleLogout = () => {
    console.log('logout');

    localStorage.removeItem('authToken')
    localStorage.removeItem('userId')

    window.location.href = '/login'

  }

  useEffect(() => {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_API_URL}/groups/${groupId}/reports`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    })
      .then(function (response) {

        if (response.status !== 200) {
          throw new Error("Failed to fetch dashboards")
        }

        else {

          setDashboards(response.data.reports);
          setLoading(false);
        }

      })
      .catch(function (error) {
        console.error("Erro ao requisitar grupos: ", error);
        setLoading(false);
      });
  }, [groupId])


  if (loading) {
    return <p>Thinking...</p>
  }

  return (
    <>
      <nav>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <h1>Dashboards</h1>
      {dashboards.length === 0 ? (
        <p>No dashboards available.</p>
      ) : (
        <ul>
          {dashboards.map((dashboard) => (
            <li key={dashboard.id}>
              <Link to={`/groups/${groupId}/dashboards/${dashboard.id}`}>
                <h2>{dashboard.name}</h2>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default Dashboards
