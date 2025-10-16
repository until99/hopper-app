import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import type { IDashboards } from "../../../interfaces/dashboard"
import axios from "axios"



function Dashboards() {
  const [dashboards, setDashboards] = useState<IDashboards[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios({
      method: "get",
      url: "https://jsonplaceholder.typicode.com/users",
    })
      .then(function (response) {

        if (response.status !== 200) {
          throw new Error("Failed to fetch post")
        }

        if (!response.data) {
          throw new Error("Post not found")
        }

        else {
          setDashboards(response.data)
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
      <h1>Dashboards</h1>
      <ul>
        {dashboards.map((dashboard) => (
          <li key={dashboard.id}>
            <Link to={`/dashboards/${dashboard.id}`}>
              <h2>{dashboard.name}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Dashboards
