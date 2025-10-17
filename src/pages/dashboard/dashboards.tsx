import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import type { IDashboards } from "../../interfaces/dashboard"
import axios from "axios"



function Dashboards() {
  const [groups, setGroups] = useState<IDashboards[]>([])
  const [loading, setLoading] = useState(true)

  const handleLogout = () => {
    console.log('logout');

    localStorage.removeItem('authToken')
    localStorage.removeItem('userId')

    window.location.href = '/login'

  }

  useEffect(() => {
    axios({
      method: "get",
      url: `${import.meta.env.API_URL}/groups`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    })
      .then(function (response) {

        if (response.status !== 200) {
          throw new Error("Failed to fetch post")
        }

        if (!response.data) {
          throw new Error("Post not found")
        }

        else {
          setGroups(response.data)
          setLoading(false);
        }

      })
      .catch(function (error) {
        console.error("Erro ao requisitar dashboards: ", error);
      });
  }, [])


  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <nav>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <h1>Groups</h1>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <Link to={`/dashboards/${group.id}`}>
              <h2>{group.name}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Dashboards
