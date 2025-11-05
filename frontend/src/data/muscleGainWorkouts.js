export const muscleGainWorkouts = {
  beginner: [
    {
      day: 1,
      name: "Push - Chest & Triceps",
      type: "strength",
      exercises: [
        { name: "Push-ups", duration: "10 min", sets: "4", reps: "10-12" },
        { name: "Dumbbell Chest Press", duration: "12 min", sets: "4", reps: "10-12" },
        { name: "Incline Dumbbell Press", duration: "12 min", sets: "3", reps: "10" },
        { name: "Tricep Dips", duration: "10 min", sets: "3", reps: "10" }
      ]
    },
    {
      day: 2,
      name: "Pull - Back & Biceps",
      type: "strength",
      exercises: [
        { name: "Assisted Pull-ups", duration: "10 min", sets: "4", reps: "8-10" },
        { name: "Dumbbell Rows", duration: "12 min", sets: "4", reps: "10-12" },
        { name: "Lat Pulldowns", duration: "12 min", sets: "3", reps: "12" },
        { name: "Bicep Curls", duration: "10 min", sets: "4", reps: "12" }
      ]
    },
    {
      day: 3,
      name: "Legs & Core",
      type: "strength",
      exercises: [
        { name: "Goblet Squats", duration: "12 min", sets: "4", reps: "12" },
        { name: "Romanian Deadlifts", duration: "12 min", sets: "4", reps: "10" },
        { name: "Lunges", duration: "12 min", sets: "3", reps: "12 each" },
        { name: "Plank Holds", duration: "6 min", sets: "3", reps: "45s" }
      ]
    },
    {
      day: 4,
      name: "Rest Day",
      type: "rest",
      isRestDay: true,
      exercises: [
        { name: "Stretching", duration: "15 min", sets: "-", reps: "-" },
        { name: "Light Walk", duration: "20 min", sets: "-", reps: "-" }
      ]
    },
    {
      day: 5,
      name: "Shoulders & Core",
      type: "strength",
      exercises: [
        { name: "Dumbbell Shoulder Press", duration: "12 min", sets: "4", reps: "10-12" },
        { name: "Lateral Raises", duration: "10 min", sets: "4", reps: "12" },
        { name: "Front Raises", duration: "10 min", sets: "3", reps: "12" },
        { name: "Ab Crunches", duration: "8 min", sets: "4", reps: "15" }
      ]
    },
    {
      day: 6,
      name: "Full Body Strength",
      type: "strength",
      exercises: [
        { name: "Deadlifts", duration: "15 min", sets: "4", reps: "8-10" },
        { name: "Bench Press", duration: "12 min", sets: "4", reps: "10" },
        { name: "Squats", duration: "12 min", sets: "4", reps: "10" },
        { name: "Bent-over Rows", duration: "10 min", sets: "3", reps: "12" }
      ]
    },
    {
      day: 7,
      name: "Rest Day",
      type: "rest",
      isRestDay: true,
      exercises: [
        { name: "Yoga", duration: "30 min", sets: "-", reps: "-" },
        { name: "Foam Rolling", duration: "15 min", sets: "-", reps: "-" }
      ]
    }
  ],
  intermediate: [
    {
      day: 1,
      name: "Chest & Triceps Power",
      type: "strength",
      exercises: [
        { name: "Barbell Bench Press", duration: "15 min", sets: "5", reps: "8-10" },
        { name: "Incline Dumbbell Press", duration: "12 min", sets: "4", reps: "10" },
        { name: "Cable Flyes", duration: "10 min", sets: "4", reps: "12" },
        { name: "Skull Crushers", duration: "10 min", sets: "4", reps: "12" }
      ]
    },
    {
      day: 2,
      name: "Back & Biceps Mass",
      type: "strength",
      exercises: [
        { name: "Deadlifts", duration: "15 min", sets: "5", reps: "6-8" },
        { name: "Pull-ups", duration: "12 min", sets: "4", reps: "10-12" },
        { name: "Barbell Rows", duration: "12 min", sets: "4", reps: "10" },
        { name: "Barbell Curls", duration: "10 min", sets: "4", reps: "10-12" }
      ]
    },
    {
      day: 3,
      name: "Legs Hypertrophy",
      type: "strength",
      exercises: [
        { name: "Barbell Squats", duration: "15 min", sets: "5", reps: "8-10" },
        { name: "Leg Press", duration: "12 min", sets: "4", reps: "12" },
        { name: "Romanian Deadlifts", duration: "12 min", sets: "4", reps: "10" },
        { name: "Calf Raises", duration: "10 min", sets: "5", reps: "15" }
      ]
    },
    {
      day: 4,
      name: "Shoulders & Abs",
      type: "strength",
      exercises: [
        { name: "Military Press", duration: "15 min", sets: "5", reps: "8-10" },
        { name: "Dumbbell Lateral Raises", duration: "12 min", sets: "4", reps: "12-15" },
        { name: "Rear Delt Flyes", duration: "10 min", sets: "4", reps: "12" },
        { name: "Weighted Ab Crunches", duration: "10 min", sets: "4", reps: "15" }
      ]
    },
    {
      day: 5,
      name: "Arms Specialization",
      type: "strength",
      exercises: [
        { name: "Barbell Curls", duration: "12 min", sets: "5", reps: "10" },
        { name: "Close-grip Bench", duration: "12 min", sets: "5", reps: "10" },
        { name: "Hammer Curls", duration: "10 min", sets: "4", reps: "12" },
        { name: "Tricep Pushdowns", duration: "10 min", sets: "4", reps: "12" }
      ]
    },
    {
      day: 6,
      name: "Full Body Power",
      type: "strength",
      exercises: [
        { name: "Front Squats", duration: "15 min", sets: "4", reps: "8" },
        { name: "Overhead Press", duration: "12 min", sets: "4", reps: "8" },
        { name: "Weighted Pull-ups", duration: "12 min", sets: "4", reps: "8" },
        { name: "Barbell Rows", duration: "12 min", sets: "4", reps: "10" }
      ]
    },
    {
      day: 7,
      name: "Rest Day",
      type: "rest",
      isRestDay: true,
      exercises: [
        { name: "Light Stretching", duration: "20 min", sets: "-", reps: "-" },
        { name: "Recovery Massage", duration: "30 min", sets: "-", reps: "-" }
      ]
    }
  ],
  advanced: [
    {
      day: 1,
      name: "Chest Hypertrophy",
      type: "strength",
      exercises: [
        { name: "Barbell Bench Press", duration: "18 min", sets: "6", reps: "6-8" },
        { name: "Incline Barbell Press", duration: "15 min", sets: "5", reps: "8-10" },
        { name: "Weighted Dips", duration: "12 min", sets: "5", reps: "10-12" },
        { name: "Cable Flyes", duration: "12 min", sets: "4", reps: "15" }
      ]
    },
    {
      day: 2,
      name: "Back Thickness & Width",
      type: "strength",
      exercises: [
        { name: "Deadlifts", duration: "20 min", sets: "6", reps: "5-6" },
        { name: "Weighted Pull-ups", duration: "15 min", sets: "5", reps: "8-10" },
        { name: "T-Bar Rows", duration: "15 min", sets: "5", reps: "10" },
        { name: "Lat Pulldowns", duration: "12 min", sets: "4", reps: "12" }
      ]
    },
    {
      day: 3,
      name: "Legs Power & Mass",
      type: "strength",
      exercises: [
        { name: "Back Squats", duration: "20 min", sets: "6", reps: "6-8" },
        { name: "Front Squats", duration: "15 min", sets: "5", reps: "8-10" },
        { name: "Romanian Deadlifts", duration: "15 min", sets: "5", reps: "8-10" },
        { name: "Bulgarian Split Squats", duration: "12 min", sets: "4", reps: "10 each" }
      ]
    },
    {
      day: 4,
      name: "Shoulders & Traps",
      type: "strength",
      exercises: [
        { name: "Overhead Press", duration: "18 min", sets: "6", reps: "6-8" },
        { name: "Arnold Press", duration: "15 min", sets: "5", reps: "10" },
        { name: "Lateral Raises", duration: "12 min", sets: "4", reps: "12-15" },
        { name: "Barbell Shrugs", duration: "12 min", sets: "5", reps: "12" }
      ]
    },
    {
      day: 5,
      name: "Arms Annihilation",
      type: "strength",
      exercises: [
        { name: "Close-grip Bench", duration: "15 min", sets: "5", reps: "8-10" },
        { name: "Barbell Curls", duration: "15 min", sets: "5", reps: "8-10" },
        { name: "Weighted Dips", duration: "12 min", sets: "4", reps: "10" },
        { name: "Cable Curls", duration: "10 min", sets: "4", reps: "15" }
      ]
    },
    {
      day: 6,
      name: "Full Body Strength",
      type: "strength",
      exercises: [
        { name: "Clean and Press", duration: "20 min", sets: "5", reps: "6" },
        { name: "Front Squats", duration: "15 min", sets: "5", reps: "8" },
        { name: "Weighted Pull-ups", duration: "15 min", sets: "5", reps: "8" },
        { name: "Farmer's Walks", duration: "10 min", sets: "4", reps: "40m" }
      ]
    },
    {
      day: 7,
      name: "Rest Day",
      type: "rest",
      isRestDay: true,
      exercises: [
        { name: "Yoga/Stretching", duration: "30 min", sets: "-", reps: "-" },
        { name: "Sauna/Ice Bath", duration: "20 min", sets: "-", reps: "-" }
      ]
    }
  ]
};
