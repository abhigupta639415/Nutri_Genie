export const fatLossWorkouts = {
  beginner: [
    {
      day: 1,
      name: "Full Body Cardio",
      type: "cardio",
      exercises: [
        { name: "Brisk Walking", duration: "20 min", sets: "-", reps: "-" },
        { name: "Jumping Jacks", duration: "5 min", sets: "3", reps: "15" },
        { name: "Bodyweight Squats", duration: "10 min", sets: "3", reps: "12" },
        { name: "Mountain Climbers", duration: "5 min", sets: "3", reps: "10" }
      ]
    },
    {
      day: 2,
      name: "Upper Body Strength",
      type: "strength",
      exercises: [
        { name: "Push-ups (Knee)", duration: "10 min", sets: "3", reps: "8-10" },
        { name: "Dumbbell Rows", duration: "10 min", sets: "3", reps: "12" },
        { name: "Shoulder Press", duration: "10 min", sets: "3", reps: "10" },
        { name: "Plank Hold", duration: "5 min", sets: "3", reps: "20s" }
      ]
    },
    {
      day: 3,
      name: "Yoga & Flexibility",
      type: "yoga",
      exercises: [
        { name: "Sun Salutations", duration: "15 min", sets: "5", reps: "-" },
        { name: "Downward Dog", duration: "5 min", sets: "3", reps: "30s" },
        { name: "Warrior Poses", duration: "10 min", sets: "3", reps: "30s each" },
        { name: "Child's Pose", duration: "5 min", sets: "1", reps: "2 min" }
      ]
    },
    {
      day: 4,
      name: "Lower Body & Core",
      type: "strength",
      exercises: [
        { name: "Bodyweight Lunges", duration: "10 min", sets: "3", reps: "12 each" },
        { name: "Glute Bridges", duration: "10 min", sets: "3", reps: "15" },
        { name: "Leg Raises", duration: "8 min", sets: "3", reps: "12" },
        { name: "Russian Twists", duration: "7 min", sets: "3", reps: "20" }
      ]
    },
    {
      day: 5,
      name: "HIIT Cardio Blast",
      type: "hiit",
      exercises: [
        { name: "Burpees", duration: "5 min", sets: "3", reps: "8" },
        { name: "High Knees", duration: "5 min", sets: "3", reps: "30s" },
        { name: "Jump Squats", duration: "5 min", sets: "3", reps: "10" },
        { name: "Bicycle Crunches", duration: "5 min", sets: "3", reps: "20" }
      ]
    },
    {
      day: 6,
      name: "Full Body Circuit",
      type: "strength",
      exercises: [
        { name: "Step-ups", duration: "10 min", sets: "3", reps: "12 each" },
        { name: "Tricep Dips", duration: "8 min", sets: "3", reps: "10" },
        { name: "Wall Sits", duration: "6 min", sets: "3", reps: "30s" },
        { name: "Superman Hold", duration: "6 min", sets: "3", reps: "20s" }
      ]
    },
    {
      day: 7,
      name: "Rest Day",
      type: "rest",
      isRestDay: true,
      exercises: [
        { name: "Light Stretching", duration: "15 min", sets: "-", reps: "-" },
        { name: "Foam Rolling", duration: "10 min", sets: "-", reps: "-" },
        { name: "Meditation", duration: "10 min", sets: "-", reps: "-" }
      ]
    }
  ],
  intermediate: [
    {
      day: 1,
      name: "HIIT Cardio Power",
      type: "hiit",
      exercises: [
        { name: "Burpees", duration: "8 min", sets: "4", reps: "12" },
        { name: "Jump Rope", duration: "10 min", sets: "4", reps: "1 min" },
        { name: "Box Jumps", duration: "10 min", sets: "4", reps: "10" },
        { name: "Sprint Intervals", duration: "12 min", sets: "6", reps: "30s" }
      ]
    },
    {
      day: 2,
      name: "Upper Body Strength",
      type: "strength",
      exercises: [
        { name: "Push-ups", duration: "10 min", sets: "4", reps: "15" },
        { name: "Dumbbell Bench Press", duration: "12 min", sets: "4", reps: "12" },
        { name: "Pull-ups/Rows", duration: "12 min", sets: "4", reps: "10" },
        { name: "Shoulder Press", duration: "10 min", sets: "4", reps: "12" }
      ]
    },
    {
      day: 3,
      name: "Core & Cardio Mix",
      type: "cardio",
      exercises: [
        { name: "Running", duration: "25 min", sets: "-", reps: "-" },
        { name: "Plank Variations", duration: "10 min", sets: "4", reps: "45s each" },
        { name: "Russian Twists", duration: "8 min", sets: "4", reps: "30" },
        { name: "Leg Raises", duration: "8 min", sets: "4", reps: "15" }
      ]
    },
    {
      day: 4,
      name: "Lower Body Power",
      type: "strength",
      exercises: [
        { name: "Squats", duration: "12 min", sets: "4", reps: "15" },
        { name: "Walking Lunges", duration: "12 min", sets: "4", reps: "15 each" },
        { name: "Deadlifts", duration: "12 min", sets: "4", reps: "12" },
        { name: "Calf Raises", duration: "8 min", sets: "4", reps: "20" }
      ]
    },
    {
      day: 5,
      name: "HIIT Circuit",
      type: "hiit",
      exercises: [
        { name: "Mountain Climbers", duration: "8 min", sets: "4", reps: "30s" },
        { name: "Jump Squats", duration: "8 min", sets: "4", reps: "15" },
        { name: "High Knees", duration: "8 min", sets: "4", reps: "30s" },
        { name: "Plank Jacks", duration: "8 min", sets: "4", reps: "20" }
      ]
    },
    {
      day: 6,
      name: "Full Body Circuit",
      type: "strength",
      exercises: [
        { name: "Burpees", duration: "10 min", sets: "4", reps: "10" },
        { name: "Dumbbell Thrusters", duration: "12 min", sets: "4", reps: "12" },
        { name: "Renegade Rows", duration: "10 min", sets: "4", reps: "10 each" },
        { name: "V-ups", duration: "8 min", sets: "4", reps: "15" }
      ]
    },
    {
      day: 7,
      name: "Active Recovery",
      type: "yoga",
      exercises: [
        { name: "Yoga Flow", duration: "30 min", sets: "-", reps: "-" },
        { name: "Stretching", duration: "15 min", sets: "-", reps: "-" },
        { name: "Light Walk", duration: "15 min", sets: "-", reps: "-" }
      ]
    }
  ],
  advanced: [
    {
      day: 1,
      name: "HIIT Power Circuit",
      type: "hiit",
      exercises: [
        { name: "Burpee Box Jumps", duration: "10 min", sets: "5", reps: "15" },
        { name: "Double Unders", duration: "10 min", sets: "5", reps: "50" },
        { name: "Kettlebell Swings", duration: "12 min", sets: "5", reps: "20" },
        { name: "Battle Ropes", duration: "8 min", sets: "5", reps: "30s" }
      ]
    },
    {
      day: 2,
      name: "Upper Body Hypertrophy",
      type: "strength",
      exercises: [
        { name: "Weighted Pull-ups", duration: "12 min", sets: "5", reps: "8-10" },
        { name: "Barbell Bench Press", duration: "15 min", sets: "5", reps: "10" },
        { name: "Dumbbell Rows", duration: "12 min", sets: "5", reps: "12 each" },
        { name: "Arnold Press", duration: "12 min", sets: "4", reps: "12" }
      ]
    },
    {
      day: 3,
      name: "Cardio Endurance",
      type: "cardio",
      exercises: [
        { name: "Interval Running", duration: "35 min", sets: "8", reps: "3 min sprint" },
        { name: "Rowing Machine", duration: "15 min", sets: "-", reps: "-" },
        { name: "Stair Sprints", duration: "10 min", sets: "5", reps: "30s" }
      ]
    },
    {
      day: 4,
      name: "Lower Body Strength",
      type: "strength",
      exercises: [
        { name: "Barbell Squats", duration: "15 min", sets: "5", reps: "10-12" },
        { name: "Romanian Deadlifts", duration: "15 min", sets: "5", reps: "10" },
        { name: "Bulgarian Split Squats", duration: "12 min", sets: "4", reps: "12 each" },
        { name: "Nordic Curls", duration: "10 min", sets: "4", reps: "8" }
      ]
    },
    {
      day: 5,
      name: "Core & Conditioning",
      type: "hiit",
      exercises: [
        { name: "Hanging Leg Raises", duration: "10 min", sets: "5", reps: "15" },
        { name: "Ab Wheel Rollouts", duration: "10 min", sets: "5", reps: "12" },
        { name: "Turkish Get-ups", duration: "12 min", sets: "4", reps: "8 each" },
        { name: "L-sits", duration: "8 min", sets: "4", reps: "30s" }
      ]
    },
    {
      day: 6,
      name: "Full Body Metabolic",
      type: "hiit",
      exercises: [
        { name: "Thrusters", duration: "12 min", sets: "5", reps: "15" },
        { name: "Muscle-ups", duration: "12 min", sets: "5", reps: "8" },
        { name: "Clean and Press", duration: "15 min", sets: "5", reps: "10" },
        { name: "Box Jump Overs", duration: "10 min", sets: "5", reps: "15" }
      ]
    },
    {
      day: 7,
      name: "Active Recovery",
      type: "yoga",
      exercises: [
        { name: "Advanced Yoga Flow", duration: "40 min", sets: "-", reps: "-" },
        { name: "Mobility Work", duration: "20 min", sets: "-", reps: "-" }
      ]
    }
  ]
};
