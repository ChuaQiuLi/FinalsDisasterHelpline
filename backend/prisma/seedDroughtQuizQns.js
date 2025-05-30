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
      disaster_name: 'Drought',
      quiz_title: 'Drought Basics: Are You Prepared?',
      quiz_description: 'Test your basic knowledge of drought! This beginner-friendly quiz covers what drought are, how they happen, and what to do to stay safe.',
      difficulty_level: 'Easy',
      questions: [
        {
          question: 'Question 1: What is a drought?',
          points: 10,
          answers: [
            {
              answer_text: 'Heavy rainfall',
              is_correct: false,
            },
            {
              answer_text: 'A type of earthquake',
              is_correct: false,

            },
            {
              answer_text: 'A long period without enough rainfall',
              is_correct: true,
              answer_explanation: `A drought is a prolonged period of abnormally low rainfall, leading to a shortage of water. It can affect agriculture, water supply, and ecosystems.`
            },
            {
              answer_text: 'A flood caused by snowmelt',
              is_correct: false,
            },
            
          ]
        },
        {
          question: `Question 2: Which of the following is a common effect of droughts?`,
          points: 10,
          answers: [
            {
              answer_text: 'Forest fires',
              is_correct: true,
              answer_explanation: 'Droughts dry out soil and vegetation, making it easier for wildfires to start and spread. This is one of the severe consequences of extended dry conditions.'
            },
            {
              answer_text: 'Heavy snowfall',
              is_correct: false,
            },
            {
              answer_text: 'More rivers forming',
              is_correct: false,
             
            },
            {
              answer_text: 'Increased fish population',
              is_correct: false,
            },

          ]

        },

        {
          question: `Question 3: What should people do during a drought?`,
          points: 10,
          answers: [
            {
              answer_text: 'Take long showers',
              is_correct: false,
            },
            {
              answer_text: 'Water their lawns every day',
              is_correct: false,
            },
            {
              answer_text: 'Use more water to cool off',
              is_correct: false,
            },
            {
              answer_text: 'Limit water use and report leaks',
              is_correct: true,
              answer_explanation: `During droughts, it's essential to conserve water by fixing leaks, reducing non-essential water use, and using efficient appliances.`
            },

          ]

        },

        {
          question: `Question 4: Which weather tool helps monitor droughts?`,
          points: 10,
          answers: [
            {
              answer_text: 'Thermometer',
              is_correct: false,
            },
            {
              answer_text: 'Wind vane',
              is_correct: false,
            },
            {
              answer_text: 'Seismograph',
              is_correct: false,
            },
            {
              answer_text: 'Rain gauge',
              is_correct: true,
              answer_explanation: 'A rain gauge measures the amount of rainfall in an area. It helps scientists monitor rainfall trends and detect early signs of drought.'
            },

          ]

        },
        
        {
          question: `Question 5: What is one major danger of long-term drought?`,
          points: 10,
          answers: [
            {
              answer_text: 'Too much snow',
              is_correct: false,
            },
            {
              answer_text: 'Food shortage',
              is_correct: true,
              answer_explanation: 'Long-term droughts can destroy crops and reduce water for livestock, which can lead to food shortages in affected areas.'
            },
            {
              answer_text: 'Flooding',
              is_correct: false,
             
            },
            {
              answer_text: 'High waves at sea',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 6: Which of these can help during a drought?`,
          points: 10,
          answers: [
            {
              answer_text: 'Leaving sprinklers on all day',
              is_correct: false,
            },
            {
              answer_text: 'Using rainwater collection barrels',
              is_correct: true,
              answer_explanation: 'Rainwater barrels collect water for later use and reduce the need to use treated water from the tap, helping conserve water during dry periods.'
            },
            {
              answer_text: 'Filling swimming pools daily',
              is_correct: false,
            },
            {
              answer_text: 'Washing your car often',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 7: What does it mean when a city is under water restrictions?`,
          points: 10,
          answers: [
            {
              answer_text: 'People can only drink bottled water',
              is_correct: false,
              
            },
            {
              answer_text: 'Everyone must boil water',
              is_correct: false,
            },
            {
              answer_text: 'People must use less water',
              is_correct: true,
              answer_explanation: 'Water restrictions are rules that limit how much water people can use, especially for things like watering lawns or washing cars during droughts.'
            },
            {
              answer_text: 'People can swim every day',
              is_correct: false,
             
            },

          ]

        },

        {
          question: `Question 8: What is one sign that a drought might be happening?`,
          points: 10,
          answers: [
            {
              answer_text: 'Thunderstorms every week',
              is_correct: false,
              
            },
            {
              answer_text: 'Too much snow',
              is_correct: false,
            },
            {
              answer_text: 'Water levels dropping in rivers and lakes',
              is_correct: true,
              answer_explanation: `When water levels drop and there's little to no rainfall for weeks or months, it's a strong sign of a drought.`
            },
            {
              answer_text: 'Daily rainfall',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 9: What color is often used to show drought areas on a weather map?`,
          points: 10,
          answers: [
            {
              answer_text: 'Green',
              is_correct: false,
            },
            {
              answer_text: 'Blue',
              is_correct: false,
            },
            {
              answer_text: 'White',
              is_correct: false,
              
            },
            {
              answer_text: 'Red or brown',
              is_correct: true,
              answer_explanation: `Drought areas are often shown in red or brown to indicate dry or extremely dry conditions.`
              
            },

          ]

        },

        {
          question: `Question 10: Which season is most often linked to droughts?`,
          points: 10,
          answers: [
            {
              answer_text: 'Winter',
              is_correct: false,
            },
            {
              answer_text: 'Spring',
              is_correct: false,
            },
            {
              answer_text: 'Summer',
              is_correct: true,
              answer_explanation: `Summer is usually hot and dry, making it more likely for droughts to happen.`
            },
            {
              answer_text: 'Autumn',
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
    console.log("Seeding drought quiz question and answer complete.");
    prisma.$disconnect();
  })


  .catch((e) => {
    console.error("Seeding error for drought quiz questions and answer:", e);
    prisma.$disconnect();
    process.exit(1);
  });

