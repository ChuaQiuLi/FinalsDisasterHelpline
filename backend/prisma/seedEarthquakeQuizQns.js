const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



async function upsertQuizWithQuestions(data) {
  try {
    // Find the disaster by name 
    const disaster = await prisma.disaster.findUnique({
      where: { disaster_name: data.disaster_name }

    });


    if (!disaster) {
      console.error(`Disaster '${data.disaster_name}' not found.`);
      return;

    }

    // Check if the quiz already exists for the given title and disaster
    const existingQuiz = await prisma.quiz.findFirst({
      where: {
        quiz_title: data.quiz_title,
        disaster_id: disaster.disaster_id
      },

      include: {
        // Include existing questions and their answers
        quizQuestions: {
          include: { quizAnswer: true }
        }
      }

    });


    // If the quiz exists, delete all related questions and answers 
    if (existingQuiz) {
      // Delete related answers and questions
      for (const question of existingQuiz.quizQuestions) {
        await prisma.quizAnswer.deleteMany({ where: { question_id: question.question_id } });

      }

      await prisma.quizQuestions.deleteMany({
        where: { quiz_id: existingQuiz.quiz_id }

      });

      console.log(`Deleted existing questions for quiz: ${data.quiz_title}`);

    }

    // Upsert the quiz: create if it doesn't exist, or update if it does
    const quiz = await prisma.quiz.upsert({
      where: {
        quiz_title: data.quiz_title
      },

      update: {
        quiz_description: data.quiz_description,
        difficulty_level: data.difficulty_level
      },

      create: {
        disaster_id: disaster.disaster_id,
        quiz_title: data.quiz_title,
        quiz_description: data.quiz_description,
        difficulty_level: data.difficulty_level
      }

    });

    console.log(`Upserted quiz: ${quiz.quiz_title}`);

    // Create questions and answers
    for (const qns of data.questions) {
      const question = await prisma.quizQuestions.create({
        data: {
          quiz_id: quiz.quiz_id,
          question: qns.question,
          points: qns.points,
          quizAnswer: {
            create: qns.answers

          }

        }

      });

      console.log(`Created question: ${question.question}`);

    }

  } 
  
  catch (error) {
    console.error(`Error upserting quiz '${data.quiz_title}':`, error);
  }

}



