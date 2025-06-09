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
      disaster_name: 'Flood',
      quiz_title: 'Flood Basics: Are You Prepared?',
      quiz_description: 'Test your basic knowledge of flood! This beginner-friendly quiz covers what flood are, how they happen, and what to do to stay safe.',
      difficulty_level: 'Easy',
      questions: [
        {
          question: 'Question 1: What is a flood?',
          points: 10,
          answers: [
            {
              answer_text: 'A sudden snowfall',
              is_correct: false,
            },
            {
              answer_text: 'An overflow of water onto normally dry land',
              is_correct: true,
              answer_explanation: `A flood happens when water overflows or inundates land that is usually dry, often caused by heavy rains, melting snow, or dam failure.`
            },
            {
              answer_text: 'A strong windstorm',
              is_correct: false,
            },
            {
              answer_text: 'A drought',
              is_correct: false,
            },
            
          ]
        },
        {
          question: `Question 2: Which of the following is a common cause of flooding?`,
          points: 10,
          answers: [
            {
              answer_text: 'Tornadoes',
              is_correct: false,
            },
            {
              answer_text: 'Lightning',
              is_correct: false,
            },
            {
              answer_text: 'Heavy rainfall',
              is_correct: true,
              answer_explanation: 'Heavy rainfall is a major cause of flooding, especially when the ground becomes saturated or drainage systems are overwhelmed.'
            },
            {
              answer_text: 'Earthquakes',
              is_correct: false,
            },

          ]

        },

        {
          question: `Question 3: What should you do if there's a flood warning in your area?`,
          points: 10,
          answers: [
            {
              answer_text: 'Go swimming in the water',
              is_correct: false,
            },
            {
              answer_text: 'Drive through the flooded road quickly',
              is_correct: false,
            },
            {
              answer_text: 'Wait outside for help',
              is_correct: false,
            },
            {
              answer_text: 'Stay indoors and move to higher ground',
              is_correct: true,
              answer_explanation: `During a flood warning, it's safest to avoid floodwaters and move to higher ground or the highest part of your home to avoid being trapped.`
            },

          ]

        },

        {
          question: `Question 4: What item is essential in a flood emergency kit?`,
          points: 10,
          answers: [
            {
              answer_text: 'Board games',
              is_correct: false,
            },
            {
              answer_text: 'Sunscreen',
              is_correct: false,
            },
            {
              answer_text: 'Snow boots',
              is_correct: false,
            },
            {
              answer_text: 'Bottled water',
              is_correct: true,
              answer_explanation: 'Floodwaters can contaminate drinking supplies, so bottled water is essential for staying hydrated with clean, safe water.'
            },

          ]

        },
        
        {
          question: `Question 5: Why is it dangerous to walk or drive through floodwaters?`,
          points: 10,
          answers: [
            {
              answer_text: `It's very cold`,
              is_correct: false,
             
            },
            {
              answer_text: 'It might ruin your shoes',
              is_correct: false,
            },
            {
              answer_text: 'Water might be deeper and faster than it looks',
              is_correct: true,
              answer_explanation: 'Just 6 inches of fast-moving floodwater can knock an adult off their feet, and 12 inches can carry away a small car. Floodwater may also hide sharp objects, electrical hazards, or open manholes.'
            },
            {
              answer_text: `It's boring`,
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 6: Which of the following is a sign that flooding might occur soon?`,
          points: 10,
          answers: [
            {
              answer_text: `Heavy rain that doesn't stop`,
              is_correct: true,
              answer_explanation: 'Continuous heavy rain can overwhelm drainage systems and rivers, leading to flooding.'
            },
            {
              answer_text: 'High winds only',
              is_correct: false,
            },
            {
              answer_text: 'Clear blue skies',
              is_correct: false,
            },
            {
              answer_text: 'Dry ground',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 7: What should you do before a flood to prepare your home?`,
          points: 10,
          answers: [
            {
              answer_text: 'Dig holes in the ground',
              is_correct: false,
            },
            {
              answer_text: 'Open all doors and windows',
              is_correct: false,
            },
            {
              answer_text: 'Move valuables to a higher level',
              is_correct: true,
              answer_explanation: 'Securing tall or heavy furniture prevents it from tipping over during an earthquake, reducing injury risk.'
            },
            {
              answer_text: 'Leave all electronics plugged in',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 8: What is the safest thing to do if you are outside and see floodwaters rising?`,
          points: 10,
          answers: [
            {
              answer_text: 'Move to higher ground immediately',
              is_correct: true,
              answer_explanation: `Getting to higher ground reduces your risk of getting caught in dangerous, fast-moving floodwaters.`
            },
            {
              answer_text: 'Sit and watch',
              is_correct: false,
            },
            {
              answer_text: 'Wait for a boat',
              is_correct: false,
            },
            {
              answer_text: 'Try to swim across',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 9: Which of these buildings is least likely to be damaged by a flood?`,
          points: 10,
          answers: [
            {
              answer_text: 'A house in a valley',
              is_correct: false,
            },
            {
              answer_text: 'A basement apartment',
              is_correct: false,
            },
            {
              answer_text: 'A ground-level house near a river',
              is_correct: false,
            },
            {
              answer_text: 'A house on stilts',
              is_correct: true,
              answer_explanation: `Houses built on stilts or elevated foundations are raised above typical flood levels and are less likely to be damaged by water.`
              
            },

          ]

        },

        {
          question: `Question 10: What should you never do during a flood?`,
          points: 10,
          answers: [
            {
              answer_text: 'Watch the news for updates',
              is_correct: false,
            },
            {
              answer_text: 'Use a flashlight if the power is out',
              is_correct: false,
            },
            {
              answer_text: 'Stay away from downed power lines',
              is_correct: false,
            },
            {
              answer_text: 'Play in the water',
              is_correct: true,
              answer_explanation: `Floodwater can be contaminated and hide dangerous objects or currents. It's never safe to play or walk in it.`
              
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
    console.log("Seeding flood quiz question and answer complete.");
    prisma.$disconnect();
  })


  .catch((e) => {
    console.error("Seeding error for flood quiz questions and answer:", e);
    prisma.$disconnect();
    process.exit(1);
  });

