import { useState } from 'react'
import type { IGroup } from "../types/Group"
import GroupCard from '../components/GroupCard'

const DashboardGroups = () => {

    const [loading] = useState(true)
    const [groups] = useState<IGroup[]>([])

    return (
        <>
            <h1>Workspaces</h1>
            <ul>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    groups.map((group: IGroup) => (
                        <GroupCard key={group.id} group={group} />
                    ))
                )}
            </ul>
        </>
    )
}

export default DashboardGroups