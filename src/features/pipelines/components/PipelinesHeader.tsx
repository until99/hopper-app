interface PipelinesHeaderProps {
    airflowUrl: string;
}

export const PipelinesHeader = ({ airflowUrl }: PipelinesHeaderProps) => {
    return (
        <>
            <h1>Pipelines Management</h1>
            <a href={airflowUrl} target="_blank" rel="noopener noreferrer">
                Manage Pipelines
            </a>
            <br /><br />
        </>
    );
};
