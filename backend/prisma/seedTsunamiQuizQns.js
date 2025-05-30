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
      disaster_name: 'Tsunami',
      quiz_title: 'Tsunami Basics: Are You Prepared?',
      quiz_description: 'Test your basic knowledge of tsunami! This beginner-friendly quiz covers what tsunami are, how they happen, and what to do to stay safe.',
      difficulty_level: 'Easy',
      questions: [
        {
          question: 'Question 1: What is a tsunami?',
          points: 10,
          answers: [
            {
              answer_text: 'A giant thunderstorm',
              is_correct: false,
            },
            {
              answer_text: 'A large ocean wave usually caused by underwater earthquakes',
              is_correct: true,
              answer_explanation: `A tsunami is a series of large ocean waves caused primarily by underwater earthquakes, though they can also result from volcanic eruptions or landslides under the sea.`

            },
            {
              answer_text: 'A strong wind current',
              is_correct: false,
              
            },
            {
              answer_text: 'A type of volcano',
              is_correct: false,
            },
            
          ]
        },
        {
          question: `Question 2: Which of the following can cause a tsunami?`,
          points: 10,
          answers: [
            {
              answer_text: 'Forest fire',
              is_correct: false,
              
            },
            {
              answer_text: 'Snowstorm',
              is_correct: false,
            },
            {
              answer_text: 'Tornado',
              is_correct: false,
             
            },
            {
              answer_text: 'Earthquake under the sea',
              is_correct: true,
              answer_explanation: 'While tornadoes and fires are destructive, only underwater earthquakes or similar geological events (like landslides or volcanic eruptions) can displace enough water to create a tsunami.'
            },

          ]

        },

        {
          question: `Question 3: What is a common warning sign of a tsunami at the beach?`,
          points: 10,
          answers: [
            {
              answer_text: 'Sudden and unusual receding of the water from the shoreline',
              is_correct: true,
              answer_explanation: `One major natural warning of an impending tsunami is a sudden retreat of the ocean, exposing the seafloor. People should immediately evacuate if they see this.`
            },
            {
              answer_text: 'Lightning in the sky',
              is_correct: false,
            },
            {
              answer_text: 'High winds',
              is_correct: false,
            },
            {
              answer_text: 'Color change in the water',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 4: Which ocean is most prone to tsunamis?`,
          points: 10,
          answers: [
            {
              answer_text: 'Atlantic Ocean',
              is_correct: false,
            },
            {
              answer_text: 'Pacific Ocean',
              is_correct: true,
              answer_explanation: 'The Pacific Ocean is surrounded by the "Ring of Fire," a region with frequent earthquakes and volcanic activity, making tsunamis more common in this area.'
            },
            {
              answer_text: 'Indian Ocean',
              is_correct: false,
            },
            {
              answer_text: 'Arctic Ocean',
              is_correct: false,
              
            },

          ]

        },
        
        {
          question: `Question 5: What should you do if there is a tsunami warning in your area?`,
          points: 10,
          answers: [
            {
              answer_text: 'Wait for instructions before doing anything',
              is_correct: false,
            },
            {
              answer_text: 'Stay indoors on the ground floor',
              is_correct: false,
              
            },
            {
              answer_text: 'Evacuate to higher ground immediately',
              is_correct: true,
              answer_explanation: 'Tsunamis can arrive quickly. The safest action is to evacuate to higher ground immediately. Waiting or going to lower areas like the beach can be fatal.'
             
            },
            {
              answer_text: 'Go to the beach to see it',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 6: How fast can a tsunami travel in the open ocean?`,
          points: 10,
          answers: [
            {
              answer_text: 'Over 500 km/h',
              is_correct: true,
              answer_explanation: 'In deep ocean water, tsunamis can move faster than a commercial airplane — over 500 km/h — though they are often barely noticeable until they reach shallow water.'
            },
            {
              answer_text: '300 km/h',
              is_correct: false,
              
            },
            {
              answer_text: '200 km/h',
              is_correct: false,
            },
            {
              answer_text: '100 km/h',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 7: Which of these is a good safety tip during a tsunami?`,
          points: 10,
          answers: [
            {
              answer_text: 'Hide under a table',
              is_correct: false,
              
            },
            {
              answer_text: 'Drive toward the coast to get away from the earthquake',
              is_correct: false,
            },
            {
              answer_text: 'Wait to see the wave before reacting',
              is_correct: false,
              
            },
            {
              answer_text: 'Move to high ground immediately',
              is_correct: true,
              answer_explanation: 'Moving to higher ground is the most important step. You should never go toward the coast or wait to see the wave before reacting.'
             
            },

          ]

        },

        {
          question: `Question 8: How many waves can a tsunami have?`,
          points: 10,
          answers: [
            {
              answer_text: 'Several waves over hours',
              is_correct: true,
              answer_explanation: `Tsunamis often come in multiple waves, sometimes hours apart. The first wave is not always the strongest, so it's important to stay away until authorities say it's safe.`
              
            },
            {
              answer_text: 'Only during high tide',
              is_correct: false,
            },
            {
              answer_text: 'Two waves',
              is_correct: false,
              
            },
            {
              answer_text: 'Only one wave',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 9: What should you do after a tsunami hits your area?`,
          points: 10,
          answers: [
            {
              answer_text: 'Return to your home immediately',
              is_correct: false,
            },
            {
              answer_text: 'Light a fire on the beach',
              is_correct: false,
            },
            {
              answer_text: 'Wait for an official "all clear" before returning',
              is_correct: true,
              answer_explanation: `After a tsunami, wait for official news that it's safe. Returning too soon can be dangerous because more waves could still come.`
              
            },
            {
              answer_text: 'Go swimming',
              is_correct: false,
              
              
            },

          ]

        },

        {
          question: `Question 10: Can a tsunami be predicted with 100% accuracy before it happens?`,
          points: 10,
          answers: [
            {
              answer_text: 'Yes, always',
              is_correct: false,
            },
            {
              answer_text: 'Only one day before',
              is_correct: false,
            },
            {
              answer_text: 'No, only detected after the event that causes it',
              is_correct: true,
              answer_explanation: `Tsunamis cannot be predicted before the event (like an earthquake) occurs. Scientists monitor earthquakes and ocean data to issue warnings as early as possible.`
            },
            {
              answer_text: 'Yes, with satellite images',
              is_correct: false,
              
              
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
    console.log("Seeding tsunami quiz question and answer complete.");
    prisma.$disconnect();
  })


  .catch((e) => {
    console.error("Seeding error for tsunami quiz questions and answer:", e);
    prisma.$disconnect();
    process.exit(1);
  });

