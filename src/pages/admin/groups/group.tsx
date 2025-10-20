import Navbar from "../../../components/layout/Navbar"

export default function Groups() {
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
                        <button>Edit</button>
                        <button>Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </>
}