async function main() {
  const quizSeedData = [
    {
      disaster_name: 'Earthquake',
      quiz_title: 'Earthquake Basics: Are You Prepared?',
      quiz_description: 'Test your basic knowledge of earthquakes! This beginner-friendly quiz covers what earthquakes are, how they happen, and what to do to stay safe.',
      difficulty_level: 'Easy',
      questions: [
        {
          question: 'Question 1: What causes an earthquake?',
          points: '10',
          answers: [
            {
              answer_text: 'Heavy rainfall',
              is_correct: false,
            },
            {
              answer_text: 'Movement of tectonic plates',
              is_correct: true,
              answer_explanation: `Earthquakes occur when stress is released from the movement of tectonic plates under the Earth's surface. This causes the ground to shake.`
            },
            {
              answer_text: 'Volcanoes erupting',
              is_correct: false,
            },
            {
              answer_text: 'Strong winds',
              is_correct: false,
            },
            
          ]
        },
        {
          question: `Question 2: What should you do during an earthquake if you're indoors?`,
          points: '10',
          answers: [
            {
              answer_text: 'Run outside immediately',
              is_correct: false,
            },
            {
              answer_text: 'Use the elevator',
              is_correct: false,
            },
            {
              answer_text: 'Drop, Cover, and Hold On',
              is_correct: true,
              answer_explanation: 'The safest action indoors is to drop to the ground, take cover under sturdy furniture, and hold on until the shaking stops. Running outside can be dangerous due to falling debris.'
            },
            {
              answer_text: 'Stand by a window',
              is_correct: false,
            },

          ]

        },

        {
          question: `Question 3: Where is the safest place to be during an earthquake if you're inside a building?`,
          points: '10',
          answers: [
            {
              answer_text: 'Next to large windows',
              is_correct: false,
            },
            {
              answer_text: 'Under a sturdy table',
              is_correct: true,
              answer_explanation: 'Hiding under something sturdy protects you from falling debris. Avoid windows, elevators, and high places during an earthquake.'
            },
            {
              answer_text: 'In an elevator',
              is_correct: false,
            },
            {
              answer_text: 'On the roof',
              is_correct: false,
            },

          ]

        },

        {
          question: `Question 4: Which of the following is NOT part of an earthquake emergency kit?`,
          points: '10',
          answers: [
            {
              answer_text: 'Flashlight',
              is_correct: false,
            },
            {
              answer_text: 'Canned food',
              is_correct: false,
            },
            {
              answer_text: 'First-aid kit',
              is_correct: false,
            },
            {
              answer_text: 'Video game console',
              is_correct: true,
              answer_explanation: 'An emergency kit includes essentials like food, water, flashlight, batteries, and medical supplies. A video game console is non-essential, relies on electricity, and offers no practical help in an emergency situation.'
            },

          ]

        },
        
        {
          question: `Question 5: Why should you not use elevators during or after an earthquake?`,
          points: '10',
          answers: [
            {
              answer_text: 'Elevators might go too fast',
              is_correct: false,
            },
            {
              answer_text: 'You could get lost',
              is_correct: false,
            },
            {
              answer_text: 'Power failure could trap you inside',
              is_correct: true,
              answer_explanation: 'Earthquakes can knock out power or damage elevator systems, trapping people inside.'
            },
            {
              answer_text: 'Elevators attract lightning',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 6: Which item is most important to have in your emergency kit?`,
          points: '10',
          answers: [
            {
              answer_text: 'A video game',
              is_correct: false,
            },
            {
              answer_text: 'Bottled water',
              is_correct: true,
              answer_explanation: 'Clean drinking water is essential for survival in any emergency situation, including after an earthquake.'
            },
            {
              answer_text: 'A selfie stick',
              is_correct: false,
            },
            {
              answer_text: 'Scented candles',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 7: How should you prepare your furniture to make your home safer in an earthquake?`,
          points: '10',
          answers: [
            {
              answer_text: 'Paint it',
              is_correct: false,
            },
            {
              answer_text: 'Place it near windows',
              is_correct: false,
            },
            {
              answer_text: 'Cover it with blankets',
              is_correct: false,
            },
            {
              answer_text: 'Secure heavy furniture to walls',
              is_correct: true,
              answer_explanation: 'Securing tall or heavy furniture prevents it from tipping over during an earthquake, reducing injury risk.'
              
            },

          ]

        },

        {
          question: `Question 8: What should you avoid doing during an earthquake?`,
          points: '10',
          answers: [
            {
              answer_text: 'Standing under a doorway in modern homes',
              is_correct: true,
              answer_explanation: `In modern buildings, doorways are no stronger than other parts of the house. You're safer under sturdy furniture.`
            },
            {
              answer_text: 'Hiding under furniture',
              is_correct: false,
            },
            {
              answer_text: 'Turning off gas if it leaks',
              is_correct: false,
            },
            {
              answer_text: 'Staying low',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 9: What should you do if you're driving when an earthquake begins?`,
          points: '10',
          answers: [
            {
              answer_text: 'Speed up',
              is_correct: false,
            },
            {
              answer_text: 'Stop in a tunnel',
              is_correct: false,
            },
            {
              answer_text: 'Pull over and stop in a safe area',
              is_correct: true,
              answer_explanation: `The safest option is to pull over, away from bridges, power lines, or overpasses, and wait for the shaking to stop.`
            },
            {
              answer_text: 'Honk to alert others',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 10: What is an "aftershock"?`,
          points: '10',
          answers: [
            {
              answer_text: 'A second unrelated earthquake',
              is_correct: false,
            },
            {
              answer_text: 'A loud noise after the earthquake',
              is_correct: false,
            },
            {
              answer_text: 'A thunderstorm caused by an earthquake',
              is_correct: false,
            },
            {
              answer_text: 'A smaller earthquake following the main one',
              is_correct: true,
              answer_explanation: `Aftershocks are smaller quakes that happen in the same area after the main earthquake, and they can still be dangerous.`
              
            },

          ]

        },


      ]
      
    }
        
    
    
  ];


  try {
    for (const data of quizSeedData) {
      await upsertQuizWithQuestions(data);
    }

  }

  catch (error) {
    console.error("Unexpected error in main loop:", error);
  }


}


main()
  .then(() => {
    console.log("Seeding earthquake quiz question and answer complete.");
    prisma.$disconnect();
  })


  .catch((e) => {
    console.error("Seeding error for earthquake quiz questions and answer:", e);
    prisma.$disconnect();
    process.exit(1);
  });

