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
      disaster_name: 'Forest Fire',
      quiz_title: 'Forest Fire Basics: Are You Prepared?',
      quiz_description: 'Test your basic knowledge of forest fire! This beginner-friendly quiz covers what forest fire are, how they happen, and what to do to stay safe.',
      difficulty_level: 'Easy',
      questions: [
        {
          question: 'Question 1: What is the most common natural cause of forest fires?',
          points: 10,
          answers: [
            {
              answer_text: 'Campfires',
              is_correct: false,
            },
            {
              answer_text: 'Cigarettes',
              is_correct: false,

            },
            {
              answer_text: 'Lightning',
              is_correct: true,
              answer_explanation: `Lightning is a natural cause of forest fires, especially in dry forested areas. Human activities are major causes too, but lightning is the most common natural source.`
              
            },
            {
              answer_text: 'Fireworks',
              is_correct: false,
            },
            
          ]
        },
        {
          question: `Question 2: Which condition increases the risk of forest fires the most?`,
          points: 10,
          answers: [
            {
              answer_text: 'High humidity',
              is_correct: false,
              
            },
            {
              answer_text: 'Dry weather',
              is_correct: true,
              answer_explanation: 'Dry weather removes moisture from vegetation, making it easier for fires to ignite and spread quickly.'
            },
            {
              answer_text: 'Cloudy skies',
              is_correct: false,
             
            },
            {
              answer_text: 'Wet soil',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 3: What should you do if you're caught in a forest fire?`,
          points: 10,
          answers: [
            {
              answer_text: 'Move to a cleared area',
              is_correct: true,
              answer_explanation: `Cleared areas like roads, rivers, or rocky grounds have less vegetation to burn, reducing the risk of being caught in the fire.`
            },
            {
              answer_text: 'Run uphill',
              is_correct: false,
            },
            {
              answer_text: 'Hide behind a tree',
              is_correct: false,
            },
            {
              answer_text: 'Take a nap under a bush',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 4: Which of the following is a way to help prevent forest fires?`,
          points: 10,
          answers: [
            {
              answer_text: 'Leaving campfires unattended',
              is_correct: false,
            },
            {
              answer_text: 'Burning trash in the forest',
              is_correct: false,
              
            },
            {
              answer_text: 'Lighting fireworks in the forest',
              is_correct: false,
            },
            {
              answer_text: 'Reporting smoke sightings early',
              is_correct: true,
              answer_explanation: 'Evacuations are to protect lives. Smoke and flames can travel fast, making areas unsafe very quickly.'
              
            },

          ]

        },
        
        {
          question: `Question 5: What is a firebreak?`,
          points: 10,
          answers: [
            {
              answer_text: 'A tool for fighting fire',
              is_correct: false,
            },
            {
              answer_text: 'A cleared strip of land to stop fire spread',
              is_correct: true,
              answer_explanation: 'Firebreaks are gaps in vegetation that act as barriers to slow or stop the progress of a wildfire.'
              
            },
            {
              answer_text: 'A break firefighters take',
              is_correct: false,
              
             
            },
            {
              answer_text: 'A type of forest animal',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 6: Which tool do firefighters often use to detect forest fires early?`,
          points: 10,
          answers: [
            {
              answer_text: 'Microscope',
              is_correct: false,
              
            },
            {
              answer_text: 'Thermometer',
              is_correct: false,
              
            },
            {
              answer_text: 'Flashlight',
              is_correct: false,
            },
            {
              answer_text: 'Satellite images',
              is_correct: true,
              answer_explanation: 'Satellites help monitor large areas and detect hotspots and smoke that indicate fires, especially in remote areas.'
              
            },

          ]

        },

        {
          question: `Question 7: Which season is forest fire risk usually the highest?`,
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
              answer_text: 'Autumn',
              is_correct: false,
              
            },
            {
              answer_text: 'Summer',
              is_correct: true,
              answer_explanation: 'Summer months are usually hot and dry, which increases the risk of wildfires starting and spreading.'
             
            },

          ]

        },

        {
          question: `Question 8: What does defensible space mean around a home near a forest?`,
          points: 10,
          answers: [
            {
              answer_text: 'Keeping your house hidden',
              is_correct: false,

            },
            {
              answer_text: 'Building a tall wall',
              is_correct: false,
            },
            {
              answer_text: 'Clearing flammable items around the house',
              is_correct: true,
              answer_explanation: `A defensible space helps stop fire from reaching your home by removing trees, dry grass, and other flammable materials nearby.`
              
            },
            {
              answer_text: 'Leaving trees close to your house',
              is_correct: false,
              
            },

          ]

        },

        {
          question: `Question 9: What is the purpose of the "Stop, Drop, and Roll" fire safety technique?`,
          points: 10,
          answers: [
            {
              answer_text: 'Avoiding falling',
              is_correct: false,
            },
            {
              answer_text: 'Escaping from a forest',
              is_correct: false,
            },
            {
              answer_text: 'Climbing a tree',
              is_correct: false,
            },
            {
              answer_text: 'Putting out fire on your clothes',
              is_correct: true,
              answer_explanation: `"Stop, Drop, and Roll" is a fire safety method used to extinguish flames if your clothes catch on fire. Stopping prevents fanning the flames, dropping gets you to the ground, and rolling helps smother the fire.`
              
              
            },

          ]

        },

        {
          question: `Question 10: What should you wear to protect yourself if near a fire zone?`,
          points: 10,
          answers: [
            {
              answer_text: 'Flip-flops and shorts',
              is_correct: false,
            },
            {
              answer_text: 'Light clothes and sunscreen',
              is_correct: false,
            },
            {
              answer_text: 'Long sleeves and a face covering',
              is_correct: true,
              answer_explanation: `TProtective clothing and covering your mouth and nose help reduce smoke exposure and heat damage.`
            },
            {
              answer_text: 'A swimsuit',
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
    console.log("Seeding forest fire quiz question and answer complete.");
    prisma.$disconnect();
  })


  .catch((e) => {
    console.error("Seeding error for forest fire quiz questions and answer:", e);
    prisma.$disconnect();
    process.exit(1);
  });

