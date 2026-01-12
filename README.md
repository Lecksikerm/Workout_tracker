# Workout Tracker API

## Overview

Workout Tracker is a backend API built with NestJS and TypeORM that allows users to track their workouts, log sets, and complete workouts. The system includes users, workouts, exercises, workout templates, and user-specific workout tracking.

---

## Base Entities

The system uses the following database entities:

* **User**: Represents the app users.
* **Workout**: Represents a predefined workout plan.
* **WorkoutTemplate**: Templates for workouts.
* **Exercise**: Predefined exercises.
* **WorkoutExercise**: Connects exercises to a workout template.
* **UserWorkout**: Tracks a user's workout instance.
* **UserWorkoutExercise**: Tracks exercises for a user's workout.
* **UserWorkoutSet**: Tracks sets performed for a user's exercise.

---

## API Endpoints

All endpoints require authentication via JWT.

### Start a Workout

**POST** `/user-workouts/start`

**Request Body:**

```json
{
  "workoutId": "<workout-id>"
}
```

**Response:**

* Returns the created `UserWorkout` with all pre-populated exercises.

---

### Log a Set

**PATCH** `/user-workouts/:id/log-set`

**Request Body:**

```json
{
  "exerciseId": "<exercise-id>",
  "reps": 10,
  "weight": 50.5,
  "duration": 60
}
```

**Response:**

* Returns the created `UserWorkoutSet`.
* Validates that the exercise exists in the workout.

---

### Finish a Workout

**PATCH** `/user-workouts/:id/finish`

**Request Body:**

```json
{
  "status": "COMPLETED" // or "IN_PROGRESS"
}
```

**Response:**

* Returns the updated `UserWorkout` with completed timestamp if finished.

---

### Get a Workout

**GET** `/user-workouts/:id`

**Response:**

* Returns `UserWorkout` including exercises and logged sets.

---

## Data Flow

1. User starts a workout → `UserWorkout` is created and exercises are pre-populated.
2. User logs sets → `UserWorkoutSet` entries are created for the specific exercise.
3. User finishes the workout → `UserWorkout.status` is updated to `COMPLETED` and `completedAt` is set.
4. User can fetch workout details → Returns all exercises and logged sets.

---

## Error Handling

* `NotFoundException` if workout or exercise does not exist.
* `ForbiddenException` if a user tries to access another user's workout.
* `BadRequestException` if logging a set for a non-existent exercise.

---

## Tech Stack

* NestJS
* TypeORM
* PostgreSQL
* JWT Authentication

---

## Setup

```bash
# Install dependencies
npm install

# Run migrations
npm run typeorm migration:run

# Start server
npm run start:dev
```

## Notes

* Ensure exercises are pre-populated for the workout template.
* `exercise_id` must never be null when logging sets.
* Logging sets is only allowed for exercises that exist in the user's workout.

---

## Project URL

* https://github.com/Lecksikerm/Workout_tracker

---
## Author

* Lecksikerm (Backend Developer)

