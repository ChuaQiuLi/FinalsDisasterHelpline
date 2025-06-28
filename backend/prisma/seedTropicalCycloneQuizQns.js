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
      disaster_name: 'Tropical Cyclone',
      quiz_title: 'Tropical Cyclone Basics: Are You Prepared?',
      quiz_description: 'Test your basic knowledge of tropical cyclone! This beginner-friendly quiz covers what tropical cyclone are, how they happen, and what to do to stay safe.',
      difficulty_level: 'Easy',
      questions: [
        {
          question: 'Question 1: What is another common name for a tropical cyclone in the Atlantic Ocean?',
          points: 10,
          answers: [
            {
              answer_text: 'Typhoon',
              is_correct: false,
            },
            {
              answer_text: 'Hurricane',
              is_correct: true,
              answer_explanation: `In the Atlantic and Northeast Pacific, tropical cyclones are called hurricanes. In the Northwest Pacific, they are known as typhoons, and in the South Pacific/Indian Ocean, simply cyclones.`
            },
            {
              answer_text: 'Tornado',
              is_correct: false,
            },
            {
              answer_text: 'Thunderstorm',
              is_correct: false,
            },
            
          ]
        },
        {
          question: `Question 2: What is the center of a tropical cyclone called?`,
          points: 10,
          answers: [
            {
              answer_text: 'Core',
              is_correct: false,
            },
            {
              answer_text: 'Vortex',
              is_correct: false,
            },
            {
              answer_text: 'Middle',
              is_correct: false,
            },
            {
              answer_text: 'Eye',
              is_correct: true,
              answer_explanation: 'The eye is the calm, clear center of a tropical cyclone, often surrounded by the strongest winds and storms in the eyewall.'
            },

          ]

        },

        {
          question: `Question 3: Which of the following causes the most damage during a tropical cyclone?`,
          points: 10,
          answers: [
            {
              answer_text: 'Wind',
              is_correct: false,
            },
            {
              answer_text: 'Storm surge',
              is_correct: true,
              answer_explanation: `Storm surges—abnormal rises in sea level—cause severe flooding, leading to the most destruction during tropical cyclones, especially in coastal areas.`
            },
            {
              answer_text: 'Hail',
              is_correct: false,
            },
            {
              answer_text: 'Rain',
              is_correct: false,
            },

          ]

        },

        {
          question: `Question 4: Tropical cyclones usually form over:`,
          points: 10,
          answers: [
            {
              answer_text: 'Warm oceans',
              is_correct: true,
              answer_explanation: 'Tropical cyclones form over warm ocean waters (at least 26.5°C or 80°F), which provide the heat and moisture needed to fuel the storm.'
            },
            {
              answer_text: 'Cold oceans',
              is_correct: false,
            },
            {
              answer_text: 'Deserts',
              is_correct: false,
            },
            {
              answer_text: 'Mountains',
              is_correct: false,
            
            },

          ]

        },
        
        {
          question: `Question 5: What is a typical early warning sign of a tropical cyclone?`,
          points: 10,
          answers: [
            {
              answer_text: `Falling barometric pressure`,
              is_correct: true,
              answer_explanation: 'A drop in air pressure is one of the first signs of a developing tropical cyclone, as the storm system pulls in air and moisture.'
            },
            {
              answer_text: 'Snowfall',
              is_correct: false,
            },
            {
              answer_text: 'Sudden temperature drop',
              is_correct: false,
            },
            {
              answer_text: `Earth tremors`,
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 6: What should people do when a cyclone warning is issued?`,
          points: 10,
          answers: [
            {
              answer_text: `Go swimming`,
              is_correct: false,
              
            },
            {
              answer_text: 'Go shopping for fun',
              is_correct: false,
            },
            {
              answer_text: 'Stay indoors and secure belongings',
              is_correct: true,
              answer_explanation: 'When a cyclone warning is issued, people should stay indoors, secure loose objects, and prepare emergency supplies.'
            },
            {
              answer_text: 'Travel to the beach',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 7: What shape does a tropical cyclone usually have when viewed from space?`,
          points: 10,
          answers: [
            {
              answer_text: 'Square',
              is_correct: false,
            },
            {
              answer_text: 'Triangle',
              is_correct: false,
            },
            {
              answer_text: 'Spiral',
              is_correct: true,
              answer_explanation: 'Cyclones have a spiral shape due to the rotation of wind around a central eye. This structure is clearly visible in satellite images.'
            },
            {
              answer_text: 'Rectangle',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 8: What season do tropical cyclones most commonly occur in?`,
          points: 10,
          answers: [
            {
              answer_text: 'Winter',
              is_correct: false,
              
            },
            {
              answer_text: 'Summer/Autumn',
              is_correct: true,
              answer_explanation: `Tropical cyclones most often form during late summer and early autumn, when ocean temperatures are warmest.`
            },
            {
              answer_text: 'Spring',
              is_correct: false,
            },
            {
              answer_text: 'All year equally',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 9: What is the first step in preparing for a tropical cyclone?`,
          points: 10,
          answers: [
            {
              answer_text: 'Ignore the news',
              is_correct: false,
            },
            {
              answer_text: 'Buy extra clothes',
              is_correct: false,
            },
            {
              answer_text: 'Make an emergency plan',
              is_correct: true,
              answer_explanation: `Being prepared means having an emergency plan, securing your home, and knowing evacuation routes before the storm hits.`
            },
            {
              answer_text: 'Go outside to take pictures',
              is_correct: false,
             
              
            },

          ]

        },

        {
          question: `Question 10: Which emergency kit item is essential during a tropical cyclone?`,
          points: 10,
          answers: [
            {
              answer_text: 'Flashlight and batteries',
              is_correct: true,
              answer_explanation: `A flashlight and batteries are important in case of power outages, which are common during cyclones.`
            },
            {
              answer_text: 'Umbrella',
              is_correct: false,
            },
            {
              answer_text: 'Game console',
              is_correct: false,
            },
            {
              answer_text: 'Sunglasses',
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
    console.log("Seeding tropical cyclone quiz question and answer complete.");
    prisma.$disconnect();
  })


  .catch((e) => {
    console.error("Seeding error for tropical cyclone quiz questions and answer:", e);
    prisma.$disconnect();
    process.exit(1);
  });

