export interface Workout {
  date: string;
  distance: number;
}

export interface WorkoutFormProps {
  onAdd: (date: string, distance: number) => void;
  editingWorkout: Workout | null;
  onCancelEdit: () => void;
}

export interface WorkoutListProps {
  workouts: Workout[];
  onDelete: (date: string) => void;
  onEdit: (workout: Workout) => void;
}
