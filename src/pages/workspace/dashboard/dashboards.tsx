import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import type { IDashboard } from "../../../interfaces/dashboard"
import axios from "axios"



function Dashboards() {
  const [dashboards, setDashboards] = useState<IDashboard[]>([])
  const [loading, setLoading] = useState(true)
  const { groupId } = useParams()

  useEffect(() => {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_API_URL}/app/groups/${groupId}/dashboards`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    })
      .then(function (response) {

        if (response.status !== 200) {
          throw new Error("Failed to fetch dashboards")
        }

        else {
          setDashboards(response.data);
          setLoading(false);
        }

      })
      .catch(function (error) {
        console.error("Erro ao requisitar grupos: ", error);
        setLoading(false);
      });
  }, [groupId])




  return (
    <>
      <h1>Dashboards</h1>
      <ul>
        {loading ? (
          <p>Thinking...</p>
        ) : (
          dashboards.map((dashboard) => (
            <li key={dashboard.id}>
              <Link to={`${dashboard.id}`}>
                <h2>{dashboard.name}</h2>
              </Link>
            </li>
          ))
        )}
      </ul>
    </>
  )
}

export default Dashboards