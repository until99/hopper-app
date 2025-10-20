import { useState } from "react";
import Navbar from "../../../components/layout/Navbar"

interface IGroup {
    id: string;
    name: string;
    description: string;
    active: boolean;
}

export default function Groups() {
    // const [groups, setGroups] = useState<IGroup[]>([]);
    // const [loading, setLoading] = useState(true);

    return <>
        <Navbar />
        <h1>Groups Management</h1>

        <button>Create New Group</button>

        <br /><br />

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>group1</td>
                    <td>Admins</td>
                    <td>
                        <button>Dashboards</button>
                        <button>Users</button>
                        <button>Edit</button>
                        <button>Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </>
}