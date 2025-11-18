export interface DagPipeline {
    id: string;
    description: string;
    timetable_description: string;
}

export interface PipelinesResponse {
    dags: DagPipeline[];
}
