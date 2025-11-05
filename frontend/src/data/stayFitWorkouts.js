export const stayFitWorkouts = {
  beginner: [
    { day: 1, name: "Full Body Basics", type: "strength", exercises: [
      { name: "Bodyweight Squats", duration: "10 min", sets: "3", reps: "15" },
      { name: "Push-ups", duration: "8 min", sets: "3", reps: "10" },
      { name: "Plank", duration: "5 min", sets: "3", reps: "30s" }
    ]},
    { day: 2, name: "Cardio Fun", type: "cardio", exercises: [
      { name: "Brisk Walking", duration: "30 min", sets: "-", reps: "-" },
      { name: "Jumping Jacks", duration: "5 min", sets: "3", reps: "20" },
      { name: "Dancing", duration: "15 min", sets: "-", reps: "-" }
    ]},
    { day: 3, name: "Yoga & Flexibility", type: "yoga", exercises: [
      { name: "Sun Salutations", duration: "20 min", sets: "6", reps: "-" },
      { name: "Warrior Sequence", duration: "15 min", sets: "-", reps: "-" },
      { name: "Stretching", duration: "10 min", sets: "-", reps: "-" }
    ]},
    { day: 4, name: "Light Strength", type: "strength", exercises: [
      { name: "Wall Push-ups", duration: "8 min", sets: "3", reps: "12" },
      { name: "Chair Squats", duration: "8 min", sets: "3", reps: "12" },
      { name: "Standing Crunches", duration: "6 min", sets: "3", reps: "15" }
    ]},
    { day: 5, name: "Fun Cardio Mix", type: "cardio", exercises: [
      { name: "Cycling", duration: "25 min", sets: "-", reps: "-" },
      { name: "Jump Rope", duration: "8 min", sets: "3", reps: "30s" },
      { name: "Stair Climbing", duration: "10 min", sets: "-", reps: "-" }
    ]},
    { day: 6, name: "Active Day", type: "strength", exercises: [
      { name: "Bodyweight Circuit", duration: "20 min", sets: "3", reps: "10 each" },
      { name: "Core Work", duration: "10 min", sets: "3", reps: "12" },
      { name: "Stretching", duration: "10 min", sets: "-", reps: "-" }
    ]},
    { day: 7, name: "Rest & Relax", type: "rest", isRestDay: true, exercises: [
      { name: "Gentle Walking", duration: "20 min", sets: "-", reps: "-" },
      { name: "Meditation", duration: "15 min", sets: "-", reps: "-" }
    ]}
  ],
  intermediate: [
    { day: 1, name: "Full Body Strength", type: "strength", exercises: [
      { name: "Squats", duration: "12 min", sets: "4", reps: "12" },
      { name: "Push-ups", duration: "10 min", sets: "4", reps: "15" },
      { name: "Lunges", duration: "12 min", sets: "4", reps: "12 each" },
      { name: "Planks", duration: "8 min", sets: "3", reps: "60s" }
    ]},
    { day: 2, name: "Cardio Intervals", type: "cardio", exercises: [
      { name: "Running Intervals", duration: "25 min", sets: "6", reps: "2 min fast" },
      { name: "Jump Rope", duration: "10 min", sets: "4", reps: "1 min" },
      { name: "Burpees", duration: "8 min", sets: "3", reps: "10" }
    ]},
    { day: 3, name: "Yoga Power", type: "yoga", exercises: [
      { name: "Vinyasa Flow", duration: "35 min", sets: "-", reps: "-" },
      { name: "Balance Poses", duration: "15 min", sets: "-", reps: "-" }
    ]},
    { day: 4, name: "Upper Body Focus", type: "strength", exercises: [
      { name: "Dumbbell Press", duration: "12 min", sets: "4", reps: "12" },
      { name: "Rows", duration: "12 min", sets: "4", reps: "12" },
      { name: "Tricep Dips", duration: "10 min", sets: "3", reps: "12" }
    ]},
    { day: 5, name: "HIIT Session", type: "hiit", exercises: [
      { name: "Mountain Climbers", duration: "8 min", sets: "4", reps: "30s" },
      { name: "Jump Squats", duration: "8 min", sets: "4", reps: "12" },
      { name: "High Knees", duration: "8 min", sets: "4", reps: "30s" }
    ]},
    { day: 6, name: "Lower Body & Core", type: "strength", exercises: [
      { name: "Deadlifts", duration: "12 min", sets: "4", reps: "10" },
      { name: "Split Squats", duration: "12 min", sets: "4", reps: "10 each" },
      { name: "Russian Twists", duration: "8 min", sets: "4", reps: "25" }
    ]},
    { day: 7, name: "Active Recovery", type: "yoga", exercises: [
      { name: "Gentle Yoga", duration: "30 min", sets: "-", reps: "-" },
      { name: "Stretching", duration: "20 min", sets: "-", reps: "-" }
    ]}
  ],
  advanced: [
    { day: 1, name: "Power Full Body", type: "strength", exercises: [
      { name: "Barbell Squats", duration: "15 min", sets: "5", reps: "8-10" },
      { name: "Bench Press", duration: "15 min", sets: "5", reps: "8-10" },
      { name: "Pull-ups", duration: "12 min", sets: "5", reps: "10" },
      { name: "Core Circuit", duration: "10 min", sets: "4", reps: "15" }
    ]},
    { day: 2, name: "HIIT Advanced", type: "hiit", exercises: [
      { name: "Burpee Box Jumps", duration: "10 min", sets: "5", reps: "12" },
      { name: "Kettlebell Swings", duration: "12 min", sets: "5", reps: "20" },
      { name: "Battle Ropes", duration: "10 min", sets: "5", reps: "30s" }
    ]},
    { day: 3, name: "Athletic Performance", type: "cardio", exercises: [
      { name: "Sprint Intervals", duration: "30 min", sets: "10", reps: "30s sprint" },
      { name: "Agility Drills", duration: "15 min", sets: "-", reps: "-" },
      { name: "Plyometrics", duration: "15 min", sets: "4", reps: "10" }
    ]},
    { day: 4, name: "Upper Body Power", type: "strength", exercises: [
      { name: "Overhead Press", duration: "15 min", sets: "5", reps: "8" },
      { name: "Weighted Pull-ups", duration: "15 min", sets: "5", reps: "8" },
      { name: "Dips", duration: "12 min", sets: "5", reps: "12" }
    ]},
    { day: 5, name: "Lower Body Explosiveness", type: "strength", exercises: [
      { name: "Front Squats", duration: "15 min", sets: "5", reps: "8" },
      { name: "Deadlifts", duration: "18 min", sets: "5", reps: "6-8" },
      { name: "Jump Squats", duration: "10 min", sets: "5", reps: "12" }
    ]},
    { day: 6, name: "Metabolic Conditioning", type: "hiit", exercises: [
      { name: "Complex Movements", duration: "25 min", sets: "5", reps: "8-10" },
      { name: "Assault Bike", duration: "15 min", sets: "6", reps: "30s sprint" },
      { name: "Sled Push/Pull", duration: "10 min", sets: "5", reps: "30m" }
    ]},
    { day: 7, name: "Active Recovery", type: "yoga", exercises: [
      { name: "Advanced Yoga", duration: "45 min", sets: "-", reps: "-" },
      { name: "Mobility Work", duration: "20 min", sets: "-", reps: "-" }
    ]}
  ]
};
