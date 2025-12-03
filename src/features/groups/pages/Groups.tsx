import { useState } from "react";
import { useFetchGroups } from "../hooks/useFetchGroups";
import { GroupsTable } from "../components/GroupsTable";
import CreateGroupModal from "../modals/CreateGroupModal";
import EditGroupModal from "../modals/EditGroupModal";
import DeleteGroupModal from "../modals/DeleteGroupModal";
import AddUsersToGroupModal from "../modals/AddUsersToGroupModal";
import AddDashboardsToGroupModal from "../modals/AddDashboardsToGroupModal";

export default function Groups() {
    const { groups, loading, refetch } = useFetchGroups();

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddUsersModalOpen, setIsAddUsersModalOpen] = useState(false);
    const [isAddDashboardsModalOpen, setIsAddDashboardsModalOpen] = useState(false);

    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [selectedGroupName, setSelectedGroupName] = useState("");

    const handleOpenEditModal = (groupId: string, groupName: string) => {
        setSelectedGroupId(groupId);
        setSelectedGroupName(groupName);
        setIsEditModalOpen(true);
    };

    const handleOpenDeleteModal = (groupId: string, groupName: string) => {
        setSelectedGroupId(groupId);
        setSelectedGroupName(groupName);
        setIsDeleteModalOpen(true);
    };

    const handleOpenAddUsersModal = (groupId: string, groupName: string) => {
        setSelectedGroupId(groupId);
        setSelectedGroupName(groupName);
        setIsAddUsersModalOpen(true);
    };

    const handleOpenAddDashboardsModal = (groupId: string, groupName: string) => {
        setSelectedGroupId(groupId);
        setSelectedGroupName(groupName);
        setIsAddDashboardsModalOpen(true);
    };

    const handleCloseModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsAddUsersModalOpen(false);
        setIsAddDashboardsModalOpen(false);
        setSelectedGroupId(null);
        setSelectedGroupName("");
    };

    const handleGroupCreated = () => {
        refetch();
    };

    const handleGroupUpdated = () => {
        refetch();
    };

    const handleGroupDeleted = () => {
        refetch();
    };

    const handleUsersAdded = () => {
        refetch();
    };

    const handleDashboardsAdded = () => {
        refetch();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 overflow-hidden">
            {/* Modals */}
            <CreateGroupModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseModals}
                onGroupCreated={handleGroupCreated}
            />
            <EditGroupModal
                isOpen={isEditModalOpen}
                onClose={handleCloseModals}
                groupId={selectedGroupId}
                onGroupUpdated={handleGroupUpdated}
            />
            <DeleteGroupModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseModals}
                groupId={selectedGroupId}
                groupName={selectedGroupName}
                onGroupDeleted={handleGroupDeleted}
            />
            <AddUsersToGroupModal
                isOpen={isAddUsersModalOpen}
                onClose={handleCloseModals}
                groupId={selectedGroupId}
                groupName={selectedGroupName}
                onUsersAdded={handleUsersAdded}
            />
            <AddDashboardsToGroupModal
                isOpen={isAddDashboardsModalOpen}
                onClose={handleCloseModals}
                groupId={selectedGroupId}
                groupName={selectedGroupName}
                onDashboardsAdded={handleDashboardsAdded}
            />

            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Groups Management</h1>
                        <p className="text-sm sm:text-base text-gray-600">Manage groups, users, and dashboards</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="text-black inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors shadow-sm w-full sm:w-auto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden sm:inline">Create New Group</span>
                        <span className="sm:hidden">Create Group</span>
                    </button>
                </div>

                <GroupsTable
                    groups={groups}
                    loading={loading}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteModal}
                    onAddUsers={handleOpenAddUsersModal}
                    onAddDashboards={handleOpenAddDashboardsModal}
                />
            </div>
        </div>
    );
}
