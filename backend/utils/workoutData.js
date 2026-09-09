/**
 * Structured workout routine templates for NutriGenie.
 * 6 active training routines per goal and level.
 * Calendar Sundays are dynamically assigned as Rest & Recovery days by exerciseGenerator.
 */

const workoutRoutines = {
  fatLoss: {
    beginner: [
      {
        name: 'Full Body Cardio',
        type: 'cardio',
        duration: '40 min',
        caloriesBurned: 280,
        exercises: [
          { name: 'Brisk Walking', duration: '20 min', sets: '-', reps: '-', notes: 'Maintain steady brisk pace' },
          { name: 'Jumping Jacks', duration: '5 min', sets: '3', reps: '15', notes: 'Keep knees soft on landing' },
          { name: 'Bodyweight Squats', duration: '10 min', sets: '3', reps: '12', notes: 'Chest up, knees tracking toes' },
          { name: 'Mountain Climbers', duration: '5 min', sets: '3', reps: '10', notes: 'Engage core, keep back flat' }
        ]
      },
      {
        name: 'Upper Body Strength',
        type: 'strength',
        duration: '35 min',
        caloriesBurned: 240,
        exercises: [
          { name: 'Push-ups (Knee)', duration: '10 min', sets: '3', reps: '8-10', notes: 'Controlled tempo down and up' },
          { name: 'Dumbbell Rows', duration: '10 min', sets: '3', reps: '12', notes: 'Squeeze shoulder blades together' },
          { name: 'Shoulder Press', duration: '10 min', sets: '3', reps: '10', notes: 'Light dumbbells, full extension' },
          { name: 'Plank Hold', duration: '5 min', sets: '3', reps: '20s', notes: 'Keep straight line from head to heels' }
        ]
      },
      {
        name: 'Yoga & Flexibility',
        type: 'yoga',
        duration: '35 min',
        caloriesBurned: 180,
        exercises: [
          { name: 'Sun Salutations', duration: '15 min', sets: '5', reps: '-', notes: 'Synchronize breath with movement' },
          { name: 'Downward Dog', duration: '5 min', sets: '3', reps: '30s', notes: 'Press heels gently toward mat' },
          { name: 'Warrior Poses', duration: '10 min', sets: '3', reps: '30s each', notes: 'Hold warrior I and II with strong focus' },
          { name: "Child's Pose", duration: '5 min', sets: '1', reps: '2 min', notes: 'Relax shoulders and breathe deep' }
        ]
      },
      {
        name: 'Lower Body & Core',
        type: 'strength',
        duration: '35 min',
        caloriesBurned: 250,
        exercises: [
          { name: 'Bodyweight Lunges', duration: '10 min', sets: '3', reps: '12 each', notes: 'Step forward cleanly, 90-degree knees' },
          { name: 'Glute Bridges', duration: '10 min', sets: '3', reps: '15', notes: 'Drive through heels, pause at top' },
          { name: 'Leg Raises', duration: '8 min', sets: '3', reps: '12', notes: 'Lower back pressed to floor' },
          { name: 'Russian Twists', duration: '7 min', sets: '3', reps: '20', notes: 'Twist torso with control' }
        ]
      },
      {
        name: 'HIIT Cardio Blast',
        type: 'hiit',
        duration: '25 min',
        caloriesBurned: 300,
        exercises: [
          { name: 'Burpees', duration: '5 min', sets: '3', reps: '8', notes: 'Step back if jumping is too intense' },
          { name: 'High Knees', duration: '5 min', sets: '3', reps: '30s', notes: 'Pace yourself, pump your arms' },
          { name: 'Jump Squats', duration: '5 min', sets: '3', reps: '10', notes: 'Soft landing to protect joints' },
          { name: 'Bicycle Crunches', duration: '5 min', sets: '3', reps: '20', notes: 'Elbow to opposite knee smoothly' }
        ]
      },
      {
        name: 'Full Body Circuit',
        type: 'strength',
        duration: '30 min',
        caloriesBurned: 260,
        exercises: [
          { name: 'Step-ups', duration: '10 min', sets: '3', reps: '12 each', notes: 'Use a sturdy bench or chair' },
          { name: 'Tricep Dips', duration: '8 min', sets: '3', reps: '10', notes: 'Keep hips close to the edge' },
          { name: 'Wall Sits', duration: '6 min', sets: '3', reps: '30s', notes: 'Thighs parallel to floor' },
          { name: 'Superman Hold', duration: '6 min', sets: '3', reps: '20s', notes: 'Lift chest and thighs off mat' }
        ]
      }
    ],
    intermediate: [
      {
        name: 'HIIT Cardio Power',
        type: 'hiit',
        duration: '40 min',
        caloriesBurned: 380,
        exercises: [
          { name: 'Burpees', duration: '8 min', sets: '4', reps: '12', notes: 'Fast pace with full jump' },
          { name: 'Jump Rope', duration: '10 min', sets: '4', reps: '1 min', notes: 'Continuous rhythm' },
          { name: 'Box Jumps', duration: '10 min', sets: '4', reps: '10', notes: 'Explosive hip extension' },
          { name: 'Sprint Intervals', duration: '12 min', sets: '6', reps: '30s', notes: '85% max effort sprints' }
        ]
      },
      {
        name: 'Upper Body Sculpt',
        type: 'strength',
        duration: '45 min',
        caloriesBurned: 320,
        exercises: [
          { name: 'Standard Push-ups', duration: '10 min', sets: '4', reps: '15', notes: 'Full depth chest to floor' },
          { name: 'Dumbbell Bench Press', duration: '12 min', sets: '4', reps: '12', notes: 'Moderate-heavy dumbbells' },
          { name: 'Bent-over Rows', duration: '12 min', sets: '4', reps: '12', notes: 'Flat back, squeeze lats' },
          { name: 'Arnold Press', duration: '11 min', sets: '3', reps: '12', notes: 'Smooth rotational press' }
        ]
      },
      {
        name: 'Power Yoga & Core',
        type: 'yoga',
        duration: '40 min',
        caloriesBurned: 220,
        exercises: [
          { name: 'Sun Salutation B', duration: '15 min', sets: '6', reps: '-', notes: 'Fluid flow with deep breathing' },
          { name: 'Crow Pose Prep', duration: '8 min', sets: '4', reps: '15s', notes: 'Knees into triceps, balance' },
          { name: 'Side Plank', duration: '8 min', sets: '3', reps: '30s each', notes: 'Stack feet, lift hips high' },
          { name: 'Boat Pose', duration: '9 min', sets: '4', reps: '40s', notes: 'Chest proud, spine long' }
        ]
      },
      {
        name: 'Lower Body Burn',
        type: 'strength',
        duration: '45 min',
        caloriesBurned: 350,
        exercises: [
          { name: 'Goblet Squats', duration: '12 min', sets: '4', reps: '12', notes: 'Heavy kettlebell/dumbbell' },
          { name: 'Walking Lunges', duration: '12 min', sets: '4', reps: '15 each', notes: 'Continuous stride forward' },
          { name: 'Romanian Deadlifts', duration: '12 min', sets: '4', reps: '12', notes: 'Hinge hips, feel hamstrings' },
          { name: 'Calf Raises', duration: '9 min', sets: '4', reps: '20', notes: 'Full extension on balls of feet' }
        ]
      },
      {
        name: 'Full Body Conditioning',
        type: 'strength',
        duration: '40 min',
        caloriesBurned: 340,
        exercises: [
          { name: 'Kettlebell Swings', duration: '10 min', sets: '4', reps: '20', notes: 'Hip snap, keep arms relaxed' },
          { name: 'Renegade Rows', duration: '10 min', sets: '4', reps: '10 each', notes: 'Minimize hip rotation' },
          { name: 'Thrusters', duration: '10 min', sets: '4', reps: '12', notes: 'Squat directly into overhead press' },
          { name: 'Plank to Push-up', duration: '10 min', sets: '3', reps: '10 each', notes: 'Alternate lead arm' }
        ]
      },
      {
        name: 'Cardio & Core Crusher',
        type: 'cardio',
        duration: '35 min',
        caloriesBurned: 310,
        exercises: [
          { name: 'Rowing/Treadmill', duration: '15 min', sets: '-', reps: '-', notes: 'Interval training format' },
          { name: 'Russian Twists with Weight', duration: '8 min', sets: '3', reps: '24', notes: 'Use 5-8kg plate/dumbbell' },
          { name: 'Hanging Knee Raises', duration: '7 min', sets: '3', reps: '12', notes: 'Curl knees up without swinging' },
          { name: 'Mountain Climbers Fast', duration: '5 min', sets: '3', reps: '45s', notes: 'High turnover speed' }
        ]
      }
    ],
    advanced: [
      {
        name: 'HIIT Extreme',
        type: 'hiit',
        duration: '45 min',
        caloriesBurned: 480,
        exercises: [
          { name: 'Tabata Sprints', duration: '12 min', sets: '8', reps: '20s on / 10s off', notes: '100% all-out effort' },
          { name: 'Devil Presses', duration: '12 min', sets: '4', reps: '10', notes: 'Burpee with dual dumbbells overhead' },
          { name: 'Double Unders', duration: '10 min', sets: '5', reps: '50', notes: 'Fast rope speed' },
          { name: 'Assault Bike Intervals', duration: '11 min', sets: '5', reps: '45s max', notes: 'Maximum RPM sprint' }
        ]
      },
      {
        name: 'Strength & Conditioning',
        type: 'strength',
        duration: '55 min',
        caloriesBurned: 420,
        exercises: [
          { name: 'Barbell Squats', duration: '15 min', sets: '5', reps: '8', notes: '75-80% 1RM, tight core' },
          { name: 'Barbell Bench Press', duration: '15 min', sets: '5', reps: '8', notes: 'Controlled eccentric phase' },
          { name: 'Barbell Deadlifts', duration: '15 min', sets: '4', reps: '6', notes: 'Reset each repetition' },
          { name: 'Weighted Pull-ups', duration: '10 min', sets: '4', reps: '8', notes: 'Full dead-hang to chin over bar' }
        ]
      },
      {
        name: 'Athletic Power Flow',
        type: 'yoga',
        duration: '45 min',
        caloriesBurned: 280,
        exercises: [
          { name: 'Ashtanga Flow', duration: '20 min', sets: '-', reps: '-', notes: 'Primary series dynamic transitions' },
          { name: 'Handstand Kick-ups', duration: '10 min', sets: '5', reps: '5 reps / hold', notes: 'Active shoulder push' },
          { name: 'Scorpion Prep', duration: '8 min', sets: '4', reps: '30s', notes: 'Thoracic extension & core engagement' },
          { name: 'Deep Hip Openers', duration: '7 min', sets: '1', reps: 'Long hold', notes: 'Pigeon pose & frog stretch' }
        ]
      },
      {
        name: 'Lower Body Hypertrophy',
        type: 'strength',
        duration: '55 min',
        caloriesBurned: 450,
        exercises: [
          { name: 'Heavy Squats', duration: '15 min', sets: '5', reps: '6-8', notes: 'Explosive drive out of hole' },
          { name: 'Bulgarian Split Squats', duration: '15 min', sets: '4', reps: '10 each', notes: 'Heavy dumbbells in hand' },
          { name: 'Leg Press', duration: '15 min', sets: '4', reps: '12', notes: 'Controlled deep descent' },
          { name: 'Romanian Deadlifts', duration: '10 min', sets: '4', reps: '10', notes: 'Maintain neutral spine' }
        ]
      },
      {
        name: 'Metabolic Conditioning',
        type: 'hiit',
        duration: '45 min',
        caloriesBurned: 500,
        exercises: [
          { name: 'CrossFit Cindy', duration: '20 min', sets: 'AMRAP', reps: '5 Pull-ups, 10 Push-ups, 15 Squats', notes: 'Relentless steady pace' },
          { name: 'Sled Pushes', duration: '10 min', sets: '5', reps: '30m', notes: 'Heavy weight, drive through turf' },
          { name: 'Box Jump Overs', duration: '8 min', sets: '4', reps: '15', notes: 'Lateral jump & turn' },
          { name: 'Wall Balls', duration: '7 min', sets: '4', reps: '20', notes: 'Target 10-foot line' }
        ]
      },
      {
        name: 'Strength Endurance',
        type: 'strength',
        duration: '50 min',
        caloriesBurned: 400,
        exercises: [
          { name: 'Overhead Press', duration: '15 min', sets: '5', reps: '6-8', notes: 'No leg drive, strict press' },
          { name: 'Barbell Rows', duration: '15 min', sets: '4', reps: '10', notes: 'Pendlay or bent-over style' },
          { name: 'Dips with Weight', duration: '10 min', sets: '4', reps: '10', notes: 'Attach belt with 10-20kg plate' },
          { name: 'Toes to Bar', duration: '10 min', sets: '4', reps: '12', notes: 'Strict hollow-body kip' }
        ]
      }
    ]
  },

  muscleGain: {
    beginner: [
      {
        name: 'Push - Chest & Triceps',
        type: 'strength',
        duration: '45 min',
        caloriesBurned: 280,
        exercises: [
          { name: 'Push-ups', duration: '10 min', sets: '4', reps: '10-12', notes: 'Solid chest pump, slow descent' },
          { name: 'Dumbbell Chest Press', duration: '12 min', sets: '4', reps: '10-12', notes: 'Full stretch at bottom' },
          { name: 'Incline Dumbbell Press', duration: '12 min', sets: '3', reps: '10', notes: 'Targets upper chest fibers' },
          { name: 'Tricep Dips', duration: '11 min', sets: '3', reps: '10', notes: 'Keep elbows tucked in' }
        ]
      },
      {
        name: 'Pull - Back & Biceps',
        type: 'strength',
        duration: '45 min',
        caloriesBurned: 280,
        exercises: [
          { name: 'Assisted Pull-ups', duration: '10 min', sets: '4', reps: '8-10', notes: 'Full range of motion' },
          { name: 'Dumbbell Rows', duration: '12 min', sets: '4', reps: '10-12', notes: 'Pull towards the hip' },
          { name: 'Lat Pulldowns', duration: '12 min', sets: '3', reps: '12', notes: 'Lead with elbows' },
          { name: 'Bicep Curls', duration: '11 min', sets: '4', reps: '12', notes: 'Supinate wrists at the peak' }
        ]
      },
      {
        name: 'Legs & Core',
        type: 'strength',
        duration: '45 min',
        caloriesBurned: 320,
        exercises: [
          { name: 'Goblet Squats', duration: '12 min', sets: '4', reps: '12', notes: 'Deep squat with vertical torso' },
          { name: 'Romanian Deadlifts', duration: '12 min', sets: '4', reps: '10', notes: 'Hamstring stretch and glute squeeze' },
          { name: 'Lunges', duration: '12 min', sets: '3', reps: '12 each', notes: 'Step wide for stability' },
          { name: 'Plank Holds', duration: '9 min', sets: '3', reps: '45s', notes: 'Tight glutes, brace abs' }
        ]
      },
      {
        name: 'Shoulders & Core',
        type: 'strength',
        duration: '40 min',
        caloriesBurned: 260,
        exercises: [
          { name: 'Dumbbell Shoulder Press', duration: '12 min', sets: '4', reps: '10-12', notes: 'Press overhead without arching back' },
          { name: 'Lateral Raises', duration: '10 min', sets: '4', reps: '12', notes: 'Slight bend in elbows, control down' },
          { name: 'Front Raises', duration: '10 min', sets: '3', reps: '12', notes: 'Lift to eye level' },
          { name: 'Ab Crunches', duration: '8 min', sets: '4', reps: '15', notes: 'Focus on abdominal contraction' }
        ]
      },
      {
        name: 'Full Body Strength',
        type: 'strength',
        duration: '50 min',
        caloriesBurned: 340,
        exercises: [
          { name: 'Deadlifts', duration: '15 min', sets: '4', reps: '8-10', notes: 'Hinge pattern with light to moderate weight' },
          { name: 'Bench Press', duration: '12 min', sets: '4', reps: '10', notes: 'Arch upper back slightly, plant feet' },
          { name: 'Squats', duration: '12 min', sets: '4', reps: '10', notes: 'Parallel depth or below' },
          { name: 'Bent-over Rows', duration: '11 min', sets: '3', reps: '12', notes: 'Pull bar/dumbbells to navel' }
        ]
      },
      {
        name: 'Arms & Functional Core',
        type: 'strength',
        duration: '40 min',
        caloriesBurned: 250,
        exercises: [
          { name: 'Hammer Curls', duration: '10 min', sets: '4', reps: '12', notes: 'Builds brachialis and forearm thickness' },
          { name: 'Tricep Rope Pushdowns', duration: '10 min', sets: '4', reps: '12', notes: 'Spread rope apart at bottom' },
          { name: 'Hanging Knee Raises', duration: '10 min', sets: '3', reps: '12', notes: 'Do not swing, lift from hip flexors/abs' },
          { name: 'Cable Woodchops', duration: '10 min', sets: '3', reps: '12 each', notes: 'Rotational oblique power' }
        ]
      }
    ],
    intermediate: [
      {
        name: 'Chest & Triceps Power',
        type: 'strength',
        duration: '50 min',
        caloriesBurned: 340,
        exercises: [
          { name: 'Barbell Bench Press', duration: '15 min', sets: '5', reps: '8-10', notes: 'Progressive overload focus' },
          { name: 'Incline Dumbbell Press', duration: '12 min', sets: '4', reps: '10', notes: 'Upper chest hypertrophy' },
          { name: 'Cable Flyes', duration: '11 min', sets: '4', reps: '12', notes: 'Peak contraction at center' },
          { name: 'Skull Crushers', duration: '12 min', sets: '4', reps: '12', notes: 'Lower behind crown of head' }
        ]
      },
      {
        name: 'Back & Biceps Thickness',
        type: 'strength',
        duration: '50 min',
        caloriesBurned: 340,
        exercises: [
          { name: 'Barbell Rows', duration: '15 min', sets: '4', reps: '8-10', notes: 'Drive elbows past torso' },
          { name: 'Weighted Pull-ups', duration: '12 min', sets: '4', reps: '8', notes: 'Add 5-10kg or bodyweight strict' },
          { name: 'Seated Cable Rows', duration: '12 min', sets: '4', reps: '12', notes: 'Close-grip V-bar' },
          { name: 'Incline Dumbbell Curls', duration: '11 min', sets: '4', reps: '10', notes: 'Full stretch on long head of bicep' }
        ]
      },
      {
        name: 'Quad & Hamstring Dominance',
        type: 'strength',
        duration: '55 min',
        caloriesBurned: 380,
        exercises: [
          { name: 'Barbell Back Squats', duration: '15 min', sets: '5', reps: '8', notes: 'Drive through midfoot' },
          { name: 'Romanian Deadlifts', duration: '15 min', sets: '4', reps: '10', notes: 'Heavy stretch, squeeze glutes at top' },
          { name: 'Leg Press', duration: '13 min', sets: '4', reps: '12', notes: 'Full depth' },
          { name: 'Lying Leg Curls', duration: '12 min', sets: '4', reps: '12', notes: 'Control negative repetition' }
        ]
      },
      {
        name: 'Shoulders & Traps Hypertrophy',
        type: 'strength',
        duration: '45 min',
        caloriesBurned: 300,
        exercises: [
          { name: 'Overhead Barbell Press', duration: '15 min', sets: '4', reps: '8-10', notes: 'Lockout with head through window' },
          { name: 'Dumbbell Lateral Raises', duration: '10 min', sets: '4', reps: '15', notes: 'Drop set on last round' },
          { name: 'Face Pulls', duration: '10 min', sets: '4', reps: '15', notes: 'Rear delt and rotator cuff health' },
          { name: 'Dumbbell Shrugs', duration: '10 min', sets: '4', reps: '12', notes: 'Hold peak contraction for 2s' }
        ]
      },
      {
        name: 'Upper Body Explosiveness',
        type: 'strength',
        duration: '50 min',
        caloriesBurned: 350,
        exercises: [
          { name: 'Incline Bench Press', duration: '15 min', sets: '4', reps: '8', notes: 'Explosive concentric phase' },
          { name: 'T-Bar Rows', duration: '12 min', sets: '4', reps: '10', notes: 'Mid-back thickness' },
          { name: 'Weighted Dips', duration: '12 min', sets: '4', reps: '10', notes: 'Chest lean forward' },
          { name: 'Hammer Preacher Curls', duration: '11 min', sets: '3', reps: '12', notes: 'Isolation on brachialis' }
        ]
      },
      {
        name: 'Lower Body Strength & Core',
        type: 'strength',
        duration: '50 min',
        caloriesBurned: 360,
        exercises: [
          { name: 'Front Squats', duration: '15 min', sets: '4', reps: '8', notes: 'High elbow position, quad focus' },
          { name: 'Bulgarian Split Squats', duration: '15 min', sets: '3', reps: '10 each', notes: 'Unilateral balance & strength' },
          { name: 'Standing Calf Raises', duration: '10 min', sets: '4', reps: '15', notes: 'Deep stretch at bottom' },
          { name: 'Cable Kneeling Crunches', duration: '10 min', sets: '4', reps: '15', notes: 'Curl spine into flexion' }
        ]
      }
    ],
    advanced: [
      {
        name: 'Heavy Push Day',
        type: 'strength',
        duration: '60 min',
        caloriesBurned: 420,
        exercises: [
          { name: 'Pause Bench Press', duration: '18 min', sets: '5', reps: '5', notes: '1 second pause at chest' },
          { name: 'Incline Dumbbell Press', duration: '15 min', sets: '4', reps: '8', notes: 'Heavy dumbbells, controlled' },
          { name: 'Weighted Dips', duration: '15 min', sets: '4', reps: '8', notes: 'Heavy added weight' },
          { name: 'Cable Overhead Tricep Ext', duration: '12 min', sets: '4', reps: '12', notes: 'Long head tricep stretch' }
        ]
      },
      {
        name: 'Heavy Pull Day',
        type: 'strength',
        duration: '60 min',
        caloriesBurned: 420,
        exercises: [
          { name: 'Deadlifts', duration: '20 min', sets: '5', reps: '5', notes: 'Heavy conventional or sumo' },
          { name: 'Weighted Pull-ups', duration: '15 min', sets: '5', reps: '6', notes: 'Chalk up, chin over bar' },
          { name: 'Chest-Supported T-Bar Rows', duration: '13 min', sets: '4', reps: '10', notes: 'Isolate upper back without lower back fatigue' },
          { name: 'Incline Dumbbell Hammer Curls', duration: '12 min', sets: '4', reps: '10', notes: 'Heavy arm overload' }
        ]
      },
      {
        name: 'Leg Annihilation',
        type: 'strength',
        duration: '65 min',
        caloriesBurned: 480,
        exercises: [
          { name: 'Heavy Back Squats', duration: '20 min', sets: '5', reps: '5-6', notes: 'Deep squat with explosive ascent' },
          { name: 'Romanian Deadlifts', duration: '15 min', sets: '4', reps: '8', notes: 'Barbell RDL, hamstrings loaded' },
          { name: 'Hack Squat Machine', duration: '15 min', sets: '4', reps: '10', notes: 'Constant tension without lockout' },
          { name: 'Seated Leg Curls', duration: '15 min', sets: '4', reps: '12', notes: 'Rest-pause set on final round' }
        ]
      },
      {
        name: 'Overhead Power & Delts',
        type: 'strength',
        duration: '50 min',
        caloriesBurned: 350,
        exercises: [
          { name: 'Standing Barbell OHP', duration: '15 min', sets: '5', reps: '6', notes: 'Strict overhead military press' },
          { name: 'Cable Lateral Raises', duration: '12 min', sets: '4', reps: '15', notes: 'Constant cable resistance' },
          { name: 'Rear Delt Flyes', duration: '11 min', sets: '4', reps: '15', notes: 'Rear delt isolation' },
          { name: 'Barbell Upright Rows', duration: '12 min', sets: '3', reps: '10', notes: 'Wide grip to protect shoulders' }
        ]
      },
      {
        name: 'Full Body Power',
        type: 'strength',
        duration: '60 min',
        caloriesBurned: 450,
        exercises: [
          { name: 'Clean & Press', duration: '18 min', sets: '5', reps: '5', notes: 'Olympic compound lift' },
          { name: 'Front Squats', duration: '15 min', sets: '4', reps: '6', notes: 'Clean grip front squat' },
          { name: 'Weighted Push-ups', duration: '14 min', sets: '4', reps: '12', notes: '20kg plate on back' },
          { name: 'Strict Chin-ups', duration: '13 min', sets: '4', reps: '10', notes: 'Bicep & lat pump' }
        ]
      },
      {
        name: 'Hypertrophy Flush',
        type: 'strength',
        duration: '55 min',
        caloriesBurned: 380,
        exercises: [
          { name: 'Incline Cable Flyes', duration: '12 min', sets: '4', reps: '15', notes: 'Squeeze upper chest' },
          { name: 'Lat Pulldowns (Mag Grip)', duration: '12 min', sets: '4', reps: '12', notes: 'Full stretch at top' },
          { name: 'Preacher Curls', duration: '11 min', sets: '4', reps: '12', notes: 'Strict isolation, avoid bouncing' },
          { name: 'Tricep Rope Overhead Ext', duration: '10 min', sets: '4', reps: '15', notes: 'Burnout set' },
          { name: 'Leg Press Drop Set', duration: '10 min', sets: '3', reps: '15-20', notes: 'High volume pump' }
        ]
      }
    ]
  },

  stayFit: {
    beginner: [
      {
        name: 'Full Body Basics',
        type: 'strength',
        duration: '30 min',
        caloriesBurned: 220,
        exercises: [
          { name: 'Bodyweight Squats', duration: '10 min', sets: '3', reps: '15', notes: 'Smooth rhythm, deep breathing' },
          { name: 'Push-ups', duration: '8 min', sets: '3', reps: '10', notes: 'Knee push-ups if needed' },
          { name: 'Plank', duration: '5 min', sets: '3', reps: '30s', notes: 'Hold solid hollow position' }
        ]
      },
      {
        name: 'Cardio Fun',
        type: 'cardio',
        duration: '35 min',
        caloriesBurned: 250,
        exercises: [
          { name: 'Brisk Walking', duration: '20 min', sets: '-', reps: '-', notes: 'Outdoor or treadmill walk' },
          { name: 'Jumping Jacks', duration: '5 min', sets: '3', reps: '20', notes: 'Light on balls of feet' },
          { name: 'Dancing / Aerobics', duration: '10 min', sets: '-', reps: '-', notes: 'Fun upbeat aerobic movement' }
        ]
      },
      {
        name: 'Yoga & Flexibility',
        type: 'yoga',
        duration: '35 min',
        caloriesBurned: 160,
        exercises: [
          { name: 'Sun Salutations', duration: '15 min', sets: '6', reps: '-', notes: 'Flow with long inhalations and exhalations' },
          { name: 'Warrior Sequence', duration: '10 min', sets: '-', reps: '-', notes: 'Balance and leg endurance' },
          { name: 'Full Body Stretching', duration: '10 min', sets: '-', reps: '-', notes: 'Hamstrings, chest, and hip openers' }
        ]
      },
      {
        name: 'Light Strength',
        type: 'strength',
        duration: '30 min',
        caloriesBurned: 200,
        exercises: [
          { name: 'Wall Push-ups', duration: '8 min', sets: '3', reps: '12', notes: 'Good introduction to pushing movements' },
          { name: 'Chair Squats', duration: '8 min', sets: '3', reps: '12', notes: 'Tap chair and stand up tall' },
          { name: 'Standing Crunches', duration: '6 min', sets: '3', reps: '15', notes: 'Knee to opposite elbow while standing' }
        ]
      },
      {
        name: 'Fun Cardio Mix',
        type: 'cardio',
        duration: '35 min',
        caloriesBurned: 260,
        exercises: [
          { name: 'Cycling', duration: '20 min', sets: '-', reps: '-', notes: 'Moderate resistance spin' },
          { name: 'Jump Rope', duration: '8 min', sets: '3', reps: '30s', notes: 'Rhythmic jump' },
          { name: 'Stair Climbing', duration: '7 min', sets: '-', reps: '-', notes: 'Continuous steady stair steps' }
        ]
      },
      {
        name: 'Active Day',
        type: 'strength',
        duration: '35 min',
        caloriesBurned: 230,
        exercises: [
          { name: 'Bodyweight Circuit', duration: '15 min', sets: '3', reps: '10 each', notes: 'Squats, lunges, and push-ups' },
          { name: 'Core Work', duration: '10 min', sets: '3', reps: '12', notes: 'Bird-dogs and dead-bugs' },
          { name: 'Cool-down Stretching', duration: '10 min', sets: '-', reps: '-', notes: 'Lower body relaxation' }
        ]
      }
    ],
    intermediate: [
      {
        name: 'Full Body Strength',
        type: 'strength',
        duration: '45 min',
        caloriesBurned: 320,
        exercises: [
          { name: 'Squats', duration: '12 min', sets: '4', reps: '12', notes: 'Bodyweight or light dumbbells' },
          { name: 'Push-ups', duration: '10 min', sets: '4', reps: '15', notes: 'Chest to floor' },
          { name: 'Lunges', duration: '12 min', sets: '4', reps: '12 each', notes: 'Controlled pace' },
          { name: 'Planks', duration: '8 min', sets: '3', reps: '60s', notes: 'Solid core engagement' }
        ]
      },
      {
        name: 'Cardio Intervals',
        type: 'cardio',
        duration: '40 min',
        caloriesBurned: 340,
        exercises: [
          { name: 'Running Intervals', duration: '20 min', sets: '6', reps: '2 min fast / 1 min jog', notes: 'Pace control' },
          { name: 'Jump Rope', duration: '10 min', sets: '4', reps: '1 min', notes: 'Speed rope cadence' },
          { name: 'Burpees', duration: '8 min', sets: '3', reps: '10', notes: 'Smooth turnover' }
        ]
      },
      {
        name: 'Yoga Power',
        type: 'yoga',
        duration: '45 min',
        caloriesBurned: 220,
        exercises: [
          { name: 'Vinyasa Flow', duration: '30 min', sets: '-', reps: '-', notes: 'Dynamic continuous flow' },
          { name: 'Balance Poses', duration: '15 min', sets: '-', reps: '-', notes: 'Tree pose, eagle pose, half moon' }
        ]
      },
      {
        name: 'Upper Body Focus',
        type: 'strength',
        duration: '40 min',
        caloriesBurned: 290,
        exercises: [
          { name: 'Dumbbell Press', duration: '12 min', sets: '4', reps: '12', notes: 'Chest and tricep stimulus' },
          { name: 'Dumbbell Rows', duration: '12 min', sets: '4', reps: '12', notes: 'Upper back posture correction' },
          { name: 'Tricep Dips', duration: '10 min', sets: '3', reps: '12', notes: 'Full depth' }
        ]
      },
      {
        name: 'HIIT Session',
        type: 'hiit',
        duration: '30 min',
        caloriesBurned: 320,
        exercises: [
          { name: 'Mountain Climbers', duration: '8 min', sets: '4', reps: '30s', notes: 'Fast knee drives' },
          { name: 'Jump Squats', duration: '8 min', sets: '4', reps: '12', notes: 'Cushioned landing' },
          { name: 'High Knees', duration: '8 min', sets: '4', reps: '30s', notes: 'Sprint in place' }
        ]
      },
      {
        name: 'Functional Core & Legs',
        type: 'strength',
        duration: '40 min',
        caloriesBurned: 300,
        exercises: [
          { name: 'Deadlifts', duration: '12 min', sets: '4', reps: '10', notes: 'Posterior chain endurance' },
          { name: 'Split Squats', duration: '12 min', sets: '4', reps: '10 each', notes: 'Single-leg strength' },
          { name: 'Russian Twists', duration: '8 min', sets: '4', reps: '25', notes: 'Rotational core power' }
        ]
      }
    ],
    advanced: [
      {
        name: 'Power Full Body',
        type: 'strength',
        duration: '50 min',
        caloriesBurned: 380,
        exercises: [
          { name: 'Barbell Squats', duration: '15 min', sets: '5', reps: '8-10', notes: 'Explosive drive' },
          { name: 'Bench Press', duration: '15 min', sets: '5', reps: '8-10', notes: 'Solid barbell control' },
          { name: 'Pull-ups', duration: '12 min', sets: '5', reps: '10', notes: 'Strict dead-hang pull-ups' },
          { name: 'Core Circuit', duration: '8 min', sets: '4', reps: '15', notes: 'Ab wheel rollouts and dragon flags' }
        ]
      },
      {
        name: 'HIIT Advanced',
        type: 'hiit',
        duration: '40 min',
        caloriesBurned: 420,
        exercises: [
          { name: 'Burpee Box Jumps', duration: '10 min', sets: '5', reps: '12', notes: 'Jump up immediately after burpee' },
          { name: 'Kettlebell Swings', duration: '12 min', sets: '5', reps: '20', notes: 'Heavy bell, strong hip extension' },
          { name: 'Battle Ropes', duration: '10 min', sets: '5', reps: '30s', notes: 'Alternating waves at high frequency' }
        ]
      },
      {
        name: 'Athletic Performance',
        type: 'cardio',
        duration: '45 min',
        caloriesBurned: 390,
        exercises: [
          { name: 'Sprint Intervals', duration: '20 min', sets: '10', reps: '30s sprint / 30s rest', notes: 'Track or hill sprints' },
          { name: 'Agility Drills', duration: '12 min', sets: '-', reps: '-', notes: 'Cone ladder and shuttle runs' },
          { name: 'Plyometrics', duration: '10 min', sets: '4', reps: '10', notes: 'Broad jumps and tuck jumps' }
        ]
      },
      {
        name: 'Upper Body Power',
        type: 'strength',
        duration: '50 min',
        caloriesBurned: 380,
        exercises: [
          { name: 'Overhead Press', duration: '15 min', sets: '5', reps: '8', notes: 'Heavy standing press' },
          { name: 'Weighted Pull-ups', duration: '15 min', sets: '5', reps: '8', notes: 'Heavy vertical pull' },
          { name: 'Dips', duration: '12 min', sets: '5', reps: '12', notes: 'Bodyweight or weighted dips' }
        ]
      },
      {
        name: 'Lower Body Explosiveness',
        type: 'strength',
        duration: '50 min',
        caloriesBurned: 400,
        exercises: [
          { name: 'Front Squats', duration: '15 min', sets: '5', reps: '8', notes: 'Deep front rack squats' },
          { name: 'Deadlifts', duration: '18 min', sets: '5', reps: '6-8', notes: 'Heavy pulls' },
          { name: 'Jump Squats', duration: '10 min', sets: '5', reps: '12', notes: 'Maximum vertical leap' }
        ]
      },
      {
        name: 'Metabolic Conditioning',
        type: 'hiit',
        duration: '45 min',
        caloriesBurned: 450,
        exercises: [
          { name: 'Complex Movements', duration: '20 min', sets: '5', reps: '8-10', notes: 'Clean into thruster sequence' },
          { name: 'Assault Bike', duration: '15 min', sets: '6', reps: '30s sprint', notes: 'Hard cardio output' },
          { name: 'Sled Push/Pull', duration: '10 min', sets: '5', reps: '30m', notes: 'Full body drive' }
        ]
      }
    ]
  }
};

module.exports = {
  workoutRoutines
};
