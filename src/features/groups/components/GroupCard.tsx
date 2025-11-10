import { Link } from "react-router-dom";
import type { IGroup } from "../types/Group";


const GroupCard = ({ group }: { group: IGroup }) => {
    return (
        <li key={group.id}>
            <Link to={`${group.id}/dashboards`}>
                <h2>{group.name}</h2>
            </Link>
        </li>
    );
}

export default GroupCard;