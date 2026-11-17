import React, { useState, useEffect } from "react";
import { Workout } from "../../types";
import "./WorkoutTracker.css";

const WorkoutTracker: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem("workouts");
    return saved ? JSON.parse(saved) : [];
  });

  const [dateInput, setDateInput] = useState("");
  const [distanceInput, setDistanceInput] = useState("");
  const [editingDate, setEditingDate] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  const formatToDisplay = (isoDate: string): string => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}.${month}.${year}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dateInput) {
      alert("Выберите дату");
      return;
    }

    const distance = parseFloat(distanceInput.replace(",", "."));
    if (isNaN(distance) || distance <= 0) {
      alert("Введите корректное количество километров");
      return;
    }

    setWorkouts((prev) => {
      let updated = [...prev];

      if (editingDate) {
        updated = updated.filter((w) => w.date !== editingDate);
        const existingIdx = updated.findIndex((w) => w.date === dateInput);
        if (existingIdx !== -1) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            distance: distance,
          };
        } else {
          updated.push({ date: dateInput, distance });
        }
      } else {
        const existingIdx = updated.findIndex((w) => w.date === dateInput);
        if (existingIdx !== -1) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            distance: updated[existingIdx].distance + distance,
          };
        } else {
          updated.push({ date: dateInput, distance });
        }
      }

      return updated.sort((a, b) => b.date.localeCompare(a.date));
    });

    setDateInput("");
    setDistanceInput("");
    setEditingDate(null);
  };

  const handleDelete = (date: string) => {
    setWorkouts((prev) => prev.filter((w) => w.date !== date));
    if (editingDate === date) {
      setDateInput("");
      setDistanceInput("");
      setEditingDate(null);
    }
  };

  const handleEdit = (workout: Workout) => {
    setDateInput(workout.date);
    setDistanceInput(workout.distance.toString());
    setEditingDate(workout.date);
  };

  const handleCancelEdit = () => {
    setDateInput("");
    setDistanceInput("");
    setEditingDate(null);
  };

  return (
    <div className="workout-tracker">
      <h1>Учёт тренировок</h1>

      <form className="tracker-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Дата</label>
          <input
            type="date"
            id="start"
            name="trip-start"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Пройдено км</label>
          <input
            type="text"
            value={distanceInput}
            onChange={(e) => setDistanceInput(e.target.value)}
            placeholder="0.0"
          />
        </div>
        <button type="submit" className="btn-submit">
          OK
        </button>
        {editingDate && (
          <button
            type="button"
            className="btn-cancel"
            onClick={handleCancelEdit}
          >
            Отмена
          </button>
        )}
      </form>

      <div className="tracker-list">
        <div className="list-header">
          <span>Дата (ДД.ММ.ГГГГ)</span>
          <span>Пройдено км</span>
          <span>Действия</span>
        </div>
        <ul>
          {workouts.map((workout) => (
            <li key={workout.date} className="list-item">
              <span>{formatToDisplay(workout.date)}</span>
              <span>{workout.distance.toFixed(1)}</span>
              <div className="item-actions">
                <button
                  onClick={() => handleEdit(workout)}
                  className="btn-icon"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(workout.date)}
                  className="btn-icon"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkoutTracker;
